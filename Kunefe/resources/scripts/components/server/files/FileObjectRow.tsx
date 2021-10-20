import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileArchive, faFileImport, faFolder } from '@fortawesome/free-solid-svg-icons';
import { bytesToHuman, encodePathSegments } from '@/helpers';
import { differenceInHours, format, formatDistanceToNow } from 'date-fns';
import React, { memo } from 'react';
import { FileObject } from '@/api/server/files/loadDirectory';
import FileDropdownMenu from '@/components/server/files/FileDropdownMenu';
import { ServerContext } from '@/state/server';
import { NavLink, useRouteMatch } from 'react-router-dom';
import tw from 'twin.macro';
import isEqual from 'react-fast-compare';
import styled from 'styled-components/macro';
import SelectFileCheckbox from '@/components/server/files/SelectFileCheckbox';
import { usePermissions } from '@/plugins/usePermissions';
import { join } from 'path';

const FileObjectRow = ({ file }: { file: FileObject }) => {

  const match = useRouteMatch();
  const directory = ServerContext.useStoreState(state => state.files.directory);
  const [canReadContents] = usePermissions(['file.read-content']);

  return (
    <tr
      key={file.name}
      className="FileObjectRow"
      onContextMenu={e => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(`pterodactyl:files:ctx:${file.key}`, { detail: e.clientX }));
      }}
    >
      <td className="FileObjectRowItems">
        <SelectFileCheckbox name={file.name} />
      </td>
      {!canReadContents || (file.isFile && !file.isEditable()) ?
        <td className="FileObjectRowItems">
          {file.isFile ?
            <span css={tw`text-white`}>{file.name}</span>
            :
            <span css={tw`text-green-920`}>{file.name}</span>
          }
        </td>
        :
        <td className="FileObjectRowItems">
          <NavLink
            to={`${match.url}${file.isFile ? '/edit' : ''}#${encodePathSegments(join(directory, file.name))}`}
          >
            {file.isFile ?
              <span css={tw`text-purple-50`}>{file.name}</span>
              :
              <span css={tw`text-green-920`}>{file.name}</span>
            }
          </NavLink>
        </td>
      }
      <td className="FileObjectRowItems">
        {bytesToHuman(file.size)}
      </td>
      <td className="FileObjectRowItems">
        {Math.abs(differenceInHours(file.modifiedAt, new Date())) > 48 ?
          format(file.modifiedAt, 'MMM do, yyyy h:mma')
          :
          formatDistanceToNow(file.modifiedAt, { addSuffix: true })
        }
      </td>
      <td className="FileObjectRowItems">
        <FileDropdownMenu file={file} />
      </td>
    </tr>
  )
};

export default memo(FileObjectRow, (prevProps, nextProps) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { isArchiveType, isEditable, ...prevFile } = prevProps.file;
  const { isArchiveType: nextIsArchiveType, isEditable: nextIsEditable, ...nextFile } = nextProps.file;
  /* eslint-enable @typescript-eslint/no-unused-vars */

  return isEqual(prevFile, nextFile);
});
