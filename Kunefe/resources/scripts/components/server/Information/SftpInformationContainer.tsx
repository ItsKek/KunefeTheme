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
    <ServerContentBlock title={'SFTP Information'}>
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
                    <li><h1 css={tw`mb-0`}>SFTP Configuration</h1></li>
                    <li className="spacingfix1"><small>Account details for SFTP connections.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">SFTP Info</li>
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
          <div className="sftpInfoContainer">
            <div className="card">
              <div className="card-header">
                <h3>SFTP Details</h3>
              </div>
              <div className="card-body">
                <div className="row" css={tw`items-center`}>
                  <div className="sftpInfoCol">
                    <div css={tw`mb-6`}>
                      <Label className="bigLabel">Connection Address</Label>
                      <Input
                        type={'text'}
                        value={`sftp://${sftp.ip}:${sftp.port}`}
                        readOnly
                      />
                    </div>
                    <div css={tw`mb-6`}>
                      <Label className="bigLabel">Connection Address</Label>
                      <Input
                        type={'text'}
                        value={`${username}.${id}`}
                        readOnly
                      />
                    </div>
                    <p className="marginBottom-none" css="font-size: 0.875rem; background-color: var(--info) !important; position: relative; padding: 1rem 1.5rem; border: 1px solid transparent; border-radius: 0.375rem;">
                      The SFTP password is your account password. Ensure that your client is set to use SFTP and not FTP or FTPS for connections, there is a difference between the protocols.
                    </p>
                  </div>
                  <div css={tw`text-center`} className="sftpInfoImage">
                    <img width="100%" src="https://media.discordapp.net/attachments/829559569071996968/870592676087603250/sftp.png" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ServerContentBlock>
  );
};
