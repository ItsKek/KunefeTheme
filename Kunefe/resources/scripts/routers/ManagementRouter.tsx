import React, { useEffect, useState } from 'react';
import { useRouteMatch, NavLink } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import tw from 'twin.macro';
import styled from 'styled-components/macro';
import Can from '@/components/elements/Can';

const ActiveStuff2 = styled.div`
    & > a, & > .navigation-link {
        &:active, &:hover, &.active {
            ${tw`text-white`}
        }
    }
`;

const ManagementRouter = () => {

  const match = useRouteMatch();

  return (
    <CSSTransition timeout={150} classNames={'fade'} appear in>
      <div css={tw`absolute top-0 w-full`} className="secondaryNav2">
        <div className="height51px container">
          <ul css={tw`flex items-center`}>
            <Can action={'file.*'}>
              <ActiveStuff2>
                <NavLink to={`${match.url}/files`}>
                  <li className="secondaryNavLink">
                    File Management
                 </li>
                </NavLink>
              </ActiveStuff2>
            </Can>
            <Can action={'file.*'}>
              <ActiveStuff2>
                <NavLink to={`${match.url}/backups`}>
                  <li className="secondaryNavLink">
                    Backups
                 </li>
                </NavLink>
              </ActiveStuff2>
            </Can>
            <Can action={'database.*'}>
              <ActiveStuff2>
                <NavLink to={`${match.url}/databases`} exact>
                  <li className="secondaryNavLink">
                    Databases
                 </li>
                </NavLink>
              </ActiveStuff2>
            </Can>
            <Can action={'file.*'}>
              <ActiveStuff2>
                <NavLink to={`${match.url}/users`}>
                  <li className="secondaryNavLink">
                    Subusers
                 </li>
                </NavLink>
              </ActiveStuff2>
            </Can>
          </ul>
        </div>
      </div>
    </CSSTransition>
  );
};

export default ManagementRouter;
