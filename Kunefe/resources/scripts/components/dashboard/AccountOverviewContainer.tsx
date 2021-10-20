import * as React from 'react';
import ContentBox from '@/components/elements/ContentBox';
import UpdatePasswordForm from '@/components/dashboard/forms/UpdatePasswordForm';
import UpdateEmailAddressForm from '@/components/dashboard/forms/UpdateEmailAddressForm';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { useLocation, Link, NavLink } from 'react-router-dom';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
    ${tw`flex flex-wrap`};

    & > div {
        ${tw`w-full`};

        ${breakpoint('md')`
            width: calc(50% - 1rem);
        `}

        ${breakpoint('xl')`
            ${tw`w-auto flex-1`};
        `}
    }
`;

export default () => {
  const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();

  return (
    <PageContentBlock title={'Account Overview'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Your Account</h1></li>
                    <li className="spacingfix1"><small>Manage your account details.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={'/'}>
                      <li className="breadcrumb-item">Home</li>
                    </Link>
                    <li className="breadcrumb-item active">Account</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        {state ?.twoFactorRedirect &&
          <MessageBox title={'2-Factor Required'} type={'error'}>
            Your account must have two-factor authentication enabled in order to continue.
            </MessageBox>
            }
        <div className="row">
          <UpdatePasswordForm />
          <UpdateEmailAddressForm />
        </div>
      </div>
    </PageContentBlock>
  );
};
