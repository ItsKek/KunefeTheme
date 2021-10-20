import React, { useEffect, useState } from 'react';
import { NavLink, Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import AccountOverviewContainer from '@/components/dashboard/AccountOverviewContainer';
import CreateApiKeyForm from '@/components/dashboard/forms/CreateApiKeyForm';
import NavigationBar from '@/components/NavigationBar';
import DashboardContainer from '@/components/dashboard/DashboardContainer';
import SecurityContainer from '@/components/dashboard/SecurityContainer';
import AccountApiContainer from '@/components/dashboard/AccountApiContainer';
import { NotFound } from '@/components/elements/ScreenBlock';
import TransitionRouter from '@/TransitionRouter';
import SubNavigation from '@/components/elements/SubNavigation';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import getApiKeys, { ApiKey } from '@/api/account/getApiKeys';
import { httpErrorToHuman } from '@/api/http';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';

const ActiveStuff = styled.div`
    & > a, & > .navigation-link {
        &:active, &:hover, &.active {
            ${tw`text-white`}
        }
    }
`;

export default ({ location }: RouteComponentProps) => {

  const [ keys, setKeys ] = useState<ApiKey[]>([]);
  const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
  const [ loading, setLoading ] = useState(true);

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

  return (
    <>
      <NavigationBar />
      {location.pathname.startsWith('/') &&
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
                <NavLink to={'/account'} exact>
                  <li className="secondaryNavLink">
                    My Account
                </li>
                </NavLink>
              </ActiveStuff>
              <ActiveStuff>
                <NavLink to={'/account/security'} exact>
                  <li className="secondaryNavLink">
                    Security Controls
                </li>
                </NavLink>
              </ActiveStuff>
              <ActiveStuff>
                <NavLink to={'/account/api'} exact>
                  <li className="secondaryNavLink">
                    Account API
                </li>
                </NavLink>
              </ActiveStuff>
            </ul>
          </div>
        </div>
      }
      <TransitionRouter>
        <Switch location={location}>
          <Route path={'/'} exact>
            <DashboardContainer />
          </Route>
          <Route path={'/account'} exact>
            <AccountOverviewContainer />
          </Route>
          <Route path={'/account/security'} exact>
            <SecurityContainer />
          </Route>
          <Route path={'/account/api'} exact>
            <AccountApiContainer />
          </Route>
          <Route path={'/account/api/new'} exact>
            <CreateApiKeyForm onKeyCreated={key => setKeys(s => ([...s!, key]))} />
          </Route>
          <Route path={'*'}>
            <NotFound />
          </Route>
        </Switch>
      </TransitionRouter>
    </>
  )
};
