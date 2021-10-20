import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ApplicationStore } from '@/state';
import Button from '@/components/elements/Button';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faLightbulb, faSignal, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';

export default () => {

  const status = ServerContext.useStoreState(state => state.status.value);
  const connected = ServerContext.useStoreState(state => state.socket.connected);
  const instance = ServerContext.useStoreState(state => state.socket.instance);
  const isInstalling = ServerContext.useStoreState(state => state.server.data!.isInstalling);
  const isTransferring = ServerContext.useStoreState(state => state.server.data!.isTransferring);
  const eggName = ServerContext.useStoreState(state => state.server.data!.eggName);
  const nodeIp = ServerContext.useStoreState(state => state.server.data!.nodeIp);
  const primaryAllocation = ServerContext.useStoreState(state => state.server.data!.allocations.filter(alloc => alloc.isDefault).map(
      allocation => (allocation.alias || allocation.ip) + ':' + allocation.port
  )).toString();
  const [ location, setLocation ] = useState("");

  fetch("https://ipwhois.app/json/"+`${nodeIp}`)
    .then(res => res.json())
    .then(res => {
        setLocation(res.country);
    });

  return (
    <div className="systemInfoBox">
      <div className="card">
        <div className="card-header">
          <span>Server Info</span>
        </div>
        <div className="card-body">
          <div className="row" css={tw`flex justify-between items-center`}>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faBox} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>Packet</h4></li>
                <li css="margin-bottom: -15px;"><small>{eggName}</small></li>
              </ul>
            </div>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>Status</h4></li>
                <li css="margin-bottom: -15px;"><small>{!status ? 'Connecting...' : (isInstalling ? 'Installing' : (isTransferring) ? 'Transferring' : status).charAt(0).toUpperCase() + (status).slice(1)}</small></li>
              </ul>
            </div>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faSignal} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>Connection Address</h4></li>
                <li css="margin-bottom: -15px;"><small>{primaryAllocation}</small></li>
              </ul>
            </div>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faLocationArrow} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>Node Location</h4></li>
                <li css="margin-bottom: -15px;"><small>{location}</small></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
