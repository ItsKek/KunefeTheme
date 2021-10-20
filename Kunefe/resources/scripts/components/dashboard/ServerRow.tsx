import React, { memo, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEthernet, faHdd, faMemory, faMicrochip, faServer } from '@fortawesome/free-solid-svg-icons';
import { Link, NavLink } from 'react-router-dom';
import { Server } from '@/api/server/getServer';
import getServerResourceUsage, { ServerPowerState, ServerStats } from '@/api/server/getServerResourceUsage';
import { bytesToHuman, megabytesToHuman } from '@/helpers';
import tw, { TwStyle } from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import styled from 'styled-components/macro';
import isEqual from 'react-fast-compare';
import Button from '@/components/elements/Button'
import { PowerAction } from '@/components/server/ServerConsole';
import serverPower from '@/api/server/powerServer'

function statusToColor(status: string | null, installing: boolean): TwStyle {
  if (installing) {
    status = '';
  }

  switch (status) {
    case 'offline':
      return tw`bg-red-910`;
    case 'running':
      return tw`bg-green-915`;
    default:
      return tw`bg-green-910`;
  }
}

// Determines if the current value is in an alarm threshold so we can show it in red rather
// than the more faded default style.
const isAlarmState = (current: number, limit: number): boolean => limit > 0 && (current / (limit * 1024 * 1024) >= 0.90);

const Icon = memo(styled(FontAwesomeIcon) <{ $alarm: boolean }>`
    ${props => props.$alarm ? tw`text-red-400` : tw`text-neutral-500`};
`, isEqual);

const IconDescription = styled.p<{ $alarm: boolean }>`
    ${tw`text-sm ml-2`};
    ${props => props.$alarm ? tw`text-white` : tw`text-neutral-400`};
`;

const StatusIndicatorBox = styled(GreyRowBox) <{ $status: ServerPowerState | undefined }>`
margin-bottom: 1.5rem !important;
position: relative;
display: flex;
flex-direction: column;
min-width: 0;
word-wrap: break-word;
background-color: var(--secondary);
background-clip: border-box;
border-radius: .75rem;
`;

