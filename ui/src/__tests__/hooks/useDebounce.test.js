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
import { useDebounce } from '../../hooks/useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
    afterEach(() => {
        jest.clearAllTimers();
    });

    it('should return initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('initial', 500));
        expect(result.current).toBe('initial');
    });

    it('should debounce value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 },
            }
        );

        expect(result.current).toBe('initial');

        rerender({ value: 'updated', delay: 500 });
        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(result.current).toBe('updated');
    });

    it('should reset timer on rapid value changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 },
            }
        );

        rerender({ value: 'first', delay: 500 });
        act(() => {
            jest.advanceTimersByTime(300);
        });

        rerender({ value: 'second', delay: 500 });
        act(() => {
            jest.advanceTimersByTime(300);
        });

        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(result.current).toBe('second');
    });

    it('should handle delay changes', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 500 },
            }
        );

        rerender({ value: 'updated', delay: 200 });

        act(() => {
            jest.advanceTimersByTime(200);
        });
        expect(result.current).toBe('updated');
    });
});