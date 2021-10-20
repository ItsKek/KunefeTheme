import React, { useEffect, useState, useRef } from 'react';
import { httpErrorToHuman } from '@/api/http';
import { CSSTransition } from 'react-transition-group';
import Spinner from '@/components/elements/Spinner';
import FileObjectRow from '@/components/server/files/FileObjectRow';
import { FileObject } from '@/api/server/files/loadDirectory';
import NewDirectoryButton from '@/components/server/files/NewDirectoryButton';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Can from '@/components/elements/Can';
import { ServerError } from '@/components/elements/ScreenBlock';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import { ServerContext } from '@/state/server';
import useFileManagerSwr from '@/plugins/useFileManagerSwr';
import useFlash from '@/plugins/useFlash';
import MassActionsBar from '@/components/server/files/MassActionsBar';
import UploadButton from '@/components/server/files/UploadButton';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useStoreActions } from '@/state/hooks';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { FileActionCheckbox } from '@/components/server/files/SelectFileCheckbox';
import { encodePathSegments, hashToPath } from '@/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faFolder, faFileAlt, faAngleDown, faFileArchive, faTrashAlt, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';
import styled, { keyframes } from 'styled-components/macro';
import Fade from '@/components/elements/Fade';
import MassActionDropDown from '@/components/elements/MassActionsDropdown';
import RenameFileModal from '@/components/server/files/RenameFileModal';
import deleteFiles from '@/api/server/files/deleteFiles';
import compressFiles from '@/api/server/files/compressFiles';
import ConfirmationModal from '@/components/elements/ConfirmationModal';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';

const StyledRow = styled.div<{ $danger?: boolean }>`
    ${tw`p-2 flex items-center rounded`};
    ${props => props.$danger ? tw`hover:bg-neutral-920 hover:text-purple-50` : tw`hover:bg-neutral-920 hover:text-purple-50`};
`;

interface RowProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: IconDefinition;
  title: string;
  $danger?: boolean;
}

const Row = ({ icon, title, ...props }: RowProps) => (
  <StyledRow {...props}>
    <FontAwesomeIcon icon={icon} css={tw`text-xs`} fixedWidth />
    <span css={tw`ml-2`}>{title}</span>
  </StyledRow>
);

const fade = keyframes`
    from { opacity: 0 }
    to { opacity: 1 }
`;

const Toast = styled.div`
    ${tw`fixed z-50 bottom-0 left-0 mb-4 w-full flex justify-end pr-4`};
    animation: ${fade} 250ms linear;
    & > div {
        ${tw`rounded px-4 py-2 text-white border border-neutral-910 bg-red-915`};
    }
`;

interface Props {
  withinFileEditor?: boolean;
  isNewFile?: boolean;
}

const sortFiles = (files: FileObject[]): FileObject[] => {
  return files.sort((a, b) => a.name.localeCompare(b.name))
    .sort((a, b) => a.isFile === b.isFile ? 0 : (a.isFile ? 1 : -1));
};

