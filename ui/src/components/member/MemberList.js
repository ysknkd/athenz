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
import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import Button from '../denali/Button';
import Alert from '../denali/Alert';
import {
    MODAL_TIME_OUT,
    PAGINATION_DEFAULT_ITEMS_PER_PAGE,
    PAGINATION_ITEMS_PER_PAGE_OPTIONS,
} from '../constants/constants';
import AddMember from './AddMember';
import MemberTable from './MemberTable';
import PageSizeSelector from './PageSizeSelector';
import { selectIsLoading } from '../../redux/selectors/loading';
import { selectTimeZone } from '../../redux/selectors/domains';
import { connect } from 'react-redux';
import { ReduxPageLoader } from '../denali/ReduxPageLoader';
import { arrayEquals } from '../utils/ArrayUtils';
import { usePagination } from '../../hooks/usePagination';
import API from '../../api';

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

const PaginationControlsDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const LeftControlsDiv = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const RightControlsDiv = styled.div`
    display: flex;
    align-items: center;
`;

const MemberList = (props) => {
    const [showAddMember, setShowAddMember] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [paginationEnabled, setPaginationEnabled] = useState(true);

    const api = API();

    const toggleAddMember = () => {
        setShowAddMember(!showAddMember);
    };

    const reloadMembers = (successMessage, showSuccessParam = true) => {
        setShowAddMember(false);
        setShowSuccess(showSuccessParam);
        setSuccessMessage(successMessage);
        setErrorMessage(null);
        setTimeout(() => {
            setShowSuccess(false);
            setSuccessMessage('');
        }, MODAL_TIME_OUT);
    };

    const closeModal = () => {
        setShowSuccess(false);
    };

    // Fetch page feature flag for pagination
    useEffect(() => {
        let isMounted = true;
        
        api.getPageFeatureFlag('memberList')
            .then((data) => {
                if (isMounted && data && typeof data.pagination === 'boolean') {
                    setPaginationEnabled(data.pagination);
                }
            })
            .catch((err) => {
                // On error, default to enabled (fail safe)
                console.warn(
                    'Failed to fetch memberList page feature flag:',
                    err
                );
                if (isMounted) {
                    setPaginationEnabled(true);
                }
            });
            
        return () => {
            isMounted = false;
        };
    }, []);

    // Prepare members data
    const { domain, collection, collectionDetails, members = [] } = props;

    let approvedMembers = [];
    let pendingMembers = [];

    if (collectionDetails.trust) {
        approvedMembers = members;
    } else {
        approvedMembers = members.filter((item) => item.approved);
        pendingMembers = members.filter((item) => !item.approved);
    }

    // Sort members with memoization to prevent unnecessary re-sorts
    const sortedApprovedMembers = useMemo(
        () =>
            [...approvedMembers].sort((a, b) =>
                a.memberName.localeCompare(b.memberName)
            ),
        [approvedMembers]
    );

    const sortedPendingMembers = useMemo(
        () =>
            [...pendingMembers].sort((a, b) =>
                a.memberName.localeCompare(b.memberName)
            ),
        [pendingMembers]
    );

    // Setup pagination for approved and pending members
    const approvedPagination = usePagination(
        sortedApprovedMembers,
        PAGINATION_DEFAULT_ITEMS_PER_PAGE,
        paginationEnabled
    );
    const pendingPagination = usePagination(
        sortedPendingMembers,
        PAGINATION_DEFAULT_ITEMS_PER_PAGE,
        paginationEnabled
    );

    const justificationReq =
        props.isDomainAuditEnabled ||
        collectionDetails.reviewEnabled ||
        collectionDetails.selfServe;

    const addMember = showAddMember ? (
        <AddMember
            category={props.category}
            domainName={props.domain}
            collection={props.collection}
            onSubmit={reloadMembers}
            onCancel={toggleAddMember}
            _csrf={props._csrf}
            showAddMember={showAddMember}
            justificationRequired={justificationReq}
        />
    ) : null;

    const addMemberButton = (
        <AddContainerDiv>
            <div>
                <Button secondary onClick={toggleAddMember}>
                    Add Member
                </Button>
                {addMember}
            </div>
        </AddContainerDiv>
    );

    const showApprovedPagination =
        paginationEnabled && approvedMembers.length > 0;
    const showPendingPagination =
        paginationEnabled && pendingMembers.length > 0;

    if (props.isLoading.length !== 0) {
        return <ReduxPageLoader message={'Loading members'} />;
    }

    return (
        <MembersSectionDiv data-testid='member-list'>
            {addMemberButton}

            <MemberTable
                category={props.category}
                domain={domain}
                collection={collection}
                members={approvedPagination.paginatedData}
                totalMembers={approvedPagination.totalItems}
                caption='Approved'
                timeZone={props.timeZone}
                _csrf={props._csrf}
                onSubmit={reloadMembers}
                justificationRequired={justificationReq}
                newMember={successMessage}
                showPagination={showApprovedPagination}
                currentPage={approvedPagination.currentPage}
                totalPages={approvedPagination.totalPages}
                onPageChange={approvedPagination.goToPage}
                onNextPage={approvedPagination.goToNextPage}
                onPreviousPage={approvedPagination.goToPreviousPage}
                itemsPerPage={approvedPagination.itemsPerPage}
                showPageSizeSelector={showApprovedPagination}
                pageSizeValue={approvedPagination.itemsPerPage}
                pageSizeOptions={PAGINATION_ITEMS_PER_PAGE_OPTIONS}
                onPageSizeChange={(newSize) => {
                    approvedPagination.setItemsPerPage(newSize);
                }}
                pageSizeSelectorTestId={
                    process.env.NODE_ENV === 'test'
                        ? 'approved-page-size-selector-test'
                        : undefined
                }
            />

            <br />

            {showPendingPagination && (
                <MemberTable
                    category={props.category}
                    domain={domain}
                    collection={collection}
                    members={pendingPagination.paginatedData}
                    totalMembers={pendingPagination.totalItems}
                    pending={true}
                    caption='Pending'
                    timeZone={props.timeZone}
                    _csrf={props._csrf}
                    onSubmit={reloadMembers}
                    justificationRequired={justificationReq}
                    newMember={successMessage}
                    showPagination={showPendingPagination}
                    currentPage={pendingPagination.currentPage}
                    totalPages={pendingPagination.totalPages}
                    onPageChange={pendingPagination.goToPage}
                    onNextPage={pendingPagination.goToNextPage}
                    onPreviousPage={pendingPagination.goToPreviousPage}
                    itemsPerPage={pendingPagination.itemsPerPage}
                    showPageSizeSelector={showPendingPagination}
                    pageSizeValue={pendingPagination.itemsPerPage}
                    pageSizeOptions={PAGINATION_ITEMS_PER_PAGE_OPTIONS}
                    onPageSizeChange={(newSize) => {
                        pendingPagination.setItemsPerPage(newSize);
                    }}
                    pageSizeSelectorTestId={
                        process.env.NODE_ENV === 'test'
                            ? 'pending-page-size-selector-test'
                            : undefined
                    }
                />
            )}

            {showSuccess && (
                <Alert
                    isOpen={showSuccess}
                    title={successMessage}
                    onClose={closeModal}
                    type='success'
                />
            )}
        </MembersSectionDiv>
    );
};

const mapStateToProps = (state, props) => {
    return {
        ...props,
        isLoading: selectIsLoading(state),
        timeZone: selectTimeZone(state),
    };
};

export default connect(mapStateToProps)(MemberList);
