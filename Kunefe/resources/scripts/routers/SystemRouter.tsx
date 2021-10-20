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

const SystemRouter = () => {

  const match = useRouteMatch();

  return (
    <CSSTransition timeout={150} classNames={'fade'} appear in>
      <div css={tw`absolute top-0 w-full`} className="secondaryNav2">
        <div className="height51px container">
          <ul css={tw`flex items-center`}>
            <ActiveStuff2>
              <NavLink to={`${match.url}`} exact>
                <li className="secondaryNavLink">
                  Console
               </li>
              </NavLink>
            </ActiveStuff2>
            <ActiveStuff2>
              <NavLink to={`${match.url}/information`} exact>
                <li className="secondaryNavLink">
                  Server Info
               </li>
              </NavLink>
            </ActiveStuff2>
            <Can action={[ 'settings.*', 'file.sftp' ]} matchAny>
              <ActiveStuff2>
                <NavLink to={`${match.url}/sftp`} exact>
                  <li className="secondaryNavLink">
                    SFTP Settings
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

export default SystemRouter;
