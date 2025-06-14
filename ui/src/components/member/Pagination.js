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
import Icon from '../denali/icons/Icon';

const PaginationContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    margin: ${(props) => props.inTable ? '0' : '20px 0'};
    color: inherit;
`;

const InfoText = styled.div`
    color: ${colors.grey600};
    font-size: 14px;
    font-weight: normal;
    text-align: center;
`;

const PaginationControls = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`;

const PaginationButton = styled.button`
    background: ${(props) => {
        if (props.$isActive) return colors.brand600;
        return 'transparent';
    }};
    color: ${(props) => {
        if (props.$isActive) return colors.white;
        return colors.brand600;
    }};
    border: 1px solid ${colors.brand600};
    border-radius: 4px;
    padding: 8px 12px;
    min-width: 32px;
    height: auto;
    font-size: 14px;
    font-weight: normal;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
    opacity: ${(props) => props.disabled ? 0.5 : 1};
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover:not(:disabled) {
        background: ${(props) => {
            if (props.$isActive) return colors.brand700;
            return colors.brand200;
        }};
        border-color: ${colors.brand600};
        color: ${(props) => {
            if (props.$isActive) return colors.white;
            return colors.brand600;
        }};
    }
    
    &:focus {
        outline: 2px solid ${colors.brand600};
        outline-offset: 2px;
    }
    
    &:disabled {
        background: transparent;
        border-color: ${colors.grey400};
        color: ${colors.grey400};
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const NavigationButton = styled(PaginationButton)`
    min-width: 80px;
    gap: 8px;
`;

const Ellipsis = styled.span`
    color: ${colors.grey600};
    padding: 8px 4px;
    font-size: 14px;
`;

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    onNextPage,
    onPreviousPage,
    showInfo = true,
    compact = false,
    itemsPerPage = 10,
    memberType = 'members',
    className,
    inTable = false,
}) => {
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < totalPages;

    const handlePageClick = (page) => {
        if (page !== currentPage && onPageChange) {
            onPageChange(page);
        }
    };

    const handlePreviousClick = () => {
        if (hasPrevious && onPreviousPage) {
            onPreviousPage();
        }
    };

    const handleNextClick = () => {
        if (hasNext && onNextPage) {
            onNextPage();
        }
    };

    const handleKeyDown = (event, action) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            action();
        }
    };

    const getVisiblePages = () => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];
        
        if (currentPage <= 4) {
            pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
            pages.push(1, '...', currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2, '...', totalPages);
        }
        
        return pages;
    };

    const visiblePages = compact ? [] : getVisiblePages();

    return (
        <PaginationContainer className={className} inTable={inTable}>
            {showInfo && (
                <InfoText inTable={inTable}>
                    Showing {startItem}-{endItem} of {totalItems} {memberType}
                </InfoText>
            )}
            
            <PaginationControls>
                <NavigationButton
                    disabled={!hasPrevious}
                    onClick={handlePreviousClick}
                    onKeyDown={(e) => handleKeyDown(e, handlePreviousClick)}
                    aria-label="Go to previous page"
                >
                    <Icon icon="arrow-left" size="1em" color="currentColor" />
                    Previous
                </NavigationButton>

                {!compact && visiblePages.map((page, index) => (
                    page === '...' ? (
                        <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
                    ) : (
                        <PaginationButton
                            key={page}
                            $isActive={page === currentPage}
                            inTable={inTable}
                            onClick={() => handlePageClick(page)}
                            onKeyDown={(e) => handleKeyDown(e, () => handlePageClick(page))}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </PaginationButton>
                    )
                ))}

                <NavigationButton
                    disabled={!hasNext}
                    onClick={handleNextClick}
                    onKeyDown={(e) => handleKeyDown(e, handleNextClick)}
                    aria-label="Go to next page"
                >
                    Next
                    <Icon icon="arrow-right" size="1em" color="currentColor" />
                </NavigationButton>
            </PaginationControls>
        </PaginationContainer>
    );
};

export default Pagination;