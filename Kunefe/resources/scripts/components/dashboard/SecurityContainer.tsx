import React, { useState } from 'react';
import ContentBox from '@/components/elements/ContentBox';
import ConfigureTwoFactorForm from '@/components/dashboard/forms/ConfigureTwoFactorForm';
import DisableTwoFactorForm from '@/components/dashboard/forms/DisableTwoFactorForm';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { useLocation, Link, NavLink } from 'react-router-dom';
import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';
import MessageBox from '@/components/MessageBox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';

export default () => {
  const { state } = useLocation<undefined | { twoFactorRedirect?: boolean }>();
  const [visible, setVisible] = useState(false);
  const isEnabled = useStoreState((state: ApplicationStore) => state.user.data!.useTotp);

  return (
    <PageContentBlock title={'Account Security'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faShieldAlt} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Account Security</h1></li>
                    <li className="spacingfix1"><small>Control active sessions and 2-Factor Authentication.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={'/'}>
                      <li className="breadcrumb-item">Home</li>
                    </Link>
                    <li className="breadcrumb-item active">Account Security</li>
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
          {isEnabled ?
            <DisableTwoFactorForm />
            :
            <ConfigureTwoFactorForm />
          }
        </div>
      </div>
    </PageContentBlock>
  );
};
