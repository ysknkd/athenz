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
import DateUtils from '../utils/DateUtils';
import { withRouter } from 'next/router';
import MemberFilter from './MemberFilter';
import Pagination from './Pagination';
import { useMemberFilter } from '../../hooks/useMemberFilter';
import { usePagination } from '../../hooks/usePagination';

const StyleTable = styled.table`
    width: 100%;
    text-align: center;
    border-spacing: 0;
    display: table;
    border-collapse: separate;
    border-color: black;
    box-sizing: border-box;
    margin-top: 5px;
    box-shadow: 0 1px 4px #d9d9d9;
    border: 5px solid #fff;
    -webkit-border-image: none;
    border-image: none;
    -webkit-border-image: initial;
    border-image: initial;
    max-height: 600px;
`;

const StyledDiv = styled.div`
    display: inline-block;
    overflow-y: scroll;
    max-height: 600px;
`;

const StyledTr = styled.tr`
    &:nth-child(even) {
        background-color: #3570f40d;
    }
`;

const StyledTh = styled.th`
    padding: 6px;
    border: 1px solid #dddddd;
`;

const StyledTd = styled.td`
    border: 1px solid #dddddd;
    padding: 5px;
`;

const GroupMemberListComponent = (props) => {
    const localDate = new DateUtils();
    const groupMembers = props.member.groupMembers || [];

    const {
        searchTerm,
        setSearchTerm,
        filteredMembers,
        hasNoResults,
    } = useMemberFilter(groupMembers);

    const {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        paginatedData,
        pageNumbers,
        canGoNext,
        canGoPrevious,
        goToPage,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPreviousPage,
        setItemsPerPage,
        resetPagination,
    } = usePagination(filteredMembers, 30);

    React.useEffect(() => {
        resetPagination();
    }, [searchTerm, resetPagination]);

    const viewGroup = (e) => {
        e.stopPropagation();
        let dom = props.groupName.split(':group.')[0];
        let grp = props.groupName.split(':group.')[1];
        props.router.push(
            `/domain/${dom}/group/${grp}/members`,
            `/domain/${dom}/group/${grp}/members`
        );
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        resetPagination();
    };

    let rows;
    if (hasNoResults) {
        rows = (
            <StyledTr>
                <StyledTd colSpan={2} style={{ color: '#6c757d' }}>
                    該当するメンバーが見つかりません
                </StyledTd>
            </StyledTr>
        );
    } else if (paginatedData && paginatedData.length > 0) {
        rows = paginatedData.map((item, i) => {
            return (
                <StyledTr key={item.memberName || i}>
                    <StyledTd>{item.memberName}</StyledTd>
                    <StyledTd>
                        {item.expiration
                            ? localDate.getLocalDate(
                                  item.expiration,
                                  props.timeZone,
                                  props.timeZone
                              )
                            : 'N/A'}
                    </StyledTd>
                </StyledTr>
            );
        });
    } else {
        rows = (
            <StyledTr>
                <StyledTd colSpan={2}>{'No members in group.'}</StyledTd>
            </StyledTr>
        );
    }

    return (
        <StyledDiv>
            {groupMembers.length > 0 && (
                <MemberFilter
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
            <StyleTable>
                {groupMembers.length > 0 ? (
                    <StyledTr>
                        <StyledTh> Member </StyledTh>
                        <StyledTh> Expiry </StyledTh>
                    </StyledTr>
                ) : (
                    ''
                )}

                {rows}
                <tfoot colspan={'0'}>
                    <tr>
                        <StyledTd colSpan={2}>
                            <Button secondary onClick={viewGroup}>
                                View Members
                            </Button>
                        </StyledTd>
                    </tr>
                </tfoot>
            </StyleTable>
            {groupMembers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    pageNumbers={pageNumbers}
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                    onPageChange={goToPage}
                    onNext={goToNextPage}
                    onPrevious={goToPreviousPage}
                    onFirst={goToFirstPage}
                    onLast={goToLastPage}
                />
            )}
        </StyledDiv>
    );
};

class GroupMemberList extends React.Component {
    render() {
        return <GroupMemberListComponent {...this.props} />;
    }
}
export default withRouter(GroupMemberList);
