import React, { memo, useCallback, useState } from 'react';
import isEqual from 'react-fast-compare';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import InputSpinner from '@/components/elements/InputSpinner';
import { Textarea } from '@/components/elements/Input';
import Can from '@/components/elements/Can';
import Button from '@/components/elements/Button';
import GreyRowBox from '@/components/elements/GreyRowBox';
import { Allocation } from '@/api/server/getServer';
import styled from 'styled-components/macro';
import { debounce } from 'debounce';
import setServerAllocationNotes from '@/api/server/network/setServerAllocationNotes';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import CopyOnClick from '@/components/elements/CopyOnClick';
import DeleteAllocationButton from '@/components/server/network/DeleteAllocationButton';
import setPrimaryServerAllocation from '@/api/server/network/setPrimaryServerAllocation';
import getServerAllocations from '@/api/swr/getServerAllocations';

interface Props {
  allocation: Allocation;
}

const AllocationRow = ({ allocation }: Props) => {
  const [loading, setLoading] = useState(false);
  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const { mutate } = getServerAllocations();

  const onNotesChanged = useCallback((id: number, notes: string) => {
    mutate(data => data ?.map(a => a.id === id ? { ...a, notes } : a), false);
  }, []);

  const setAllocationNotes = debounce((notes: string) => {
    setLoading(true);
    clearFlashes('server:network');

    setServerAllocationNotes(uuid, allocation.id, notes)
      .then(() => onNotesChanged(allocation.id, notes))
      .catch(error => clearAndAddHttpError({ key: 'server:network', error }))
      .then(() => setLoading(false));
  }, 750);

  const setPrimaryAllocation = () => {
    clearFlashes('server:network');
    mutate(data => data ?.map(a => ({ ...a, isDefault: a.id === allocation.id })), false);

    setPrimaryServerAllocation(uuid, allocation.id)
      .catch(error => {
        clearAndAddHttpError({ key: 'server:network', error });
        mutate();
      });
  };

  return (
    <tr>
      <td>
        {allocation.alias ?
          <CopyOnClick text={allocation.alias}><code>{allocation.alias}</code></CopyOnClick> :
          <CopyOnClick text={allocation.ip}><code>{allocation.ip}</code></CopyOnClick>
        }
      </td>
      <td>
        {allocation.notes}
      </td>
      <td>
        {allocation.port}
      </td>
      <th css={tw`text-right`}>
        {allocation.isDefault ?
          <Button size={'xsmall'} color={'start'} disabled>Primary</Button>
          :
          <>
            <Can action={'allocation.delete'}>
              <DeleteAllocationButton allocation={allocation.id} />
            </Can>
            <Can action={'allocation.update'}>
              <Button
                size={'xsmall'}
                color={'purple'}
                onClick={setPrimaryAllocation}
              >
                Make Primary
              </Button>
            </Can>
          </>
        }
      </th>
    </tr>
  );
};

export default memo(AllocationRow, isEqual);