export default ({ server, className }: { server: Server; className?: string }) => {
  const interval = useRef<number>(null);
  const [isSuspended, setIsSuspended] = useState(server.status === 'suspended');
  const [stats, setStats] = useState<ServerStats | null>(null);
  const isInstalling = server.status == 'installing';
  const isTransferring = server.isTransferring;

  const sendPowerCommand = (serveruuid: string, command: PowerAction) => {
    serverPower(serveruuid, command)
  };

  const getStats = () => getServerResourceUsage(server.uuid)
    .then(data => setStats(data))
    .catch(error => console.error(error));

  useEffect(() => {
    setIsSuspended(stats ?.isSuspended || server.status === 'suspended');
  }, [stats ?.isSuspended, server.status]);

  useEffect(() => {
    // Don't waste a HTTP request if there is nothing important to show to the user because
    // the server is suspended.
    if (isSuspended) return;

    getStats().then(() => {
      // @ts-ignore
      interval.current = setInterval(() => getStats(), 5000);
    });

    return () => {
      interval.current && clearInterval(interval.current);
    };
  }, [isSuspended]);

  const alarms = { cpu: false, memory: false, disk: false };
  if (stats) {
    alarms.cpu = server.limits.cpu === 0 ? false : (stats.cpuUsagePercent >= (server.limits.cpu * 0.9));
    alarms.memory = isAlarmState(stats.memoryUsageInBytes, server.limits.memory);
    alarms.disk = server.limits.disk === 0 ? false : isAlarmState(stats.diskUsageInBytes, server.limits.disk);
  }

  const diskLimit = server.limits.disk !== 0 ? megabytesToHuman(server.limits.disk) : 'Unlimited';
  const memoryLimit = server.limits.memory !== 0 ? megabytesToHuman(server.limits.memory) : 'Unlimited';
  const cpuLimit = server.limits.cpu !== 0 ? server.limits.cpu + ' %' : 'Unlimited';

  return (
    <div className="serverRow">
      <StatusIndicatorBox css={tw`p-0`} $hoverable={false} className={className} $status={stats ?.status}>
        <NavLink css={tw`w-full`} to={`/server/${server.id}`}>
          <div className="minecraftHeader" css={tw`w-full relative block bg-center bg-cover`}>
            <div css={tw`relative`}>
              <h1 css="text-overflow: ellipsis !important; overflow: hidden !important; white-space: nowrap !important;">{server.name}</h1>
              <div>
                {!stats ?
                  <>
                    <span css={tw`text-white uppercase`} className="statusBox">
                      {server.isTransferring ?
                        'Transferring'
                        :
                        server.status === 'installing' ? 'Installing' : (
                          server.status === 'restoring_backup' ?
                            'Restoring Backup'
                            :
                            'Unavailable'
                        )
                      }
                    </span>
                  </>
                  :
                  <span className="statusBox" css={[
                    tw`uppercase`,
                    statusToColor(stats!.status, isInstalling || isTransferring)
                  ]}>
                    {!stats ? 'Connecting...' : (isInstalling ? 'Installing' : (isTransferring) ? 'Transferring' : stats.status)}
                  </span>
                }
              </div>
              <div css={tw`text-white uppercase`} className="allocationBox">
                {
                  server.allocations.filter(alloc => alloc.isDefault).map(allocation => (
                    <React.Fragment key={allocation.ip + allocation.port.toString()}>
                      {allocation.alias || allocation.ip}:{allocation.port}
                    </React.Fragment>
                  ))
                }
              </div>
            </div>
          </div>
        </NavLink>
        <div className="infoBox">
          <div css={tw`justify-center`} className="row">
            <div className="infoContainer1">
              <ul className="infoList">
                <li css={tw`text-white`} className="padding5px">
                  <span css={tw`pr-5 font-bold`}>UUID:</span>
                  <span>{server.id}</span>
                </li>
                <li css={tw`text-white`} className="padding5px">
                  <span css={tw`pr-5 font-bold`}>Node:</span>
                  <span>{server.node}</span>
                </li>
                <li css={tw`text-white`} className="padding5px">
                  <span css={tw`pr-5 font-bold`}>Packet:</span>
                  <span css="text-overflow: ellipsis !important; overflow: hidden !important; white-space: nowrap !important;">{server.eggName}</span>
                </li>
              </ul>
            </div>
            {(!stats || isSuspended) ?
              isSuspended ?
              <div className="infoContainer1">
                <ul className="infoList">
                  <li css={tw`text-white`} className="padding5px">
                    <span css={tw`pr-5 font-bold`}>RAM:</span>
                    <span>Unavailable</span>
                  </li>
                  <li css={tw`text-white`} className="padding5px">
                    <span css={tw`pr-5 font-bold`}>CPU:</span>
                    <span>Unavailable</span>
                  </li>
                  <li css={tw`text-white`} className="padding5px">
                    <span css={tw`pr-5 font-bold`}>DISK:</span>
                    <span>Unavailable</span>
                  </li>
                </ul>
              </div>
                :
                (server.isTransferring || server.status) ?
                <div className="infoContainer1">
                  <ul className="infoList">
                    <li css={tw`text-white`} className="padding5px">
                      <span css={tw`pr-5 font-bold`}>RAM:</span>
                      <span>Unavailable</span>
                    </li>
                    <li css={tw`text-white`} className="padding5px">
                      <span css={tw`pr-5 font-bold`}>CPU:</span>
                      <span>Unavailable</span>
                    </li>
                    <li css={tw`text-white`} className="padding5px">
                      <span css={tw`pr-5 font-bold`}>DISK:</span>
                      <span>Unavailable</span>
                    </li>
                  </ul>
                </div>
                  :
                  <div className="infoContainer1">
                    <ul className="infoList">
                      <li css={tw`text-white`} className="padding5px">
                        <span css={tw`pr-5 font-bold`}>RAM:</span>
                        <span>Unavailable</span>
                      </li>
                      <li css={tw`text-white`} className="padding5px">
                        <span css={tw`pr-5 font-bold`}>CPU:</span>
                        <span>Unavailable</span>
                      </li>
                      <li css={tw`text-white`} className="padding5px">
                        <span css={tw`pr-5 font-bold`}>DISK:</span>
                        <span>Unavailable</span>
                      </li>
                    </ul>
                  </div>
              :
              <div className="infoContainer1">
                <ul className="infoList">
                  <li css={tw`text-white`} className="padding5px">
                    <span css={tw`pr-5 font-bold`}>RAM:</span>
                    <span>{bytesToHuman(stats.memoryUsageInBytes)}</span>
                  </li>
                  <li css={tw`text-white`} className="padding5px">
                    <span css={tw`pr-5 font-bold`}>CPU:</span>
                    <span>{stats.cpuUsagePercent.toFixed(2)}%</span>
                  </li>
                  <li css={tw`text-white`} className="padding5px">
                    <span css={tw`pr-5 font-bold`}>DISK:</span>
                    <span>{bytesToHuman(stats.diskUsageInBytes)}</span>
                  </li>
                </ul>
              </div>
            }
            <div className="serverRowButtons">
              <div className="buttonLeft">
                <Link to={`/server/${server.id}`}>
                  <Button className="h43" css={tw`block w-full`} color={'purple'}>
                    <span>Console</span>
                  </Button>
                </Link>
              </div>
              <div className="buttonLeft">
                {!stats ?
                  null
                  :
                  (stats.status === 'running') &&
                  <Button className="h43" css={tw`block w-full`} color={'stop'} onClick={e => {e.preventDefault();sendPowerCommand(server.uuid, 'kill');}}>
                    <span>Stop</span>
                  </Button>
                }
                {!stats ?
                  null
                  :
                  (stats.status === 'starting') &&
                  <Button className="h43" css={tw`block w-full`} color={'stop'} onClick={e => {e.preventDefault();sendPowerCommand(server.uuid, 'kill');}}>
                    <span>Stop</span>
                  </Button>
                }
                {!stats ?
                  null
                  :
                  (stats.status === 'offline') &&
                  <Button className="h43" css={tw`block w-full`} color={'start'} onClick={e => {e.preventDefault();sendPowerCommand(server.uuid, 'start');}}>
                    <span>Start</span>
                  </Button>
                }
              </div>
            </div>
          </div>
        </div>
      </StatusIndicatorBox>
    </div>
  );
};
