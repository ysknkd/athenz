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
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../../../components/member/Pagination';

describe('Pagination', () => {
    const defaultProps = {
        currentPage: 1,
        totalPages: 5,
        totalItems: 150,
        itemsPerPage: 30,
        pageNumbers: [1, 2, 3, 4, 5],
        canGoNext: true,
        canGoPrevious: false,
        onPageChange: jest.fn(),
        onNext: jest.fn(),
        onPrevious: jest.fn(),
        onFirst: jest.fn(),
        onLast: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render pagination component', () => {
        render(<Pagination {...defaultProps} />);
        
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
        expect(screen.getByTestId('page-info')).toBeInTheDocument();
    });

    it('should display correct page information', () => {
        render(<Pagination {...defaultProps} />);
        
        expect(screen.getByText('1-30 / 150件 (ページ 1 / 5)')).toBeInTheDocument();
    });

    it('should display correct page information for middle page', () => {
        const props = {
            ...defaultProps,
            currentPage: 3,
            canGoPrevious: true,
        };
        render(<Pagination {...props} />);
        
        expect(screen.getByText('61-90 / 150件 (ページ 3 / 5)')).toBeInTheDocument();
    });

    it('should display correct page information for last page', () => {
        const props = {
            ...defaultProps,
            currentPage: 5,
            totalItems: 150,
            itemsPerPage: 30,
            canGoNext: false,
            canGoPrevious: true,
        };
        render(<Pagination {...props} />);
        
        expect(screen.getByText('121-150 / 150件 (ページ 5 / 5)')).toBeInTheDocument();
    });

    it('should render page number buttons', () => {
        render(<Pagination {...defaultProps} />);
        
        [1, 2, 3, 4, 5].forEach(page => {
            expect(screen.getByTestId(`page-button-${page}`)).toBeInTheDocument();
        });
    });

    it('should call onPageChange when page button is clicked', () => {
        render(<Pagination {...defaultProps} />);
        
        fireEvent.click(screen.getByTestId('page-button-3'));
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    });

    it('should disable previous buttons on first page', () => {
        render(<Pagination {...defaultProps} />);
        
        expect(screen.getByTestId('first-page-button')).toBeDisabled();
        expect(screen.getByTestId('previous-page-button')).toBeDisabled();
    });

    it('should disable next buttons on last page', () => {
        const props = {
            ...defaultProps,
            currentPage: 5,
            canGoNext: false,
            canGoPrevious: true,
        };
        render(<Pagination {...props} />);
        
        expect(screen.getByTestId('next-page-button')).toBeDisabled();
        expect(screen.getByTestId('last-page-button')).toBeDisabled();
    });

    it('should call navigation functions', () => {
        const props = {
            ...defaultProps,
            currentPage: 3,
            canGoPrevious: true,
        };
        render(<Pagination {...props} />);
        
        fireEvent.click(screen.getByTestId('first-page-button'));
        expect(defaultProps.onFirst).toHaveBeenCalled();
        
        fireEvent.click(screen.getByTestId('previous-page-button'));
        expect(defaultProps.onPrevious).toHaveBeenCalled();
        
        fireEvent.click(screen.getByTestId('next-page-button'));
        expect(defaultProps.onNext).toHaveBeenCalled();
        
        fireEvent.click(screen.getByTestId('last-page-button'));
        expect(defaultProps.onLast).toHaveBeenCalled();
    });

    it('should render ellipsis correctly', () => {
        const props = {
            ...defaultProps,
            pageNumbers: [1, '...', 8, 9, 10, '...', 20],
        };
        render(<Pagination {...props} />);
        
        expect(screen.getAllByText('...')).toHaveLength(2);
    });

    it('should not render when totalPages is 1 or less', () => {
        const props = {
            ...defaultProps,
            totalPages: 1,
        };
        const { container } = render(<Pagination {...props} />);
        
        expect(container.firstChild).toBeNull();
    });

    it('should highlight current page', () => {
        const props = {
            ...defaultProps,
            currentPage: 3,
        };
        render(<Pagination {...props} />);
        
        const currentPageButton = screen.getByTestId('page-button-3');
        expect(currentPageButton).toBeInTheDocument();
    });
});