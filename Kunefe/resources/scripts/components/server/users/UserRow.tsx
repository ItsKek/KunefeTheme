import React, { useState } from 'react';
import { Subuser } from '@/state/server/subusers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faUnlockAlt, faUserLock } from '@fortawesome/free-solid-svg-icons';
import RemoveSubuserButton from '@/components/server/users/RemoveSubuserButton';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';
import Can from '@/components/elements/Can';
import { useStoreState } from 'easy-peasy';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';

interface Props {
  subuser: Subuser;
}

export default ({ subuser }: Props) => {
  const uuid = useStoreState(state => state.user!.data!.uuid);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <EditSubuserModal
        subuser={subuser}
        visible={visible}
        onModalDismissed={() => setVisible(false)}
      />
      <tr>
        <th css="font-weight: 400;">{subuser.username}</th>
        <th css="font-weight: 400;">{subuser.email}</th>
        <th css="font-weight: 400;">{subuser.twoFactorEnabled ? 'Enabled' : 'Disabled'}</th>
        {subuser.uuid !== uuid &&
          <>
            <Can action={'user.update'}>
              <th
                onClick={() => setVisible(true)}
                css={tw`cursor-pointer text-center`}
              >
                <FontAwesomeIcon icon={faPencilAlt} />
              </th>
            </Can>
            {
              <Can action={'user.delete'}>
                <th css={tw`cursor-pointer text-center`}>
                  <RemoveSubuserButton subuser={subuser} />
                </th>
              </Can>
            }
          </>
        }
      </tr>
    </>
  );
};
