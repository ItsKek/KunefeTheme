import React, { useCallback, useEffect, useState } from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import VariableBox from '@/components/server/startup/VariableBox';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import getServerStartup from '@/api/swr/getServerStartup';
import Spinner from '@/components/elements/Spinner';
import { ServerError } from '@/components/elements/ScreenBlock';
import { httpErrorToHuman } from '@/api/http';
import { ServerContext } from '@/state/server';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import Select from '@/components/elements/Select';
import isEqual from 'react-fast-compare';
import Input from '@/components/elements/Input';
import setSelectedDockerImage from '@/api/server/setSelectedDockerImage';
import InputSpinner from '@/components/elements/InputSpinner';
import useFlash from '@/plugins/useFlash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const StartupContainer = () => {
  const [loading, setLoading] = useState(false);
  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const id = ServerContext.useStoreState(state => state.server.data!.id);

  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const variables = ServerContext.useStoreState(({ server }) => ({
    variables: server.data!.variables,
    invocation: server.data!.invocation,
    dockerImage: server.data!.dockerImage,
  }), isEqual);

  const { data, error, isValidating, mutate } = getServerStartup(uuid, {
    ...variables,
    dockerImages: [variables.dockerImage],
  });

  const setServerFromState = ServerContext.useStoreActions(actions => actions.server.setServerFromState);
  const isCustomImage = data && !data.dockerImages.map(v => v.toLowerCase()).includes(variables.dockerImage.toLowerCase());

  useEffect(() => {
    // Since we're passing in initial data this will not trigger on mount automatically. We
    // want to always fetch fresh information from the API however when we're loading the startup
    // information.
    mutate();
  }, []);

  useDeepCompareEffect(() => {
    if (!data) return;

    setServerFromState(s => ({
      ...s,
      invocation: data.invocation,
      variables: data.variables,
    }));
  }, [data]);

  const updateSelectedDockerImage = useCallback((v: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true);
    clearFlashes('startup:image');

    const image = v.currentTarget.value;
    setSelectedDockerImage(uuid, image)
      .then(() => setServerFromState(s => ({ ...s, dockerImage: image })))
      .catch(error => {
        console.error(error);
        clearAndAddHttpError({ key: 'startup:image', error });
      })
      .then(() => setLoading(false));
  }, [uuid]);

  return (
    !data ?
      (!error || (error && isValidating)) ?
        <Spinner centered size={Spinner.Size.LARGE} />
        :
        <ServerError
          title={'Oops!'}
          message={httpErrorToHuman(error)}
          onRetry={() => mutate()}
        />
      :
      <>
        <ServerContentBlock title={'Startup Settings'} showFlashKey={'startup:image'}>
          <div css={tw`relative mb-12`}>
            <div className="container">
              <div>
                <div className="row" css={tw`flex justify-between items-center`}>
                  <div className="dashboardHeader">
                    <div css={tw`inline-flex`}>
                      <div className="serverIcon">
                        <FontAwesomeIcon icon={faPlay} />
                      </div>
                      <ul className="dashboardHeaderText">
                        <li><h1 css={tw`mb-0`}>Start Configuration</h1></li>
                        <li className="spacingfix1"><small>Control server startup arguments.</small></li>
                      </ul>
                    </div>
                  </div>
                  <div className="dashboardHeader">
                    <div>
                      <ol className="breadcrumb">
                        <Link className="breadcrumb-item" to={`/server/${id}`}>
                          <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                        </Link>
                        <li className="breadcrumb-item active">Startup</li>
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
              <div className="col">
                <div css={tw`mb-6`} className="card">
                  <div className="card-header">
                    <h3>Startup Command</h3>
                  </div>
                  <div className="card-body">
                    <div css={tw`mb-6`}>
                      <Input disabled readOnly value={data.invocation} />
                    </div>
                  </div>
                </div>
                <div css={tw`mb-6`} className="card">
                  <div className="card-header">
                    <h3>Docker Image</h3>
                  </div>
                  <div className="card-body">
                    <div css={tw`mb-6`}>
                      {data.dockerImages.length > 1 && !isCustomImage ?
                        <>
                          <InputSpinner visible={loading}>
                            <Input
                              as={Select}
                              disabled={data.dockerImages.length < 2}
                              onChange={updateSelectedDockerImage}
                              defaultValue={variables.dockerImage}
                            >
                              {data.dockerImages.map(image => (
                                <option key={image} value={image}>{image}</option>
                              ))}
                            </Input>
                          </InputSpinner>
                        </>
                        :
                        <>
                          <Input disabled readOnly value={variables.dockerImage} />
                        </>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {data.variables.map(variable => <VariableBox key={variable.envVariable} variable={variable} />)}
            </div>
          </div>
        </ServerContentBlock>
      </>
  );
};

export default StartupContainer;
