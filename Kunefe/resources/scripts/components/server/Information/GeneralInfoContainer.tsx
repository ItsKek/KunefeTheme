import React from 'react';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { ServerContext } from '@/state/server';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import RenameServerBox from '@/components/server/Information/RenameServerBox';
import SystemInfoBox from '@/components/server/Information/SystemInfoBox';
import ServerInfoBox from '@/components/server/Information/ServerInfoBox';
import FlashMessageRender from '@/components/FlashMessageRender';
import Can from '@/components/elements/Can';
import ReinstallServerBox from '@/components/server/settings/ReinstallServerBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import isEqual from 'react-fast-compare';
import CopyOnClick from '@/components/elements/CopyOnClick';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default () => {
  const username = useStoreState(state => state.user.data!.username);
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const node = ServerContext.useStoreState(state => state.server.data!.node);
  const sftp = ServerContext.useStoreState(state => state.server.data!.sftpDetails, isEqual);

  return (
    <ServerContentBlock title={'General Information'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faInfoCircle} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>General Information</h1></li>
                    <li className="spacingfix1"><small>View details about your server.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Information</li>
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
          <div className="changeNameContainer">
            <Can action={'settings.rename'}>
              <RenameServerBox />
            </Can>
          </div>
          <SystemInfoBox />
          <ServerInfoBox />
        </div>
      </div>
    </ServerContentBlock>
  );
};
