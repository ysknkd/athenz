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
import { usePagination } from '../../hooks/usePagination';

describe('usePagination', () => {
    const mockData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
    }));

    it('should initialize with default values', () => {
        const { result } = renderHook(() => usePagination(mockData));

        expect(result.current.currentPage).toBe(1);
        expect(result.current.itemsPerPage).toBe(30);
        expect(result.current.totalItems).toBe(100);
        expect(result.current.totalPages).toBe(4);
        expect(result.current.paginatedData).toHaveLength(30);
        expect(result.current.canGoNext).toBe(true);
        expect(result.current.canGoPrevious).toBe(false);
    });

    it('should initialize with custom itemsPerPage', () => {
        const { result } = renderHook(() => usePagination(mockData, 50));

        expect(result.current.itemsPerPage).toBe(50);
        expect(result.current.totalPages).toBe(2);
        expect(result.current.paginatedData).toHaveLength(50);
    });

    it('should navigate to next page', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.goToNextPage();
        });

        expect(result.current.currentPage).toBe(2);
        expect(result.current.paginatedData[0].name).toBe('Item 31');
        expect(result.current.canGoPrevious).toBe(true);
    });

    it('should navigate to previous page', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.goToPage(2);
        });
        act(() => {
            result.current.goToPreviousPage();
        });

        expect(result.current.currentPage).toBe(1);
        expect(result.current.paginatedData[0].name).toBe('Item 1');
    });

    it('should navigate to specific page', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.goToPage(3);
        });

        expect(result.current.currentPage).toBe(3);
        expect(result.current.paginatedData[0].name).toBe('Item 61');
    });

    it('should navigate to first and last page', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.goToPage(3);
        });
        act(() => {
            result.current.goToFirstPage();
        });

        expect(result.current.currentPage).toBe(1);

        act(() => {
            result.current.goToLastPage();
        });

        expect(result.current.currentPage).toBe(4);
        expect(result.current.canGoNext).toBe(false);
    });

    it('should handle page boundaries correctly', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.goToPage(0);
        });
        expect(result.current.currentPage).toBe(1);

        act(() => {
            result.current.goToPage(999);
        });
        expect(result.current.currentPage).toBe(4);
    });

    it('should update itemsPerPage', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.setItemsPerPage(50);
        });

        expect(result.current.itemsPerPage).toBe(50);
        expect(result.current.totalPages).toBe(2);
        expect(result.current.paginatedData).toHaveLength(50);
    });

    it('should reset pagination', () => {
        const { result } = renderHook(() => usePagination(mockData, 30));

        act(() => {
            result.current.goToPage(3);
        });
        act(() => {
            result.current.resetPagination();
        });

        expect(result.current.currentPage).toBe(1);
    });

    it('should generate correct page numbers', () => {
        const smallData = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
        const { result } = renderHook(() => usePagination(smallData, 10));

        expect(result.current.totalPages).toBe(5);
        expect(result.current.pageNumbers).toEqual([1, 2, 3, 4, 5]);

        const largeData = Array.from({ length: 500 }, (_, i) => ({ id: i + 1 }));
        const { result: largeResult } = renderHook(() => usePagination(largeData, 10));

        expect(largeResult.current.totalPages).toBe(50);
        expect(largeResult.current.pageNumbers).toEqual([1, 2, 3, 4, 5, '...', 50]);

        act(() => {
            largeResult.current.goToPage(25);
        });

        expect(largeResult.current.pageNumbers).toEqual([1, '...', 21, 22, 23, 24, 25, 26, 27, 28, 29, '...', 50]);
    });

    it('should handle empty data', () => {
        const { result } = renderHook(() => usePagination([]));

        expect(result.current.totalItems).toBe(0);
        expect(result.current.totalPages).toBe(0);
        expect(result.current.paginatedData).toHaveLength(0);
        expect(result.current.canGoNext).toBe(false);
        expect(result.current.canGoPrevious).toBe(false);
    });
});