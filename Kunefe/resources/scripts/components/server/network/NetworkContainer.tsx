import React, { useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import useFlash from '@/plugins/useFlash';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { ServerContext } from '@/state/server';
import AllocationRow from '@/components/server/network/AllocationRow';
import Button from '@/components/elements/Button';
import createServerAllocation from '@/api/server/network/createServerAllocation';
import tw from 'twin.macro';
import Can from '@/components/elements/Can';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import getServerAllocations from '@/api/swr/getServerAllocations';
import isEqual from 'react-fast-compare';
import { useDeepCompareEffect } from '@/plugins/useDeepCompareEffect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const NetworkContainer = () => {
  const [loading, setLoading] = useState(false);
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const allocationLimit = ServerContext.useStoreState(state => state.server.data!.featureLimits.allocations);
  const allocations = ServerContext.useStoreState(state => state.server.data!.allocations, isEqual);
  const setServerFromState = ServerContext.useStoreActions(actions => actions.server.setServerFromState);

  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const { data, error, mutate } = getServerAllocations();

  useEffect(() => {
    mutate(allocations);
  }, []);

  useEffect(() => {
    if (error) {
      clearAndAddHttpError({ key: 'server:network', error });
    }
  }, [error]);

  useDeepCompareEffect(() => {
    if (!data) return;

    setServerFromState(state => ({ ...state, allocations: data }));
  }, [data]);

  const onCreateAllocation = () => {
    clearFlashes('server:network');

    setLoading(true);
    createServerAllocation(uuid)
      .then(allocation => {
        setServerFromState(s => ({ ...s, allocations: s.allocations.concat(allocation) }));
        return mutate(data ?.concat(allocation), false);
      })
      .catch(error => clearAndAddHttpError({ key: 'server:network', error }))
      .then(() => setLoading(false));
  };

  return (
    <ServerContentBlock showFlashKey={'server:network'} title={'Network'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faNetworkWired} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Server Allocations</h1></li>
                    <li className="spacingfix1"><small>Control the IPs and ports available on this server.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Allocations</li>
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
          {!data ?
            <Spinner size={'large'} centered />
            :
            <>
              <div css={tw`mb-6`} className="AllocationsContainer">
                <div className="card">
                  <div className="card-header">
                    <h3>Available Allocations</h3>
                  </div>
                  <div css="padding: 0 !important;" className="card-body table-responsive">
                    <table className="table table-hover">
                      <tbody css={tw`w-full`}>
                        <tr css={tw`w-full`}>
                          <th css="font-weight: 600;">IP Address</th>
                          <th css="font-weight: 600;">Alias</th>
                          <th css="font-weight: 600;">Port</th>
                          <th css="font-weight: 600;"></th>
                        </tr>
                        {
                          data.map(allocation => (
                            <AllocationRow
                              key={`${allocation.ip}:${allocation.port}`}
                              allocation={allocation}
                            />
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="col-sm">
                <div className="card">
                  <div className="card-header">
                    <h3>Allocation Help</h3>
                  </div>
                  <div className="card-body">
                    <p css={tw`text-center`} className="marginBottom-none">The list to the left includes all available IPs and ports that are open for your server to use for incoming connections.</p>
                    <div css={tw`w-full flex justify-center items-center`}>
                      <Can action={'allocation.create'}>
                        <SpinnerOverlay visible={loading} />
                        {allocationLimit > data.length &&
                          <Button css={tw`mt-4`} color={'purple'} onClick={onCreateAllocation}>
                            Create Allocation
                        </Button>
                        }
                      </Can>
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
        </div>
      </div>
    </ServerContentBlock>
  );
};

export default NetworkContainer;
