import TransferListener from '@/components/server/TransferListener';
import React, { useEffect, useState } from 'react';
import { NavLink, Route, RouteComponentProps, Switch } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';
import ServerConsole from '@/components/server/ServerConsole';
import TransitionRouter from '@/TransitionRouter';
import WebsocketHandler from '@/components/server/WebsocketHandler';
import { ServerContext } from '@/state/server';
import DatabasesContainer from '@/components/server/databases/DatabasesContainer';
import FileManagerContainer from '@/components/server/files/FileManagerContainer';
import { CSSTransition } from 'react-transition-group';
import FileEditContainer from '@/components/server/files/FileEditContainer';
import SettingsContainer from '@/components/server/settings/SettingsContainer';
import ScheduleContainer from '@/components/server/schedules/ScheduleContainer';
import ScheduleEditContainer from '@/components/server/schedules/ScheduleEditContainer';
import UsersContainer from '@/components/server/users/UsersContainer';
import ConfigurePermissionsContainer from '@/components/server/users/ConfigurePermissionsContainer';
import Can from '@/components/elements/Can';
import BackupContainer from '@/components/server/backups/BackupContainer';
import Spinner from '@/components/elements/Spinner';
import ScreenBlock, { NotFound, ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { useStoreState } from 'easy-peasy';
import SubNavigation from '@/components/elements/SubNavigation';
import NetworkContainer from '@/components/server/network/NetworkContainer';
import InstallListener from '@/components/server/InstallListener';
import StartupContainer from '@/components/server/startup/StartupContainer';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import RequireServerPermission from '@/hoc/RequireServerPermission';
import ServerInstallSvg from '@/assets/images/server_installing.svg';
import ServerRestoreSvg from '@/assets/images/server_restore.svg';
import ServerErrorSvg from '@/assets/images/server_error.svg';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import GeneralInfoContainer from '@/components/server/Information/GeneralInfoContainer';
import SftpInformationContainer from '@/components/server/Information/SftpInformationContainer';
import SystemRouter from '@/routers/SystemRouter';
import ManagementRouter from '@/routers/ManagementRouter';
import ConfigurationRouter from '@/routers/ConfigurationRouter';

const ActiveStuff = styled.div`
    & > a, & > .navigation-link {
       &:hover {
         ${tw`text-white`}
        }
    }
`;

const ActiveStuff2 = styled.div`
    & > a, & > .navigation-link {
        &:active, &:hover, &.active {
            ${tw`text-white`}
        }
    }
`;

const ConflictStateRenderer = () => {
  const status = ServerContext.useStoreState(state => state.server.data ?.status || null);
  const isTransferring = ServerContext.useStoreState(state => state.server.data ?.isTransferring || false);

  return (
    status === 'installing' || status === 'install_failed' ?
      <ScreenBlock
        title={'Running Installer'}
        image={ServerInstallSvg}
        message={'Your server should be ready soon, please try again in a few minutes.'}
      />
      :
      status === 'suspended' ?
        <ScreenBlock
          title={'Server Suspended'}
          image={ServerErrorSvg}
          message={'This server is suspended and cannot be accessed.'}
        />
        :
        <ScreenBlock
          title={isTransferring ? 'Transferring' : 'Restoring from Backup'}
          image={ServerRestoreSvg}
          message={isTransferring ? 'Your server is being transfered to a new node, please check back later.' : 'Your server is currently being restored from a backup, please check back in a few minutes.'}
        />
  );
};

const ServerRouter = ({ match, location }: RouteComponentProps<{ id: string }>) => {
  const rootAdmin = useStoreState(state => state.user.data!.rootAdmin);
  const [error, setError] = useState('');

  const id = ServerContext.useStoreState(state => state.server.data ?.id);
  const uuid = ServerContext.useStoreState(state => state.server.data ?.uuid);
  const inConflictState = ServerContext.useStoreState(state => state.server.inConflictState);
  const serverId = ServerContext.useStoreState(state => state.server.data ?.internalId);
  const getServer = ServerContext.useStoreActions(actions => actions.server.getServer);
  const clearServerState = ServerContext.useStoreActions(actions => actions.clearServerState);

  useEffect(() => () => {
    clearServerState();
  }, []);

  useEffect(() => {
    setError('');

    getServer(match.params.id)
      .catch(error => {
        console.error(error);
        setError(httpErrorToHuman(error));
      });

    return () => {
      clearServerState();
    };
  }, [match.params.id]);

  return (
    <React.Fragment key={'server-router'}>
      <NavigationBar />
      {(!uuid || !id) ?
        error ?
          <ServerError message={error} />
          :
          <Spinner size={'large'} centered />
        :
        <>
          <CSSTransition timeout={150} classNames={'fade'} appear in>
            <div css={tw`absolute top-0 w-full`} className="secondaryNav">
              <div className="height51px container">
                <ul css={tw`flex items-center`}>
                  <ActiveStuff>
                    <NavLink to={'/'} exact>
                      <li className="secondaryNavLink">
                        Home
                     </li>
                    </NavLink>
                  </ActiveStuff>
                  <ActiveStuff>
                    <NavLink to={`${match.url}`} exact>
                      <li className="secondaryNavLink">
                        System
                      </li>
                    </NavLink>
                  </ActiveStuff>
                  <Can action={'file.*'}>
                    <ActiveStuff>
                      <NavLink to={`${match.url}/files`}>
                        <li className="secondaryNavLink">
                          Management
                       </li>
                      </NavLink>
                    </ActiveStuff>
                  </Can>
                  <Can action={'startup.*'}>
                    <ActiveStuff>
                      <NavLink to={`${match.url}/startup`} exact>
                        <li className="secondaryNavLink">
                          Configuration
                        </li>
                      </NavLink>
                    </ActiveStuff>
                  </Can>
                </ul>
              </div>
            </div>
          </CSSTransition>
          {location.pathname.endsWith(`${id}`) &&
            <SystemRouter />
          }
          {location.pathname.endsWith(`/information`) &&
            <SystemRouter />
          }
          {location.pathname.endsWith(`/sftp`) &&
            <SystemRouter />
          }
          {location.pathname.startsWith(`/server/${id}/files`) &&
            <ManagementRouter />
          }
          {location.pathname.endsWith(`/databases`) &&
            <ManagementRouter />
          }
          {location.pathname.startsWith(`/server/${id}/users`) &&
            <ManagementRouter />
          }
          {location.pathname.startsWith(`/server/${id}/backups`) &&
            <ManagementRouter />
          }
          {location.pathname.startsWith(`/server/${id}/startup`) &&
            <ConfigurationRouter />
          }
          {location.pathname.startsWith(`/server/${id}/allocations`) &&
            <ConfigurationRouter />
          }
          {location.pathname.startsWith(`/server/${id}/schedules`) &&
            <ConfigurationRouter />
          }
          <InstallListener />
          <TransferListener />
          <WebsocketHandler />
          {(inConflictState && (!rootAdmin || (rootAdmin && !location.pathname.endsWith(`/server/${id}`)))) ?
            <ConflictStateRenderer />
            :
            <ErrorBoundary>
              <TransitionRouter>
                <Switch location={location}>
                  <Route path={`${match.path}`} component={ServerConsole} exact />
                  <Route path={`${match.path}/files`} exact>
                    <RequireServerPermission permissions={'file.*'}>
                      <FileManagerContainer />
                    </RequireServerPermission>
                  </Route>
                  <Route path={`${match.path}/files/:action(edit|new)`} exact>
                    <Spinner.Suspense>
                      <FileEditContainer />
                    </Spinner.Suspense>
                  </Route>
                  <Route path={`${match.path}/databases`} exact>
                    <RequireServerPermission permissions={'database.*'}>
                      <DatabasesContainer />
                    </RequireServerPermission>
                  </Route>
                  <Route path={`${match.path}/schedules`} exact>
                    <RequireServerPermission permissions={'schedule.*'}>
                      <ScheduleContainer />
                    </RequireServerPermission>
                  </Route>
                  <Route path={`${match.path}/schedules/:id`} exact>
                    <ScheduleEditContainer />
                  </Route>
                  <Route path={`${match.path}/users`} exact>
                    <RequireServerPermission permissions={'user.*'}>
                      <UsersContainer />
                    </RequireServerPermission>
                  </Route>
                  <Route path={`${match.path}/backups`} exact>
                    <RequireServerPermission permissions={'backup.*'}>
                      <BackupContainer />
                    </RequireServerPermission>
                  </Route>
                  <Route path={`${match.path}/allocations`} exact>
                    <RequireServerPermission permissions={'allocation.*'}>
                      <NetworkContainer />
                    </RequireServerPermission>
                  </Route>
                  <Route path={`${match.path}/startup`} component={StartupContainer} exact />
                  <Route path={`${match.path}/information`} component={GeneralInfoContainer} exact />
                  <Route path={`${match.path}/sftp`} component={SftpInformationContainer} exact />
                  <Route path={'*'} component={NotFound} />
                </Switch>
              </TransitionRouter>
            </ErrorBoundary>
          }
        </>
      }
    </React.Fragment>
  );
};

export default (props: RouteComponentProps<any>) => (
  <ServerContext.Provider>
    <ServerRouter {...props} />
  </ServerContext.Provider>
);