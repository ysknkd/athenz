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
import usePagination from '../../hooks/usePagination';

const mockData = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

describe('usePagination', () => {
    it('should return initial state with default values', () => {
        const { result } = renderHook(() => usePagination(mockData));
        
        expect(result.current.currentPage).toBe(1);
        expect(result.current.itemsPerPage).toBe(30);
        expect(result.current.totalPages).toBe(4);
        expect(result.current.paginatedData).toEqual(mockData.slice(0, 30));
    });

    it('should return initial state with custom items per page', () => {
        const { result } = renderHook(() => usePagination(mockData, 50));
        
        expect(result.current.currentPage).toBe(1);
        expect(result.current.itemsPerPage).toBe(50);
        expect(result.current.totalPages).toBe(2);
        expect(result.current.paginatedData).toEqual(mockData.slice(0, 50));
    });

    it('should calculate total pages correctly', () => {
        const { result } = renderHook(() => usePagination(mockData.slice(0, 33), 10));
        
        expect(result.current.totalPages).toBe(4);
    });

    it('should handle goToPage correctly', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToPage(3);
        });

        expect(result.current.currentPage).toBe(3);
        expect(result.current.paginatedData).toEqual(mockData.slice(20, 30));
    });

    it('should handle goToNextPage correctly', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToNextPage();
        });

        expect(result.current.currentPage).toBe(2);
        expect(result.current.paginatedData).toEqual(mockData.slice(10, 20));
    });

    it('should not go beyond last page with goToNextPage', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToPage(10);
        });

        act(() => {
            result.current.goToNextPage();
        });

        expect(result.current.currentPage).toBe(10);
    });

    it('should handle goToPreviousPage correctly', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToPage(3);
        });

        act(() => {
            result.current.goToPreviousPage();
        });

        expect(result.current.currentPage).toBe(2);
        expect(result.current.paginatedData).toEqual(mockData.slice(10, 20));
    });

    it('should not go below first page with goToPreviousPage', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToPreviousPage();
        });

        expect(result.current.currentPage).toBe(1);
    });

    it('should handle setCurrentPage correctly', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.setCurrentPage(5);
        });

        expect(result.current.currentPage).toBe(5);
        expect(result.current.paginatedData).toEqual(mockData.slice(40, 50));
    });

    it('should handle setItemsPerPage correctly and reset to page 1', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToPage(3);
        });

        act(() => {
            result.current.setItemsPerPage(50);
        });

        expect(result.current.currentPage).toBe(1);
        expect(result.current.itemsPerPage).toBe(50);
        expect(result.current.totalPages).toBe(2);
        expect(result.current.paginatedData).toEqual(mockData.slice(0, 50));
    });

    it('should generate page numbers correctly for small pagination', () => {
        const { result } = renderHook(() => usePagination(mockData.slice(0, 30), 10));

        const pageNumbers = result.current.getPageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3]);
    });

    it('should generate page numbers correctly for large pagination with current page at start', () => {
        const { result } = renderHook(() => usePagination(mockData, 5));

        act(() => {
            result.current.goToPage(1);
        });

        const pageNumbers = result.current.getPageNumbers();
        expect(pageNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should generate page numbers correctly for large pagination with current page in middle', () => {
        const { result } = renderHook(() => usePagination(mockData, 5));

        act(() => {
            result.current.goToPage(10);
        });

        const pageNumbers = result.current.getPageNumbers();
        expect(pageNumbers).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14]);
    });

    it('should generate page numbers correctly for large pagination with current page at end', () => {
        const { result } = renderHook(() => usePagination(mockData, 5));

        act(() => {
            result.current.goToPage(20);
        });

        const pageNumbers = result.current.getPageNumbers();
        expect(pageNumbers).toEqual([12, 13, 14, 15, 16, 17, 18, 19, 20]);
    });

    it('should handle empty data', () => {
        const { result } = renderHook(() => usePagination([]));
        
        expect(result.current.currentPage).toBe(1);
        expect(result.current.totalPages).toBe(0);
        expect(result.current.paginatedData).toEqual([]);
    });

    it('should handle single page of data', () => {
        const singlePageData = mockData.slice(0, 5);
        const { result } = renderHook(() => usePagination(singlePageData, 10));
        
        expect(result.current.currentPage).toBe(1);
        expect(result.current.totalPages).toBe(1);
        expect(result.current.paginatedData).toEqual(singlePageData);
    });

    it('should update when data changes', () => {
        const { result, rerender } = renderHook(
            ({ data, itemsPerPage }) => usePagination(data, itemsPerPage),
            { initialProps: { data: mockData.slice(0, 10), itemsPerPage: 5 } }
        );

        expect(result.current.totalPages).toBe(2);

        rerender({ data: mockData.slice(0, 20), itemsPerPage: 5 });

        expect(result.current.totalPages).toBe(4);
    });

    it('should adjust current page when data changes and current page becomes invalid', () => {
        const { result, rerender } = renderHook(
            ({ data, itemsPerPage }) => usePagination(data, itemsPerPage),
            { initialProps: { data: mockData, itemsPerPage: 10 } }
        );

        act(() => {
            result.current.goToPage(5);
        });

        expect(result.current.currentPage).toBe(5);

        rerender({ data: mockData.slice(0, 20), itemsPerPage: 10 });

        expect(result.current.currentPage).toBe(2);
        expect(result.current.totalPages).toBe(2);
    });

    it('should handle boundary validation for goToPage', () => {
        const { result } = renderHook(() => usePagination(mockData, 10));

        act(() => {
            result.current.goToPage(0);
        });
        expect(result.current.currentPage).toBe(1);

        act(() => {
            result.current.goToPage(-1);
        });
        expect(result.current.currentPage).toBe(1);

        act(() => {
            result.current.goToPage(15);
        });
        expect(result.current.currentPage).toBe(10);
    });
});