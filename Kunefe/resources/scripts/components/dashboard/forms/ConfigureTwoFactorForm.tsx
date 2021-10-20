import React, { useState } from 'react';
import { useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import SetupTwoFactorModal from '@/components/dashboard/forms/SetupTwoFactorModal';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export default () => {
  const [visible, setVisible] = useState(false);
  const isEnabled = useStoreState((state: ApplicationStore) => state.user.data!.useTotp);

  return (
    <div className="setup2fa">
      <div className="row">
        <div className="updatePasswordCol">
          <div className="card">
            <div className="card-header">
              {isEnabled ?
                <h3 css={tw`mb-0`}><FontAwesomeIcon css="margin-right: .4rem; color: #2dce89;" icon={faCircle} fixedWidth />2-Factor Authentication</h3>
                :
                <h3 css={tw`mb-0`}><FontAwesomeIcon css="margin-right: .4rem; color: #f5365c;" icon={faCircle} fixedWidth />2-Factor Authentication</h3>
              }
            </div>
            {visible && (
              isEnabled ?
                null
                :
                <SetupTwoFactorModal visible={visible} onModalDismissed={() => setVisible(false)} />
            )}
            <div className="card-body">
              {isEnabled ?
                '2-Factor Authentication is enabled on this account and will be required in order to login to the panel. If you would like to disable 2FA, simply enter a valid token below and submit the form.'
                :
                '2-Factor Authentication is disabled on your account! You should enable 2FA in order to add an extra level of protection on your account.'
              }
            </div>
            <div className="card-footer">
              <Button color={'start'} size={'xsmall'} css="height: 28px;" onClick={() => setVisible(true)}>
                Enable 2-Factor Authentication
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