export default ({ withinFileEditor, isNewFile }: Props) => {
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const { hash } = useLocation();
  const { data: files, error, mutate } = useFileManagerSwr();
  const [file, setFile] = useState<string | null>(null);
  const onClickRef = useRef<MassActionDropDown>(null);
  const directory = ServerContext.useStoreState(state => state.files.directory);
  const setDirectory = ServerContext.useStoreActions(actions => actions.files.setDirectory);
  const selectedFiles = ServerContext.useStoreState(state => state.files.selectedFiles);
  const setSelectedFiles = ServerContext.useStoreActions(actions => actions.files.setSelectedFiles);
  const selectedFilesLength = ServerContext.useStoreState(state => state.files.selectedFiles.length);
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMove, setShowMove] = useState(false);

  useEffect(() => {
    if (!loading) setLoadingMessage('');
  }, [loading]);

  const onClickCompress = () => {
    setLoading(true);
    clearFlashes('files');
    setLoadingMessage('Archiving files...');

    compressFiles(uuid, directory, selectedFiles)
      .then(() => mutate())
      .then(() => setSelectedFiles([]))
      .catch(error => clearAndAddHttpError({ key: 'files', error }))
      .then(() => setLoading(false));
  };

  const onClickConfirmDeletion = () => {
    setLoading(true);
    setShowConfirm(false);
    clearFlashes('files');
    setLoadingMessage('Deleting files...');

    deleteFiles(uuid, directory, selectedFiles)
      .then(() => {
        mutate(files => files.filter(f => selectedFiles.indexOf(f.name) < 0), false);
        setSelectedFiles([]);
      })
      .catch(error => {
        mutate();
        clearAndAddHttpError({ key: 'files', error });
      })
      .then(() => setLoading(false));
  };

  useEffect(() => {
    const path = hashToPath(hash);

    if (withinFileEditor && !isNewFile) {
      const name = path.split('/').pop() || null;
      setFile(name);
    }
  }, [withinFileEditor, isNewFile, hash]);

  const breadcrumbs = (): { name: string; path?: string }[] => directory.split('/')
    .filter(directory => !!directory)
    .map((directory, index, dirs) => {
      if (!withinFileEditor && index === dirs.length - 1) {
        return { name: directory };
      }

      return { name: directory, path: `/${dirs.slice(0, index + 1).join('/')}` };
    });

  useEffect(() => {
    clearFlashes('files');
    setSelectedFiles([]);
    setDirectory(hashToPath(hash));
  }, [hash]);

  useEffect(() => {
    mutate();
  }, [directory]);

  const onSelectAllClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.currentTarget.checked ? (files ?.map(file => file.name) || []) : []);
  };

  if (error) {
    return (
      <ServerError message={httpErrorToHuman(error)} onRetry={() => mutate()} />
    );
  }

  return (
    <>
      <ServerContentBlock title={'File Manager'} showFlashKey={'files'}>
        <SpinnerOverlay visible={loading} size={'large'} fixed>
          {loadingMessage}
        </SpinnerOverlay>
        <ConfirmationModal
          visible={showConfirm}
          title={'Delete these files?'}
          buttonText={'Yes, Delete Files'}
          onConfirmed={onClickConfirmDeletion}
          onModalDismissed={() => setShowConfirm(false)}
        >
          Deleting files is a permanent operation, you cannot undo this action.
        </ConfirmationModal>
        {showMove &&
          <RenameFileModal
            files={selectedFiles}
            visible
            appear
            useMoveTerminology
            onDismissed={() => setShowMove(false)}
          />
        }
        <div css={tw`relative mb-12`}>
          <div className="container">
            <div>
              <div className="row" css={tw`flex justify-between items-center`}>
                <div className="dashboardHeader">
                  <div css={tw`inline-flex`}>
                    <div className="serverIcon">
                      <FontAwesomeIcon icon={faFolder} />
                    </div>
                    <ul className="dashboardHeaderText">
                      <li><h1 css={tw`mb-0`}>File Manager</h1></li>
                      <li className="spacingfix1"><small>Manage all of your files directly from the web.</small></li>
                    </ul>
                  </div>
                </div>
                <div className="dashboardHeader">
                  <div>
                    <ol className="breadcrumb">
                      <Link className="breadcrumb-item" to={`/server/${id}`}>
                        <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                      </Link>
                      <li className="breadcrumb-item active">File Management</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="flexGrow" />
          </div>
          <div className="row">
            <div className="MassActionsRow">
              <div css={tw`p-2 mb-2`} className="card">
                <div>
                  <NavLink
                    to={`/server/${id}/files/new${window.location.hash}`}
                    css={tw`flex-1 sm:flex-none sm:mt-0`}
                  >
                    <Button css="margin-bottom: 0.5rem; height: 43px; width: 100%;" color={'start'}>
                      New File <FontAwesomeIcon icon={faFileAlt} />
                    </Button>
                  </NavLink>
                  <NewDirectoryButton css={tw`w-full`} />
                  <UploadButton css={tw`w-full`} />
                  {selectedFiles.length > 0 ?
                    <MassActionDropDown
                      ref={onClickRef}
                      renderToggle={onClick => (
                        <div onClick={onClick}>
                          <Button css="height: 43px; width: 100%;" color={'dark'}>
                            <span css={tw`flex justify-center items-center`}>Mass Actions <FontAwesomeIcon css={tw`ml-1`} icon={faAngleDown} /></span>
                          </Button>
                        </div>
                      )}
                    >
                      <Row css={tw`cursor-pointer`} onClick={() => setShowMove(true)} icon={faLevelUpAlt} title={'Move'} />
                      <Row css={tw`cursor-pointer`} onClick={onClickCompress} icon={faFileArchive} title={'Archive'} />
                      <Row css={tw`cursor-pointer`} onClick={() => setShowConfirm(true)} icon={faTrashAlt} title={'Delete'} />
                    </MassActionDropDown>
                    :
                    <Button css="cursor: not-allowed; transform: translateY(0) !important; opacity: 0.65; height: 43px; width: 100%;" color={'dark'}>
                      <span css={tw`flex justify-center items-center`}>Mass Actions <FontAwesomeIcon css={tw`ml-1`} icon={faAngleDown} /></span>
                    </Button>
                  }
                </div>
              </div>
            </div>
            <div className="fileRowContainer">
              <div className="card" css={tw`p-0`}>
                <div className="card-header">
                  <h3>
                    <span css={tw`text-white`}>/home</span>
                    <NavLink to={`/server/${id}/files`}>
                      <span css={tw`text-white`}>/container/</span>
                    </NavLink>
                    {
                      breadcrumbs().map((crumb, index) => (
                        crumb.path ?
                          <React.Fragment key={index}>
                            <NavLink
                              to={`/server/${id}/files#${encodePathSegments(crumb.path)}`}
                              css={tw`px-1 text-neutral-200 no-underline hover:text-neutral-100`}
                            >
                              <span css={tw`text-white`}>{crumb.name}</span>
                            </NavLink>/
                          </React.Fragment>
                          :
                          <span css={tw`text-white`} key={index}>{crumb.name}</span>
                      ))
                    }
                    {file &&
                      <React.Fragment>
                        <span css={tw`text-white`}>{file}</span>
                      </React.Fragment>
                    }
                  </h3>
                </div>
                <div className="padding-none card-body" css={tw`p-0`}>
                  <table css={tw`w-full`}>
                    <thead css={tw`w-full`}>
                      <tr css={tw`w-full`}>
                        <th className="fileRowTh">
                          <FileActionCheckbox
                            type={'checkbox'}
                            checked={selectedFilesLength === (files ?.length === 0 ? -1 : files ?.length)}
                            onChange={onSelectAllClick}
                          />
                        </th>
                        <th className="fileRowTh">Name</th>
                        <th className="fileRowTh">Size</th>
                        <th className="fileRowTh">Last Modified</th>
                        <th className="fileRowTh"></th>
                      </tr>
                    </thead>
                    {
                      !files ?
                        <Spinner size={'large'} centered />
                        :
                        <>
                          {!files.length ?
                            <Toast>
                              <div>
                                This directory seems to be empty.
                              </div>
                            </Toast>
                            :
                            <CSSTransition classNames={'fade'} timeout={150} appear in>
                              <tbody>
                                {
                                  sortFiles(files.slice(0, 250)).map(file => (
                                    <FileObjectRow key={file.key} file={file} />
                                  ))
                                }
                              </tbody>
                            </CSSTransition>
                          }
                        </>
                    }
                  </table>
                </div>
              </div>
              <div css={tw`mt-4`} className="card card-body">
                <p className="text-muted">When configuring any file paths in your server plugins or settings you should use
                <code> /home/container </code>
                  as your base path. The maximum size for web-based file uploads to this node is
                <code> 100 MB</code>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </ServerContentBlock>
    </>
  );
};
