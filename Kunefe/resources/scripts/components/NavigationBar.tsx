import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faLayerGroup, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SearchContainer from '@/components/dashboard/search/SearchContainer';
import tw, { theme } from 'twin.macro';
import styled from 'styled-components/macro';
import Gravatar from 'react-gravatar';
import SubNavigation from '@/components/elements/SubNavigation';

const Navigation = styled.div`
    ${tw`py-4 w-full bg-neutral-910 overflow-x-auto`};
    z-index: 20;

    & > div {
        ${tw`mx-auto w-full flex items-center`};
    }

    & #logo {
        ${tw`flex-1`};
    }
`;

const RightNavigation = styled.div`
    ${tw`flex h-full items-center justify-center`};

    & > a, & > .navigation-link {
        ${tw`flex items-center h-full no-underline text-white px-4 cursor-pointer transition-all duration-150`};
    }
`;

export default () => {
  const name = useStoreState((state: ApplicationStore) => state.settings.data!.name);
  const rootAdmin = useStoreState((state: ApplicationStore) => state.user.data!.rootAdmin);
  const email = useStoreState((state: ApplicationStore) => state.user.data!.email);

  return (
    <Navigation>
      <div css={tw`h-11 px-4 mx-auto w-full flex items-center`} className="container">
        <div id={'logo'}>
          <Link to={'/'}>
            <span css={tw`text-white uppercase font-semibold`}>{name}</span>
          </Link>
        </div>
        <RightNavigation>
          {rootAdmin &&
            <a href={'/admin'} rel={'noreferrer'}>
              <FontAwesomeIcon icon={faCogs} />
            </a>
          }
          <a href={'/auth/logout'}>
            <FontAwesomeIcon icon={faSignOutAlt} />
          </a>
            <div css={tw`pl-4`}>
              <Gravatar
                email={email}
                size={36}
                style={{ borderRadius: '9999px' }}
              />
            </div>
        </RightNavigation>
      </div>
    </Navigation>
  );
};
