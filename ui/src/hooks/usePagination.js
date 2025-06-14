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
import { useState, useMemo, useEffect } from 'react';

export const usePagination = (
    data,
    initialItemsPerPage = 10,
    enabled = true
) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    const totalItems = data.length;
    const totalPages = enabled && itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : (enabled ? 0 : 1);

    const paginatedData = useMemo(() => {
        // When pagination is disabled, return all data
        if (!enabled) {
            return data;
        }
        
        if (itemsPerPage <= 0) {
            return [];
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage, enabled]);

    const hasNextPage = enabled && currentPage < totalPages;
    const hasPreviousPage = enabled && currentPage > 1;

    const goToPage = (page) => {
        if (enabled && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToNextPage = () => {
        if (enabled && hasNextPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (enabled && hasPreviousPage) {
            setCurrentPage(currentPage - 1);
        }
    };

    const resetPage = () => {
        if (enabled) {
            setCurrentPage(1);
        }
    };

    const handleSetItemsPerPage = (newItemsPerPage) => {
        if (enabled) {
            setItemsPerPage(newItemsPerPage);
            setCurrentPage(1);
        }
    };

    useEffect(() => {
        if (enabled) {
            setCurrentPage(1);
        }
    }, [data.length, enabled]);

    useEffect(() => {
        if (enabled && currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage, enabled]);

    return {
        currentPage: enabled ? currentPage : 1,
        totalPages: enabled ? totalPages : 1,
        totalItems,
        itemsPerPage: enabled ? itemsPerPage : totalItems,
        paginatedData,
        hasNextPage: enabled ? hasNextPage : false,
        hasPreviousPage: enabled ? hasPreviousPage : false,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        resetPage,
        setItemsPerPage: handleSetItemsPerPage,
        enabled,
    };
};
