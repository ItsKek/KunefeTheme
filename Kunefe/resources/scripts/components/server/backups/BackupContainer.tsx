import React, { useContext, useEffect, useState } from 'react';
import Spinner from '@/components/elements/Spinner';
import useFlash from '@/plugins/useFlash';
import Can from '@/components/elements/Can';
import CreateBackupButton from '@/components/server/backups/CreateBackupButton';
import FlashMessageRender from '@/components/FlashMessageRender';
import BackupRow from '@/components/server/backups/BackupRow';
import tw from 'twin.macro';
import getServerBackups, { Context as ServerBackupContext } from '@/api/swr/getServerBackups';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import Pagination from '@/components/elements/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const BackupContainer = () => {
  const { page, setPage } = useContext(ServerBackupContext);
  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const { data: backups, error, isValidating } = getServerBackups();

  const backupLimit = ServerContext.useStoreState(state => state.server.data!.featureLimits.backups);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const id = ServerContext.useStoreState(state => state.server.data!.id);

  useEffect(() => {
    if (!error) {
      clearFlashes('backups');

      return;
    }

    clearAndAddHttpError({ error, key: 'backups' });
  }, [error]);

  if (!backups || (error && isValidating)) {
    return <Spinner size={'large'} centered />;
  }

  return (
    <ServerContentBlock title={'Backups'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faArchive} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Backups</h1></li>
                    <li className="spacingfix1"><small>All backups available for this server.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Backups</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <FlashMessageRender byKey={'backups'} css={tw`mb-4`} />
        <div className="card">
          <div css="height: 67px !important;" className="card-header">
            <div className="row">
              <div className="userHeader">
                <h3>All Backups</h3>
              </div>
              <div css={tw`text-right float-right`} className="userHeader">
                <Can action={'backup.create'}>
                  {backupLimit > 0 && backupLimit !== backups.pagination.total &&
                    <CreateBackupButton css={tw`w-full sm:w-auto`} />
                  }
                </Can>
              </div>
            </div>
          </div>
          {backups.pagination.total > 0 ?
            <div className="padding-none card-body table-responsive">
              <table className="table table-hover">
                <tbody css={tw`w-full`}>
                  <tr css={tw`w-full`}>
                    <th css="font-weight: 600;">Name</th>
                    <th css="font-weight: 600;">Size</th>
                    <th css="font-weight: 600;">Status</th>
                    <th css="font-weight: 600;">Finished At</th>
                    <td css="font-weight: 600;"></td>
                  </tr>
                  <Pagination data={backups} onPageSelect={setPage}>
                    {({ items }) => (
                      items.map((backup, index) =>
                        <BackupRow
                          key={backup.uuid}
                          backup={backup}
                        />)
                    )}
                  </Pagination>
                </tbody>
              </table>
            </div>
            :
            <div className="card-body">
              <div className="marginBottom-none alert alert-info">
                There are no backups listed for this server.
              </div>
            </div>
          }
        </div>
      </div>
    </ServerContentBlock >
  );
};

export default () => {
  const [page, setPage] = useState<number>(1);
  return (
    <ServerBackupContext.Provider value={{ page, setPage }}>
      <BackupContainer />
    </ServerBackupContext.Provider>
  );
};
