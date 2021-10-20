import React, { lazy, useEffect, useState } from 'react';
import getFileContents from '@/api/server/files/getFileContents';
import { httpErrorToHuman } from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import saveFileContents from '@/api/server/files/saveFileContents';
import { useHistory, useLocation, useParams } from 'react-router';
import FileNameModal from '@/components/server/files/FileNameModal';
import Can from '@/components/elements/Can';
import FlashMessageRender from '@/components/FlashMessageRender';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { ServerError } from '@/components/elements/ScreenBlock';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Select from '@/components/elements/Select';
import modes from '@/modes';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import { encodePathSegments, hashToPath } from '@/helpers';
import { dirname } from 'path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { useRouteMatch, NavLink, Link } from 'react-router-dom';

interface Props {
  withinFileEditor?: boolean;
  isNewFile?: boolean;
}

const LazyCodemirrorEditor = lazy(() => import(/* webpackChunkName: "editor" */'@/components/elements/CodemirrorEditor'));

export default ({ withinFileEditor, isNewFile }: Props) => {
  const match = useRouteMatch();

  const [error, setError] = useState('');
  const { action } = useParams<{ action: 'new' | string }>();
  const [loading, setLoading] = useState(action === 'edit');
  const [content, setContent] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mode, setMode] = useState('text/plain');

  const history = useHistory();
  const { hash } = useLocation();

  const [file, setFile] = useState<string | null>(null);
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const directory = ServerContext.useStoreState(state => state.files.directory);

  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const setDirectory = ServerContext.useStoreActions(actions => actions.files.setDirectory);
  const { addError, clearFlashes } = useFlash();

  let fetchFileContent: null | (() => Promise<string>) = null;

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
    if (action === 'new') return;

    setError('');
    setLoading(true);
    const path = hashToPath(hash);
    setDirectory(dirname(path));
    getFileContents(uuid, path)
      .then(setContent)
      .catch(error => {
        console.error(error);
        setError(httpErrorToHuman(error));
      })
      .then(() => setLoading(false));
  }, [action, uuid, hash]);

  const save = (name?: string) => {
    if (!fetchFileContent) {
      return;
    }

    setLoading(true);
    clearFlashes('files:view');
    fetchFileContent()
      .then(content => saveFileContents(uuid, name || hashToPath(hash), content))
      .then(() => {
        if (name) {
          history.push(`/server/${id}/files/edit#/${encodePathSegments(name)}`);
          return;
        }

        return Promise.resolve();
      })
      .catch(error => {
        console.error(error);
        addError({ message: httpErrorToHuman(error), key: 'files:view' });
      })
      .then(() => setLoading(false));
  };

  if (error) {
    return (
      <ServerError message={error} onBack={() => history.goBack()} />
    );
  }

  return (
    <ServerContentBlock title={'Editing a File'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Edit File</h1></li>
                    <li className="spacingfix1"><small>Make modifications to a file from the web.</small></li>
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
        <FlashMessageRender byKey={'files:view'} css={tw`mb-4`} />
        {hash.replace(/^#/, '').endsWith('.pteroignore') &&
          <div css={tw`mb-4 p-4 border-l-4 bg-neutral-900 rounded border-cyan-400`}>
            <p css={tw`text-neutral-300 text-sm`}>
              You&apos;re editing
              a <code css={tw`font-mono bg-black rounded py-px px-1`}>.pteroignore</code> file.
              Any files or directories listed in here will be excluded from backups. Wildcards are supported by
              using an asterisk (<code css={tw`font-mono bg-black rounded py-px px-1`}>*</code>). You can
              negate a prior rule by prepending an exclamation point
              (<code css={tw`font-mono bg-black rounded py-px px-1`}>!</code>).
            </p>
          </div>
        }
        <FileNameModal
          visible={modalVisible}
          onDismissed={() => setModalVisible(false)}
          onFileNamed={(name) => {
            setModalVisible(false);
            save(name);
          }}
        />
        <div className="row">
          <div className="flexGrow" />
        </div>
        <div className="row">
          <div className="fileEditContainer">
            <div className="card">
              <div className="card-header">
                <h3>File Name</h3>
              </div>
              <div className="card-body padding-none">
                <LazyCodemirrorEditor
                  mode={mode}
                  filename={hash.replace(/^#/, '')}
                  onModeChanged={setMode}
                  initialContent={content}
                  fetchContent={value => {
                    fetchFileContent = value;
                  }}
                  onContentSaved={() => {
                    if (action !== 'edit') {
                      setModalVisible(true);
                    } else {
                      save();
                    }
                  }}
                />
              </div>
              <div className="card-footer">
                {action === 'edit' ?
                  <Can action={'file.update'}>
                    <Button color={'purple'} css="height: 43px; margin-right: .5rem;" onClick={() => save()}>
                      <FontAwesomeIcon fixedWidth icon={faSave} />&nbsp;Save File
                    </Button>
                  </Can>
                  :
                  <Can action={'file.create'}>
                    <Button color={'purple'} css="height: 43px; margin-right: .5rem;" onClick={() => setModalVisible(true)}>
                      <FontAwesomeIcon fixedWidth icon={faSave} />&nbsp;Save File
                    </Button>
                  </Can>
                }
                <Select css="height: 43px;" value={mode} onChange={e => setMode(e.currentTarget.value)}>
                  {modes.map(mode => (
                    <option key={`${mode.name}_${mode.mime}`} value={mode.mime}>
                      {mode.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServerContentBlock>
  );
};
