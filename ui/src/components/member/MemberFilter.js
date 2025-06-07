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
import SearchInput from '../denali/SearchInput';
import InputDropdown from '../denali/InputDropdown';

const FilterContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e9ecef;
`;

const FilterSection = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Label = styled.label`
    font-weight: 600;
    color: #495057;
    white-space: nowrap;
`;

const MemberFilter = ({
    searchTerm,
    onSearchChange,
    itemsPerPage,
    onItemsPerPageChange,
}) => {
    const itemsPerPageOptions = [
        { value: 30, name: '30件' },
        { value: 50, name: '50件' },
        { value: 100, name: '100件' },
    ];

    return (
        <FilterContainer data-testid='member-filter'>
            <FilterSection>
                <Label htmlFor='member-search'>メンバー検索:</Label>
                <SearchInput
                    id='member-search'
                    placeholder='アカウント名で検索'
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    data-testid='member-search-input'
                />
            </FilterSection>
            <FilterSection>
                <Label htmlFor='items-per-page'>表示件数:</Label>
                <InputDropdown
                    id='items-per-page'
                    name='items-per-page'
                    options={itemsPerPageOptions}
                    value={String(itemsPerPage)}
                    onChange={(value) => onItemsPerPageChange(Number(value))}
                    data-testid='items-per-page-dropdown'
                />
            </FilterSection>
        </FilterContainer>
    );
};

export default MemberFilter;