/*
 * Copyright The Athenz Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { renderHook, act } from '@testing-library/react';
import { useMemberFilter } from '../../hooks/useMemberFilter';

jest.useFakeTimers();

describe('useMemberFilter', () => {
    const mockMembers = [
        { memberName: 'user.john' },
        { memberName: 'user.jane' },
        { memberName: 'service.api' },
        { memberName: 'admin.super' },
    ];

    afterEach(() => {
        jest.clearAllTimers();
    });

    it('should return all members when no search term', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        expect(result.current.searchTerm).toBe('');
        expect(result.current.filteredMembers).toEqual(mockMembers);
        expect(result.current.hasNoResults).toBeFalsy();
    });

    it('should filter members by search term after debounce', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.setSearchTerm('john');
        });

        expect(result.current.filteredMembers).toEqual(mockMembers);

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredMembers).toEqual([
            { memberName: 'user.john' },
        ]);
    });

    it('should perform case-insensitive filtering', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.setSearchTerm('USER');
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredMembers).toEqual([
            { memberName: 'user.john' },
            { memberName: 'user.jane' },
        ]);
    });

    it('should return hasNoResults true when no matches', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.setSearchTerm('nonexistent');
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredMembers).toEqual([]);
        expect(result.current.hasNoResults).toBe(true);
    });

    it('should handle partial matches', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.setSearchTerm('ser');
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredMembers).toEqual([
            { memberName: 'user.john' },
            { memberName: 'user.jane' },
            { memberName: 'service.api' },
        ]);
    });

    it('should reset filter when search term is cleared', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.setSearchTerm('john');
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredMembers).toHaveLength(1);

        act(() => {
            result.current.setSearchTerm('');
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredMembers).toEqual(mockMembers);
        expect(result.current.hasNoResults).toBeFalsy();
    });

    it('should handle empty members array', () => {
        const { result } = renderHook(() => useMemberFilter([]));

        expect(result.current.filteredMembers).toEqual([]);
        expect(result.current.hasNoResults).toBeFalsy();

        act(() => {
            result.current.setSearchTerm('test');
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.hasNoResults).toBe(true);
    });
});