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
import useDebounce from '../../hooks/useDebounce';

describe('useDebounce', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
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
            jest.advanceTimersByTime(499);
        });
        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(1);
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
            jest.advanceTimersByTime(400);
        });

        rerender({ value: 'second', delay: 500 });
        act(() => {
            jest.advanceTimersByTime(400);
        });

        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(100);
        });
        expect(result.current).toBe('second');
    });

    it('should handle different delay values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: 'initial', delay: 200 },
            }
        );

        rerender({ value: 'updated', delay: 200 });

        act(() => {
            jest.advanceTimersByTime(199);
        });
        expect(result.current).toBe('initial');

        act(() => {
            jest.advanceTimersByTime(1);
        });
        expect(result.current).toBe('updated');
    });

    it('should handle empty string values', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            {
                initialProps: { value: '', delay: 500 },
            }
        );

        expect(result.current).toBe('');

        rerender({ value: 'test', delay: 500 });
        act(() => {
            jest.advanceTimersByTime(500);
        });
        expect(result.current).toBe('test');

        rerender({ value: '', delay: 500 });
        act(() => {
            jest.advanceTimersByTime(500);
        });
        expect(result.current).toBe('');
    });
});