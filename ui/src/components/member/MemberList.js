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
import Alert from '../denali/Alert';
import { MODAL_TIME_OUT } from '../constants/constants';
import AddMember from './AddMember';
import MemberTable from './MemberTable';
import MemberFilter from './MemberFilter';
import Pagination from './Pagination';
import { selectIsLoading } from '../../redux/selectors/loading';
import { selectTimeZone } from '../../redux/selectors/domains';
import { connect } from 'react-redux';
import { ReduxPageLoader } from '../denali/ReduxPageLoader';
import { arrayEquals } from '../utils/ArrayUtils';
import { useMemberFilter } from '../../hooks/useMemberFilter';
import { usePagination } from '../../hooks/usePagination';

const MembersSectionDiv = styled.div`
    margin: 20px;
`;

const AddContainerDiv = styled.div`
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-flow: row nowrap;
    float: right;
`;

const MemberListComponent = (props) => {
    const [showAddMember, setShowAddMember] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [members, setMembers] = React.useState(props.members || []);

    const {
        searchTerm,
        setSearchTerm,
        filteredMembers,
        hasNoResults,
    } = useMemberFilter(members);

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

    const approvedPaginatedData = React.useMemo(() => {
        return paginatedData.filter((item) => item.approved);
    }, [paginatedData]);

    const pendingPaginatedData = React.useMemo(() => {
        return paginatedData.filter((item) => !item.approved);
    }, [paginatedData]);

    React.useEffect(() => {
        if (
            props.collection !== props.collection ||
            props.domain !== props.domain ||
            !arrayEquals(props.members, members)
        ) {
            setMembers(props.members || []);
        }
    }, [props.collection, props.domain, props.members, members]);

    React.useEffect(() => {
        resetPagination();
    }, [searchTerm, resetPagination]);

    const toggleAddMember = () => {
        setShowAddMember(!showAddMember);
    };

    const closeModal = () => {
        setShowSuccess(false);
    };

    const reloadMembers = (successMsg, showSuccessFlag = true) => {
        setShowAddMember(false);
        setShowSuccess(showSuccessFlag);
        setSuccessMessage(successMsg);
        setTimeout(() => {
            setShowSuccess(false);
            setSuccessMessage('');
        }, MODAL_TIME_OUT);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        resetPagination();
    };

    return <MemberListRender 
        {...props}
        showAddMember={showAddMember}
        showSuccess={showSuccess}
        successMessage={successMessage}
        members={members}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredMembers={filteredMembers}
        hasNoResults={hasNoResults}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        totalPages={totalPages}
        approvedPaginatedData={approvedPaginatedData}
        pendingPaginatedData={pendingPaginatedData}
        pageNumbers={pageNumbers}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
        goToPage={goToPage}
        goToFirstPage={goToFirstPage}
        goToLastPage={goToLastPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
        toggleAddMember={toggleAddMember}
        closeModal={closeModal}
        reloadMembers={reloadMembers}
    />;
};

class MemberListRender extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        const { domain, collection, collectionDetails } = this.props;
        let approvedMembers = [];
        let pendingMembers = [];
        let addMemberButton = '';
        let justificationReq =
            this.props.isDomainAuditEnabled ||
            collectionDetails.reviewEnabled ||
            collectionDetails.selfServe;
        let addMember = this.props.showAddMember ? (
            <AddMember
                category={this.props.category}
                domainName={this.props.domain}
                collection={this.props.collection}
                onSubmit={this.props.reloadMembers}
                onCancel={this.props.toggleAddMember}
                _csrf={this.props._csrf}
                showAddMember={this.props.showAddMember}
                justificationRequired={justificationReq}
            />
        ) : (
            ''
        );
        if (collectionDetails.trust) {
            approvedMembers = this.props.approvedPaginatedData;
            pendingMembers = [];
        } else {
            approvedMembers = this.props.approvedPaginatedData;
            pendingMembers = this.props.pendingPaginatedData;
        }
        addMemberButton = (
            <AddContainerDiv>
                <div>
                    <Button secondary onClick={this.props.toggleAddMember}>
                        Add Member
                    </Button>
                    {addMember}
                </div>
            </AddContainerDiv>
        );

        let showPending = pendingMembers.length > 0;
        let newMember = this.props.successMessage;
        return this.props.isLoading.length !== 0 ? (
            <ReduxPageLoader message={'Loading members'} />
        ) : (
            <MembersSectionDiv data-testid='member-list'>
                {addMemberButton}
                <MemberFilter
                    searchTerm={this.props.searchTerm}
                    onSearchChange={this.props.setSearchTerm}
                    itemsPerPage={this.props.itemsPerPage}
                    onItemsPerPageChange={this.props.handleItemsPerPageChange}
                />
                <MemberTable
                    category={this.props.category}
                    domain={domain}
                    collection={collection}
                    members={approvedMembers}
                    totalMembers={this.props.totalItems}
                    hasNoResults={this.props.hasNoResults && !showPending}
                    caption='Approved'
                    timeZone={this.props.timeZone}
                    _csrf={this.props._csrf}
                    onSubmit={this.props.reloadMembers}
                    justificationRequired={justificationReq}
                    newMember={newMember}
                />
                <br />
                {showPending ? (
                    <MemberTable
                        category={this.props.category}
                        domain={domain}
                        collection={collection}
                        members={pendingMembers}
                        totalMembers={this.props.totalItems}
                        hasNoResults={false}
                        pending={true}
                        caption='Pending'
                        timeZone={this.props.timeZone}
                        _csrf={this.props._csrf}
                        onSubmit={this.props.reloadMembers}
                        justificationRequired={justificationReq}
                        newMember={newMember}
                    />
                ) : null}
                <Pagination
                    currentPage={this.props.currentPage}
                    totalPages={this.props.totalPages}
                    totalItems={this.props.totalItems}
                    itemsPerPage={this.props.itemsPerPage}
                    pageNumbers={this.props.pageNumbers}
                    canGoNext={this.props.canGoNext}
                    canGoPrevious={this.props.canGoPrevious}
                    onPageChange={this.props.goToPage}
                    onNext={this.props.goToNextPage}
                    onPrevious={this.props.goToPreviousPage}
                    onFirst={this.props.goToFirstPage}
                    onLast={this.props.goToLastPage}
                />
                {this.props.showSuccess ? (
                    <Alert
                        isOpen={this.props.showSuccess}
                        title={this.props.successMessage}
                        onClose={this.props.closeModal}
                        type='success'
                    />
                ) : null}
            </MembersSectionDiv>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        ...props,
        isLoading: selectIsLoading(state),
        timeZone: selectTimeZone(state),
    };
};

const MemberList = connect(mapStateToProps)(MemberListComponent);

export default MemberList;
