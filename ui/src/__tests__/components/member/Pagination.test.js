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

const defaultProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: jest.fn(),
    itemsPerPage: 30,
    onItemsPerPageChange: jest.fn(),
    itemsPerPageOptions: [30, 50, 100],
};

describe('Pagination', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render pagination controls correctly', () => {
        render(<Pagination {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByText('Page 1 / 10')).toBeInTheDocument();
        expect(screen.getByDisplayValue('30')).toBeInTheDocument();
    });

    it('should call onPageChange when page number is clicked', () => {
        render(<Pagination {...defaultProps} />);
        
        fireEvent.click(screen.getByRole('button', { name: '3' }));
        
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when previous button is clicked', () => {
        const props = { ...defaultProps, currentPage: 5 };
        render(<Pagination {...props} />);
        
        fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
        
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);
    });

    it('should call onPageChange when next button is clicked', () => {
        const props = { ...defaultProps, currentPage: 5 };
        render(<Pagination {...props} />);
        
        fireEvent.click(screen.getByRole('button', { name: 'Next' }));
        
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(6);
    });

    it('should disable previous button on first page', () => {
        render(<Pagination {...defaultProps} />);
        
        const previousButton = screen.getByRole('button', { name: 'Previous' });
        expect(previousButton).toBeDisabled();
    });

    it('should disable next button on last page', () => {
        const props = { ...defaultProps, currentPage: 10, totalPages: 10 };
        render(<Pagination {...props} />);
        
        const nextButton = screen.getByRole('button', { name: 'Next' });
        expect(nextButton).toBeDisabled();
    });

    it('should highlight current page button', () => {
        const props = { ...defaultProps, currentPage: 3 };
        render(<Pagination {...props} />);
        
        const currentPageButton = screen.getByRole('button', { name: '3' });
        expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('should call onItemsPerPageChange when items per page is changed', () => {
        render(<Pagination {...defaultProps} />);
        
        const select = screen.getByDisplayValue('30');
        fireEvent.change(select, { target: { value: '50' } });
        
        expect(defaultProps.onItemsPerPageChange).toHaveBeenCalledWith(50);
    });

    it('should render correct page numbers for beginning of pagination', () => {
        render(<Pagination {...defaultProps} />);
        
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '10' })).not.toBeInTheDocument();
    });

    it('should render correct page numbers for middle of pagination', () => {
        const props = { ...defaultProps, currentPage: 5, totalPages: 20 };
        render(<Pagination {...props} />);
        
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument();
    });

    it('should render correct page numbers for end of pagination', () => {
        const props = { ...defaultProps, currentPage: 18, totalPages: 20 };
        render(<Pagination {...props} />);
        
        expect(screen.getByRole('button', { name: '12' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '18' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '20' })).toBeInTheDocument();
    });

    it('should handle single page correctly', () => {
        const props = { ...defaultProps, totalPages: 1 };
        render(<Pagination {...props} />);
        
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByText('Page 1 / 1')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
        expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    });

    it('should handle zero pages correctly', () => {
        const props = { ...defaultProps, totalPages: 0 };
        render(<Pagination {...props} />);
        
        expect(screen.getByText('Page 1 / 0')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /^\d+$/ })).not.toBeInTheDocument();
    });

    it('should render all items per page options', () => {
        render(<Pagination {...defaultProps} />);
        
        const select = screen.getByDisplayValue('30');
        
        defaultProps.itemsPerPageOptions.forEach(option => {
            expect(screen.getByRole('option', { name: option.toString() })).toBeInTheDocument();
        });
    });

    it('should have proper accessibility attributes', () => {
        render(<Pagination {...defaultProps} />);
        
        const pagination = screen.getByRole('navigation');
        expect(pagination).toHaveAttribute('aria-label', 'Pagination');
        
        const currentPageButton = screen.getByRole('button', { name: '1' });
        expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });

    it('should handle very small pagination correctly', () => {
        const props = { ...defaultProps, totalPages: 3 };
        render(<Pagination {...props} />);
        
        expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument();
    });

    it('should update items per page display correctly', () => {
        const props = { ...defaultProps, itemsPerPage: 50 };
        render(<Pagination {...props} />);
        
        expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });
});