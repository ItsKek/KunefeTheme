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

const ConfigurationRouter = () => {

  const match = useRouteMatch();

  return (
    <CSSTransition timeout={150} classNames={'fade'} appear in>
      <div css={tw`absolute top-0 w-full`} className="secondaryNav2">
        <div className="height51px container">
          <ul css={tw`flex items-center`}>
            <ActiveStuff2>
              <NavLink to={`${match.url}/startup`}>
                <li className="secondaryNavLink">
                  Startup
               </li>
              </NavLink>
            </ActiveStuff2>
            <ActiveStuff2>
              <NavLink to={`${match.url}/allocations`} exact>
                <li className="secondaryNavLink">
                  Allocations
               </li>
              </NavLink>
            </ActiveStuff2>
            <Can action={'file.*'}>
              <ActiveStuff2>
                <NavLink to={`${match.url}/schedules`}>
                  <li className="secondaryNavLink">
                    Schedules
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

export default ConfigurationRouter;
