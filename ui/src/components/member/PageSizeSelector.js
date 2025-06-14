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

const SelectorContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: ${(props) => (props.compact ? colors.grey600 : colors.grey800)};
`;

const Label = styled.span`
    color: ${(props) => (props.compact ? colors.grey600 : colors.grey600)};
    font-weight: 500;
    font-size: 14px;
`;

const Select = styled.select`
    background: ${(props) => (props.compact ? colors.grey100 : colors.grey100)};
    border: 1px solid
        ${(props) => (props.compact ? colors.grey500 : colors.grey400)};
    border-radius: 3px;
    padding: ${(props) => (props.compact ? '4px 8px' : '6px 8px')};
    font-size: 14px;
    color: ${(props) => (props.compact ? colors.grey800 : colors.grey800)};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};
    min-width: ${(props) => (props.compact ? '50px' : '60px')};

    &:hover:not(:disabled) {
        border-color: ${colors.grey500};
    }

    &:focus {
        outline: 2px solid ${colors.brand600};
        outline-offset: 2px;
        border-color: ${colors.brand600};
    }

    option {
        background: ${colors.grey100};
        color: ${colors.grey800};
    }
`;

const PageSizeSelector = ({
    value,
    options = [30, 50, 100],
    onChange,
    label = 'Show',
    disabled = false,
    compact = false,
    className,
    testId,
}) => {
    const selectId =
        testId ||
        `page-size-selector-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <SelectorContainer className={className} compact={compact}>
            {label && <Label compact={compact}>{label}</Label>}
            <Select
                id={selectId}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                compact={compact}
                aria-label='Select page size'
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
                {!options.includes(value) && (
                    <option key={value} value={value}>
                        {value}
                    </option>
                )}
            </Select>
        </SelectorContainer>
    );
};

export default PageSizeSelector;
