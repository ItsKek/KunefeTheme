import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import Spinner from '@/components/elements/Spinner';
import AddSubuserButton from '@/components/server/users/AddSubuserButton';
import UserRow from '@/components/server/users/UserRow';
import FlashMessageRender from '@/components/FlashMessageRender';
import getServerSubusers from '@/api/server/users/getServerSubusers';
import { httpErrorToHuman } from '@/api/http';
import Can from '@/components/elements/Can';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import createOrUpdateSubuser from '@/api/server/users/createOrUpdateSubuser';

export default () => {
  const [loading, setLoading] = useState(true);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const id = ServerContext.useStoreState(state => state.server.data!.id);

  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const subusers = ServerContext.useStoreState(state => state.subusers.data);
  const setSubusers = ServerContext.useStoreActions(actions => actions.subusers.setSubusers);

  const permissions = useStoreState((state: ApplicationStore) => state.permissions.data);
  const getPermissions = useStoreActions((actions: Actions<ApplicationStore>) => actions.permissions.getPermissions);
  const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

  useEffect(() => {
    clearFlashes('users');
    getServerSubusers(uuid)
      .then(subusers => {
        setSubusers(subusers);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        addError({ key: 'users', message: httpErrorToHuman(error) });
      });
  }, []);

  useEffect(() => {
    getPermissions().catch(error => {
      addError({ key: 'users', message: httpErrorToHuman(error) });
      console.error(error);
    });
  }, []);

  if (!subusers.length && (loading || !Object.keys(permissions).length)) {
    return <Spinner size={'large'} centered />;
  }

  return (
    <ServerContentBlock title={'Users'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Manage Users</h1></li>
                    <li className="spacingfix1"><small>Control who can access your server.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Subusers</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <FlashMessageRender byKey={'users'} css={tw`mb-4`} />
        <div className="row">
          <div className="flexGrow" />
        </div>
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">
                <div className="row">
                  <div className="userHeader">
                    <h3>Accounts with Access</h3>
                  </div>
                  <div css={tw`text-right float-right`} className="userHeader">
                    <Can action={'user.create'}>
                      <AddSubuserButton />
                    </Can>
                  </div>
                </div>
              </div>
              <div css="padding: 0 !important;" className="card-body table-responsive">
                <table className="table table-hover">
                  <tbody css={tw`w-full`}>
                    <tr css={tw`w-full`}>
                      <th css="font-weight: 600;">Name</th>
                      <th css="font-weight: 600;">Email</th>
                      <th css="font-weight: 600;">2FA</th>
                      <th css="font-weight: 600;"></th>
                      <th css="font-weight: 600;"></th>
                    </tr>
                    {!subusers.length ?
                      null
                      :
                      subusers.map(subuser => (
                        <UserRow key={subuser.uuid} subuser={subuser} />
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServerContentBlock>
  );
};
