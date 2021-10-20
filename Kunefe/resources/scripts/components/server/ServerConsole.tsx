import React, { lazy, memo } from 'react';
import { ServerContext } from '@/state/server';
import Can from '@/components/elements/Can';
import ContentContainer from '@/components/elements/ContentContainer';
import tw from 'twin.macro';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import ServerDetailsBlock from '@/components/server/ServerDetailsBlock';
import isEqual from 'react-fast-compare';
import PowerControls from '@/components/server/PowerControls';
import { EulaModalFeature, JavaVersionModalFeature } from '@feature/index';
import ErrorBoundary from '@/components/elements/ErrorBoundary';
import Spinner from '@/components/elements/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

const ChunkedConsole = lazy(() => import(/* webpackChunkName: "console" */'@/components/server/Console'));
const ChunkedStatGraphs = lazy(() => import(/* webpackChunkName: "graphs" */'@/components/server/StatGraphs'));

const ServerConsole = () => {
  const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);
  const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
  const eggFeatures = ServerContext.useStoreState(state => state.server.data!.eggFeatures, isEqual);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const id = ServerContext.useStoreState(state => state.server.data!.id);

  return (
    <ServerContentBlock title={'Console'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faTerminal} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Server Console</h1></li>
                    <li className="spacingfix1"><small>Control your server in real time.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Console</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Spinner.Suspense>
          <ErrorBoundary>
            <ChunkedConsole />
          </ErrorBoundary>
          <ChunkedStatGraphs />
        </Spinner.Suspense>
        <React.Suspense fallback={null}>
          {eggFeatures.includes('eula') && <EulaModalFeature />}
          {eggFeatures.includes('java_version') && <JavaVersionModalFeature />}
        </React.Suspense>
      </div>
    </ServerContentBlock>
  );
};

export default memo(ServerConsole, isEqual);
