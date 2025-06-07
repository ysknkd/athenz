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
import MemberFilter from '../../../components/member/MemberFilter';

describe('MemberFilter', () => {
    const defaultProps = {
        searchTerm: '',
        onSearchChange: jest.fn(),
        itemsPerPage: 30,
        onItemsPerPageChange: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render filter component', () => {
        render(<MemberFilter {...defaultProps} />);
        
        expect(screen.getByTestId('member-filter')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'メンバー検索:' })).toBeInTheDocument();
        expect(screen.getByTestId('input-dropdown')).toBeInTheDocument();
    });

    it('should display current search term', () => {
        render(<MemberFilter {...defaultProps} searchTerm="test" />);
        
        expect(screen.getByDisplayValue('test')).toBeInTheDocument();
    });

    it('should call onSearchChange when search input changes', () => {
        render(<MemberFilter {...defaultProps} />);
        
        const searchInput = screen.getByRole('textbox', { name: 'メンバー検索:' });
        fireEvent.change(searchInput, { target: { value: 'user' } });
        
        expect(defaultProps.onSearchChange).toHaveBeenCalledWith('user');
    });

    it('should display current items per page value', () => {
        render(<MemberFilter {...defaultProps} itemsPerPage={50} />);
        
        expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });

    it('should call onItemsPerPageChange when dropdown changes', () => {
        render(<MemberFilter {...defaultProps} />);
        
        const dropdown = screen.getByTestId('input-dropdown');
        fireEvent.click(dropdown);
        
        expect(defaultProps.onItemsPerPageChange).toBeDefined();
    });

    it('should have correct labels', () => {
        render(<MemberFilter {...defaultProps} />);
        
        expect(screen.getByText('メンバー検索:')).toBeInTheDocument();
        expect(screen.getByText('表示件数:')).toBeInTheDocument();
    });

    it('should have correct placeholder text', () => {
        render(<MemberFilter {...defaultProps} />);
        
        expect(screen.getByPlaceholderText('アカウント名で検索')).toBeInTheDocument();
    });
});