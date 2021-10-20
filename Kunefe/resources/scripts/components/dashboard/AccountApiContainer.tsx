import React, { useEffect, useState } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import CreateApiKeyForm from '@/components/dashboard/forms/CreateApiKeyForm';
import getApiKeys, { ApiKey } from '@/api/account/getApiKeys';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import deleteApiKey from '@/api/account/deleteApiKey';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import FlashMessageRender from '@/components/FlashMessageRender';
import { httpErrorToHuman } from '@/api/http';
import { format } from 'date-fns';
import PageContentBlock from '@/components/elements/PageContentBlock';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { useLocation, Link, NavLink } from 'react-router-dom';
import Button from '@/components/elements/Button';
import CopyOnClick from '@/components/elements/CopyOnClick';

export default () => {
  const [deleteIdentifier, setDeleteIdentifier] = useState('');
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

  useEffect(() => {
    clearFlashes('account');
    getApiKeys()
      .then(keys => setKeys(keys))
      .then(() => setLoading(false))
      .catch(error => {
        console.error(error);
        addError({ key: 'account', message: httpErrorToHuman(error) });
      });
  }, []);

  const doDeletion = (identifier: string) => {
    setLoading(true);
    clearFlashes('account');
    deleteApiKey(identifier)
      .then(() => setKeys(s => ([
        ...(s || []).filter(key => key.identifier !== identifier),
      ])))
      .catch(error => {
        console.error(error);
        addError({ key: 'account', message: httpErrorToHuman(error) });
      })
      .then(() => setLoading(false));
  };

  return (
    <PageContentBlock title={'Account API'}>
      <ConfirmationModal
        visible={!!deleteIdentifier}
        title={'Confirm key deletion'}
        buttonText={'Yes, delete key'}
        onConfirmed={() => {
          doDeletion(deleteIdentifier);
          setDeleteIdentifier('');
        }}
        onModalDismissed={() => setDeleteIdentifier('')}
      >
        Are you sure you wish to delete this API key? All requests using it will immediately be
        invalidated and will fail.
    </ConfirmationModal>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faKey} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Account API</h1></li>
                    <li className="spacingfix1"><small>Manage access keys that allow you to perform actions against the panel.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={'/'}>
                      <li className="breadcrumb-item">Home</li>
                    </Link>
                    <li className="breadcrumb-item active">Account API</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <FlashMessageRender byKey={'account'} />
        <div className="row">
          <div className="flexgrow" />
        </div>
        <div className="row">
          <div className="apiKeyRow">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  Credentials List
                  <Link to={'/account/api/new'}>
                    <Button css="height: 28px;" size={'xsmall'} color={'purple'}>Create New</Button>
                  </Link>
                </h3>
              </div>
              <div css="padding: 0 !important;" className="card-body table-responsive">
                <table className="table table-hover">
                  <tbody css={tw`w-full`}>
                    <tr css={tw`w-full`}>
                      <th css="font-weight: 600;">Short Key</th>
                      <th css="font-weight: 600;">Memo</th>
                      <th css="font-weight: 600;">Last Used</th>
                      <th css="font-weight: 600;">Created</th>
                      <th css="font-weight: 600;"></th>
                    </tr>
                    {
                      keys.length === 0 ?
                        null
                        :
                        keys.map((key, index) => (
                          <tr key={key.identifier}>
                            <th css="font-weight: 400; letter-spacing: 1.5; color: #f3a4b5; font-size: 87.5%; word-break: break-word;">{key.identifier}</th>
                            <th css="font-weight: 400;">{key.description}</th>
                            <th css="font-weight: 400;">{key.lastUsedAt ? format(key.lastUsedAt, 'MMM do, yyyy HH:mm') : 'Never'}</th>
                            <th css="font-weight: 400;">{key.createdAt ? format(key.createdAt, 'MMM do, yyyy HH:mm') : 'Never'}</th>
                            <th onClick={() => setDeleteIdentifier(key.identifier)} css="cursor: pointer; font-weight: 400;"><FontAwesomeIcon css="font-weight: 900; color: #f5365c;" icon={faTrashAlt} /></th>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContentBlock>
  );
};
