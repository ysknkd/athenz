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

function usePagination(data, initialItemsPerPage = 30) {
    const [currentPage, setCurrentPageState] = useState(1);
    const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

    const totalPages = useMemo(() => {
        return Math.ceil(data.length / itemsPerPage) || 0;
    }, [data.length, itemsPerPage]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, itemsPerPage]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPageState(totalPages);
        }
    }, [currentPage, totalPages]);

    const setCurrentPage = (page) => {
        const newPage = Math.max(1, Math.min(page, totalPages));
        setCurrentPageState(newPage);
    };

    const setItemsPerPage = (items) => {
        setItemsPerPageState(items);
        setCurrentPageState(1);
    };

    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPageState(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPageState(currentPage - 1);
        }
    };

    const getPageNumbers = () => {
        const maxPages = 9;
        
        if (totalPages <= maxPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const sidePages = Math.floor(maxPages / 2);
        let startPage = Math.max(1, currentPage - sidePages);
        let endPage = Math.min(totalPages, currentPage + sidePages);

        if (endPage - startPage + 1 < maxPages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxPages - 1);
            } else {
                startPage = Math.max(1, endPage - maxPages + 1);
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    return {
        currentPage,
        itemsPerPage,
        totalPages,
        paginatedData,
        setCurrentPage,
        setItemsPerPage,
        goToPage,
        goToNextPage,
        goToPreviousPage,
        getPageNumbers,
    };
}

export default usePagination;