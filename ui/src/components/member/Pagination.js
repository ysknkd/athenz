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

import React from 'react';
import styled from '@emotion/styled';
import { colors } from '../denali/styles';
import Button from '../denali/Button';
import {
    PAGINATION_MAX_PAGE_NUMBERS,
    PAGINATION_ITEMS_PER_PAGE_OPTIONS,
} from '../constants/constants';

const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0;
    padding: 10px 0;
    border-top: 1px solid ${colors.grey200};
`;

const PaginationControls = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const PageButton = styled(Button)`
    min-width: 40px;
    height: 32px;
    padding: 0 8px;
    font-size: 14px;
    
    &[aria-current="page"] {
        background-color: ${colors.brand600};
        color: white;
        border-color: ${colors.brand600};
    }
`;

const NavigationButton = styled(Button)`
    padding: 0 12px;
    height: 32px;
    font-size: 14px;
`;

const PageInfo = styled.div`
    font-size: 14px;
    color: ${colors.grey600};
    margin: 0 20px;
`;

const ItemsPerPageContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${colors.grey600};
`;

const Select = styled.select`
    padding: 4px 8px;
    border: 1px solid ${colors.grey300};
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    
    &:focus {
        outline: none;
        border-color: ${colors.brand600};
    }
`;

function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
    itemsPerPageOptions = PAGINATION_ITEMS_PER_PAGE_OPTIONS,
}) {
    const getPageNumbers = () => {
        if (totalPages <= PAGINATION_MAX_PAGE_NUMBERS) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const sidePages = Math.floor(PAGINATION_MAX_PAGE_NUMBERS / 2);
        let startPage = Math.max(1, currentPage - sidePages);
        let endPage = Math.min(totalPages, currentPage + sidePages);

        if (endPage - startPage + 1 < PAGINATION_MAX_PAGE_NUMBERS) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + PAGINATION_MAX_PAGE_NUMBERS - 1);
            } else {
                startPage = Math.max(1, endPage - PAGINATION_MAX_PAGE_NUMBERS + 1);
            }
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const handleItemsPerPageChange = (event) => {
        onItemsPerPageChange(parseInt(event.target.value, 10));
    };

    const pageNumbers = getPageNumbers();

    return (
        <PaginationContainer>
            <PaginationControls>
                <nav role="navigation" aria-label="Pagination">
                    <NavigationButton
                        onClick={handlePreviousPage}
                        disabled={currentPage <= 1}
                        variant="secondary"
                        aria-label="Previous"
                    >
                        Previous
                    </NavigationButton>
                    
                    {pageNumbers.map((pageNumber) => (
                        <PageButton
                            key={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                            variant="secondary"
                            aria-current={pageNumber === currentPage ? 'page' : undefined}
                            aria-label={pageNumber.toString()}
                        >
                            {pageNumber}
                        </PageButton>
                    ))}
                    
                    <NavigationButton
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages}
                        variant="secondary"
                        aria-label="Next"
                    >
                        Next
                    </NavigationButton>
                </nav>
            </PaginationControls>

            <PageInfo>
                Page {currentPage} / {totalPages}
            </PageInfo>

            <ItemsPerPageContainer>
                <span>Items per page:</span>
                <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    aria-label="Items per page"
                >
                    {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </Select>
            </ItemsPerPageContainer>
        </PaginationContainer>
    );
}

export default Pagination;