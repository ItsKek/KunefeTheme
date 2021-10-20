import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/elements/Button';
import tw from 'twin.macro';
import { useRouteMatch, Link } from 'react-router-dom';
import { ServerContext } from '@/state/server';
import { useStoreState } from 'easy-peasy';
import EditSubuserModal from '@/components/server/users/EditSubuserModal';

export default () => {
  const [visible, setVisible] = useState(false);
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const match = useRouteMatch();

  return (
    <>
        <EditSubuserModal visible={visible} onModalDismissed={() => setVisible(false)}/>
        <Button onClick={() => setVisible(true)} css="height: 28px;" size={'xsmall'} color={'purple'}>
          Add New Subuser
        </Button>
    </>
  );
};
