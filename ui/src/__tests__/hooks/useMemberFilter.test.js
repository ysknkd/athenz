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
import useMemberFilter from '../../hooks/useMemberFilter';

const mockMembers = [
    { memberName: 'user.john' },
    { memberName: 'user.jane' },
    { memberName: 'service.api' },
    { memberName: 'domain.service' },
    { memberName: 'group.admin' },
];

describe('useMemberFilter', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it('should return initial state with all members', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));
        
        expect(result.current.searchText).toBe('');
        expect(result.current.filteredData).toEqual(mockMembers);
    });

    it('should filter members by search text (case insensitive)', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'john' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.searchText).toBe('john');
        expect(result.current.filteredData).toEqual([
            { memberName: 'user.john' }
        ]);
    });

    it('should filter members by partial match', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'user' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredData).toEqual([
            { memberName: 'user.john' },
            { memberName: 'user.jane' }
        ]);
    });

    it('should handle case insensitive search', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'USER' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredData).toEqual([
            { memberName: 'user.john' },
            { memberName: 'user.jane' }
        ]);
    });

    it('should return empty array when no matches found', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'nonexistent' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredData).toEqual([]);
    });

    it('should return all members when search text is empty', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'john' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        act(() => {
            result.current.handleSearchChange({ target: { value: '' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredData).toEqual(mockMembers);
    });

    it('should clear filter and reset to all members', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'john' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        act(() => {
            result.current.clearFilter();
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.searchText).toBe('');
        expect(result.current.filteredData).toEqual(mockMembers);
    });

    it('should debounce search input', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: 'j' } });
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(result.current.filteredData).toEqual(mockMembers);

        act(() => {
            result.current.handleSearchChange({ target: { value: 'jo' } });
        });

        act(() => {
            jest.advanceTimersByTime(100);
        });

        expect(result.current.filteredData).toEqual(mockMembers);

        act(() => {
            result.current.handleSearchChange({ target: { value: 'john' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredData).toEqual([
            { memberName: 'user.john' }
        ]);
    });

    it('should handle trim whitespace in search text', () => {
        const { result } = renderHook(() => useMemberFilter(mockMembers));

        act(() => {
            result.current.handleSearchChange({ target: { value: '  john  ' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.searchText).toBe('  john  ');
        expect(result.current.filteredData).toEqual([
            { memberName: 'user.john' }
        ]);
    });

    it('should handle empty members array', () => {
        const { result } = renderHook(() => useMemberFilter([]));

        expect(result.current.filteredData).toEqual([]);

        act(() => {
            result.current.handleSearchChange({ target: { value: 'test' } });
        });

        act(() => {
            jest.advanceTimersByTime(200);
        });

        expect(result.current.filteredData).toEqual([]);
    });

    it('should update filtered data when members prop changes', () => {
        const { result, rerender } = renderHook(
            ({ members }) => useMemberFilter(members),
            { initialProps: { members: mockMembers } }
        );

        expect(result.current.filteredData).toEqual(mockMembers);

        const newMembers = [{ memberName: 'user.test' }];
        rerender({ members: newMembers });

        expect(result.current.filteredData).toEqual(newMembers);
    });
});