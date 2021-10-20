import React, { useEffect, useState } from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ApplicationStore } from '@/state';
import Button from '@/components/elements/Button';
import tw from 'twin.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFingerprint, faMemory, faHdd, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import { useStoreState } from 'easy-peasy';
import { SocketEvent, SocketRequest } from '@/components/server/events';
import { bytesToHuman, megabytesToHuman } from '@/helpers';

interface Stats {
    memory: number;
    cpu: number;
    disk: number;
}

export default () => {
  const [ stats, setStats ] = useState<Stats>({ memory: 0, cpu: 0, disk: 0 });

  const status = ServerContext.useStoreState(state => state.status.value);
  const connected = ServerContext.useStoreState(state => state.socket.connected);
  const instance = ServerContext.useStoreState(state => state.socket.instance);

  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const limits = ServerContext.useStoreState(state => state.server.data!.limits);
  const diskLimit = limits.disk ? megabytesToHuman(limits.disk) : 'Unlimited';
  const memoryLimit = limits.memory ? megabytesToHuman(limits.memory) : 'Unlimited';
  const cpuLimit = limits.cpu ? limits.cpu + '%' : 'Unlimited';

  const statsListener = (data: string) => {
      let stats: any = {};
      try {
          stats = JSON.parse(data);
      } catch (e) {
          return;
      }

      setStats({
          memory: stats.memory_bytes,
          cpu: stats.cpu_absolute,
          disk: stats.disk_bytes,
      });
  };

  useEffect(() => {
      if (!connected || !instance) {
          return;
      }

      instance.addListener(SocketEvent.STATS, statsListener);
      instance.send(SocketRequest.SEND_STATS);

      return () => {
          instance.removeListener(SocketEvent.STATS, statsListener);
      };
  }, [ instance, connected ]);

  return (
    <div className="systemInfoBox">
      <div className="card">
        <div className="card-header">
          <span>System Info</span>
        </div>
        <div className="card-body">
          <div className="row" css={tw`flex justify-between items-center`}>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faFingerprint} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>Server Name</h4></li>
                <li css="margin-bottom: -15px; text-overflow: ellipsis !important; overflow: hidden !important; white-space: nowrap !important;"><small>{name}</small></li>
              </ul>
            </div>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faMemory} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>RAM</h4></li>
                <li css="margin-bottom: -15px;"><small>{bytesToHuman(stats.memory)} / {memoryLimit}</small></li>
              </ul>
            </div>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faHdd} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>Disk</h4></li>
                <li css="margin-bottom: -15px;"><small>{bytesToHuman(stats.disk)} / {diskLimit}</small></li>
              </ul>
            </div>
            <div className="informationBox">
              <div className="infoIcon">
                <FontAwesomeIcon icon={faMicrochip} />
              </div>
              <ul className="overflowFix" css={tw`py-3`}>
                <li css="margin-bottom: -15px;"><h4 css={tw`mb-2`}>CPU</h4></li>
                <li css="margin-bottom: -15px;"><small>{stats.cpu.toFixed(2)}% / {cpuLimit}</small></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
