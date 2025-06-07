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
import Button from '../denali/Button';
import { colors } from '../denali/styles';

const PaginationContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
`;

const PageInfo = styled.div`
    font-weight: 600;
    color: #495057;
`;

const PageControls = styled.div`
    display: flex;
    gap: 5px;
    align-items: center;
`;

const PageButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== '$isActive'
})`
    min-width: 40px;
    height: 36px;
    padding: 8px 12px;
    font-size: 14px;
    ${(props) =>
        props.$isActive &&
        `
        background-color: ${colors.brand600};
        color: white;
        border-color: ${colors.brand600};
    `}
    ${(props) =>
        props.disabled &&
        `
        opacity: 0.5;
        cursor: not-allowed;
    `}
`;

const EllipsisSpan = styled.span`
    padding: 8px 12px;
    color: #6c757d;
    font-weight: 600;
`;

const Pagination = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    pageNumbers,
    canGoNext,
    canGoPrevious,
    onPageChange,
    onNext,
    onPrevious,
    onFirst,
    onLast,
}) => {
    if (totalPages <= 1) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <PaginationContainer data-testid='pagination'>
            <PageInfo data-testid='page-info'>
                {startItem}-{endItem} / {totalItems}件 (ページ {currentPage} /{' '}
                {totalPages})
            </PageInfo>
            <PageControls>
                <PageButton
                    secondary
                    disabled={!canGoPrevious}
                    onClick={onFirst}
                    data-testid='first-page-button'
                >
                    ≪
                </PageButton>
                <PageButton
                    secondary
                    disabled={!canGoPrevious}
                    onClick={onPrevious}
                    data-testid='previous-page-button'
                >
                    ‹
                </PageButton>
                {pageNumbers.map((pageNumber, index) => {
                    if (pageNumber === '...') {
                        return (
                            <EllipsisSpan key={`ellipsis-${index}`}>
                                ...
                            </EllipsisSpan>
                        );
                    }
                    return (
                        <PageButton
                            key={pageNumber}
                            secondary={pageNumber !== currentPage}
                            $isActive={pageNumber === currentPage}
                            onClick={() => onPageChange(pageNumber)}
                            data-testid={`page-button-${pageNumber}`}
                        >
                            {pageNumber}
                        </PageButton>
                    );
                })}
                <PageButton
                    secondary
                    disabled={!canGoNext}
                    onClick={onNext}
                    data-testid='next-page-button'
                >
                    ›
                </PageButton>
                <PageButton
                    secondary
                    disabled={!canGoNext}
                    onClick={onLast}
                    data-testid='last-page-button'
                >
                    ≫
                </PageButton>
            </PageControls>
        </PaginationContainer>
    );
};

export default Pagination;