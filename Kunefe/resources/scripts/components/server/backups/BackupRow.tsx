import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive, faEllipsisH, faLock } from '@fortawesome/free-solid-svg-icons';
import { format, formatDistanceToNow } from 'date-fns';
import Spinner from '@/components/elements/Spinner';
import { bytesToHuman } from '@/helpers';
import Can from '@/components/elements/Can';
import useWebsocketEvent from '@/plugins/useWebsocketEvent';
import BackupContextMenu from '@/components/server/backups/BackupContextMenu';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import getServerBackups from '@/api/swr/getServerBackups';
import { ServerBackup } from '@/api/server/types';
import { SocketEvent } from '@/components/server/events';

interface Props {
  backup: ServerBackup;
  className?: string;
}

export default ({ backup, className }: Props) => {
  const { mutate } = getServerBackups();

  useWebsocketEvent(`${SocketEvent.BACKUP_COMPLETED}:${backup.uuid}` as SocketEvent, data => {
    try {
      const parsed = JSON.parse(data);

      mutate(data => ({
        ...data,
        items: data.items.map(b => b.uuid !== backup.uuid ? b : ({
          ...b,
          isSuccessful: parsed.is_successful || true,
          checksum: (parsed.checksum_type || '') + ':' + (parsed.checksum || ''),
          bytes: parsed.file_size || 0,
          completedAt: new Date(),
        })),
      }), false);
    } catch (e) {
      console.warn(e);
    }
  });

  return (
    <tr className={className}>
      <th css="font-weight: 400;">{backup.name}</th>
      <th css="font-weight: 400;">{bytesToHuman(backup.bytes)}</th>
      {backup.isLocked ?
        <th css="font-weight: 400;">Locked</th>
        :
        <th css="font-weight: 400;">Unlocked</th>
      }
      <th css="font-weight: 400;">{backup.completedAt ? format(backup.completedAt, 'MMM do, yyyy HH:mm') : 'UnFinished'}</th>
      {!backup.completedAt ?
        <td css={tw`invisible`}>
          <FontAwesomeIcon icon={faEllipsisH} />
        </td>
        :
        <td>
          <BackupContextMenu backup={backup} />
        </td>
      }
    </tr>
  );
};
