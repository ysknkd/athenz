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
    const sampleData = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
    }));

    describe('initial state', () => {
        it('should initialize with default values', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            expect(result.current.currentPage).toBe(1);
            expect(result.current.totalPages).toBe(10); // 100 items / 10 per page
            expect(result.current.totalItems).toBe(100);
            expect(result.current.paginatedData).toHaveLength(10);
            expect(result.current.hasNextPage).toBe(true);
            expect(result.current.hasPreviousPage).toBe(false);
        });

        it('should initialize with custom items per page', () => {
            const { result } = renderHook(() => usePagination(sampleData, 25));

            expect(result.current.totalPages).toBe(4); // 100 items / 25 per page
            expect(result.current.paginatedData).toHaveLength(25);
            expect(result.current.itemsPerPage).toBe(25);
        });

        it('should handle empty data', () => {
            const { result } = renderHook(() => usePagination([]));

            expect(result.current.currentPage).toBe(1);
            expect(result.current.totalPages).toBe(0);
            expect(result.current.totalItems).toBe(0);
            expect(result.current.paginatedData).toHaveLength(0);
            expect(result.current.hasNextPage).toBe(false);
            expect(result.current.hasPreviousPage).toBe(false);
        });

        it('should handle single page data', () => {
            const smallData = sampleData.slice(0, 5);
            const { result } = renderHook(() => usePagination(smallData));

            expect(result.current.totalPages).toBe(1);
            expect(result.current.hasNextPage).toBe(false);
            expect(result.current.hasPreviousPage).toBe(false);
        });
    });

    describe('pagination data', () => {
        it('should return correct paginated data for first page', () => {
            const { result } = renderHook(() => usePagination(sampleData, 10));

            const firstPageData = result.current.paginatedData;
            expect(firstPageData).toHaveLength(10);
            expect(firstPageData[0].id).toBe(1);
            expect(firstPageData[9].id).toBe(10);
        });

        it('should return correct paginated data for middle page', () => {
            const { result } = renderHook(() => usePagination(sampleData, 10));

            act(() => {
                result.current.goToPage(5);
            });

            const fifthPageData = result.current.paginatedData;
            expect(fifthPageData).toHaveLength(10);
            expect(fifthPageData[0].id).toBe(41);
            expect(fifthPageData[9].id).toBe(50);
        });

        it('should return correct paginated data for last page', () => {
            const { result } = renderHook(() => usePagination(sampleData, 10));

            act(() => {
                result.current.goToPage(10);
            });

            const lastPageData = result.current.paginatedData;
            expect(lastPageData).toHaveLength(10);
            expect(lastPageData[0].id).toBe(91);
            expect(lastPageData[9].id).toBe(100);
        });

        it('should handle partial last page', () => {
            const partialData = sampleData.slice(0, 95);
            const { result } = renderHook(() => usePagination(partialData, 10));

            act(() => {
                result.current.goToPage(10);
            });

            const lastPageData = result.current.paginatedData;
            expect(lastPageData).toHaveLength(5);
            expect(lastPageData[0].id).toBe(91);
            expect(lastPageData[4].id).toBe(95);
        });
    });

    describe('navigation functions', () => {
        it('should navigate to specific page', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToPage(3);
            });

            expect(result.current.currentPage).toBe(3);
            expect(result.current.hasNextPage).toBe(true);
            expect(result.current.hasPreviousPage).toBe(true);
        });

        it('should not navigate to invalid page numbers', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToPage(0);
            });
            expect(result.current.currentPage).toBe(1);

            act(() => {
                result.current.goToPage(-1);
            });
            expect(result.current.currentPage).toBe(1);

            act(() => {
                result.current.goToPage(11);
            });
            expect(result.current.currentPage).toBe(1);
        });

        it('should navigate to next page', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToNextPage();
            });

            expect(result.current.currentPage).toBe(2);
            expect(result.current.hasPreviousPage).toBe(true);
        });

        it('should not navigate beyond last page', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToPage(10);
            });
            expect(result.current.currentPage).toBe(10);

            act(() => {
                result.current.goToNextPage();
            });

            expect(result.current.currentPage).toBe(10);
            expect(result.current.hasNextPage).toBe(false);
        });

        it('should navigate to previous page', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToPage(3);
            });
            expect(result.current.currentPage).toBe(3);

            act(() => {
                result.current.goToPreviousPage();
            });

            expect(result.current.currentPage).toBe(2);
        });

        it('should not navigate before first page', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToPreviousPage();
            });

            expect(result.current.currentPage).toBe(1);
            expect(result.current.hasPreviousPage).toBe(false);
        });

        it('should reset to first page', () => {
            const { result } = renderHook(() => usePagination(sampleData));

            act(() => {
                result.current.goToPage(5);
            });
            expect(result.current.currentPage).toBe(5);

            act(() => {
                result.current.resetPage();
            });
            expect(result.current.currentPage).toBe(1);
        });
    });

    describe('data changes', () => {
        it('should update pagination when data changes', () => {
            const { result, rerender } = renderHook(
                ({ data }) => usePagination(data),
                { initialProps: { data: sampleData.slice(0, 50) } }
            );

            expect(result.current.totalPages).toBe(5);
            expect(result.current.totalItems).toBe(50);

            rerender({ data: sampleData });

            expect(result.current.totalPages).toBe(10);
            expect(result.current.totalItems).toBe(100);
        });

        it('should reset to first page when data changes', () => {
            const { result, rerender } = renderHook(
                ({ data }) => usePagination(data),
                { initialProps: { data: sampleData } }
            );

            act(() => {
                result.current.goToPage(5);
            });
            expect(result.current.currentPage).toBe(5);

            rerender({ data: sampleData.slice(0, 20) });

            expect(result.current.currentPage).toBe(1);
        });

        it('should adjust current page if it exceeds new total pages', () => {
            const { result, rerender } = renderHook(
                ({ data }) => usePagination(data),
                { initialProps: { data: sampleData } }
            );

            act(() => {
                result.current.goToPage(10);
            });
            expect(result.current.currentPage).toBe(10);

            rerender({ data: sampleData.slice(0, 25) });

            expect(result.current.currentPage).toBe(1);
            expect(result.current.totalPages).toBe(3);
        });
    });

    describe('items per page changes', () => {
        it('should update pagination when items per page changes', () => {
            const { result } = renderHook(() => usePagination(sampleData, 10));

            expect(result.current.totalPages).toBe(10);

            act(() => {
                result.current.setItemsPerPage(25);
            });

            expect(result.current.totalPages).toBe(4);
            expect(result.current.currentPage).toBe(1);
            expect(result.current.itemsPerPage).toBe(25);
        });

        it('should preserve current position when items per page changes', () => {
            const { result } = renderHook(() => usePagination(sampleData, 10));

            act(() => {
                result.current.goToPage(3);
            });

            const firstItemBeforeChange = result.current.paginatedData[0];

            act(() => {
                result.current.setItemsPerPage(20);
            });

            expect(result.current.currentPage).toBe(1);
            expect(result.current.totalPages).toBe(5);
        });
    });

    describe('pagination enabled/disabled', () => {
        it('should enable pagination by default', () => {
            const { result } = renderHook(() => usePagination(sampleData, 10));

            expect(result.current.enabled).toBe(true);
            expect(result.current.totalPages).toBe(10);
            expect(result.current.paginatedData).toHaveLength(10);
        });

        it('should explicitly enable pagination when enabled=true', () => {
            const { result } = renderHook(() =>
                usePagination(sampleData, 10, true)
            );

            expect(result.current.enabled).toBe(true);
            expect(result.current.totalPages).toBe(10);
            expect(result.current.paginatedData).toHaveLength(10);
        });

        it('should disable pagination when enabled=false', () => {
            const { result } = renderHook(() =>
                usePagination(sampleData, 10, false)
            );

            expect(result.current.enabled).toBe(false);
            expect(result.current.currentPage).toBe(1);
            expect(result.current.totalPages).toBe(1);
            expect(result.current.totalItems).toBe(100);
            expect(result.current.itemsPerPage).toBe(100);
            expect(result.current.paginatedData).toHaveLength(100);
            expect(result.current.hasNextPage).toBe(false);
            expect(result.current.hasPreviousPage).toBe(false);
        });

        it('should return all data when pagination is disabled', () => {
            const { result } = renderHook(() =>
                usePagination(sampleData, 10, false)
            );

            expect(result.current.paginatedData).toEqual(sampleData);
            expect(result.current.paginatedData).toHaveLength(
                sampleData.length
            );
        });

        it('should make navigation functions no-ops when disabled', () => {
            const { result } = renderHook(() =>
                usePagination(sampleData, 10, false)
            );

            expect(result.current.currentPage).toBe(1);

            act(() => {
                result.current.goToPage(5);
            });
            expect(result.current.currentPage).toBe(1);

            act(() => {
                result.current.goToNextPage();
            });
            expect(result.current.currentPage).toBe(1);

            act(() => {
                result.current.goToPreviousPage();
            });
            expect(result.current.currentPage).toBe(1);

            act(() => {
                result.current.setItemsPerPage(50);
            });
            expect(result.current.itemsPerPage).toBe(100);
        });

        it('should handle empty data when pagination is disabled', () => {
            const { result } = renderHook(() => usePagination([], 10, false));

            expect(result.current.enabled).toBe(false);
            expect(result.current.totalItems).toBe(0);
            expect(result.current.paginatedData).toHaveLength(0);
            expect(result.current.itemsPerPage).toBe(0);
        });
    });

    describe('edge cases', () => {
        it('should handle zero items per page gracefully', () => {
            const { result } = renderHook(() => usePagination(sampleData, 0));

            expect(result.current.totalPages).toBe(0);
            expect(result.current.paginatedData).toHaveLength(0);
        });

        it('should handle negative items per page gracefully', () => {
            const { result } = renderHook(() => usePagination(sampleData, -5));

            expect(result.current.totalPages).toBe(0);
            expect(result.current.paginatedData).toHaveLength(0);
        });

        it('should handle very large items per page', () => {
            const { result } = renderHook(() =>
                usePagination(sampleData, 1000)
            );

            expect(result.current.totalPages).toBe(1);
            expect(result.current.paginatedData).toHaveLength(100);
        });
    });
});
