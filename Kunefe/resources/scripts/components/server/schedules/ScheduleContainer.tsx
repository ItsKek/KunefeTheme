import React, { useEffect, useState } from 'react';
import getServerSchedules from '@/api/server/schedules/getServerSchedules';
import { ServerContext } from '@/state/server';
import Spinner from '@/components/elements/Spinner';
import { useHistory, useRouteMatch } from 'react-router-dom';
import FlashMessageRender from '@/components/FlashMessageRender';
import ScheduleRow from '@/components/server/schedules/ScheduleRow';
import { httpErrorToHuman } from '@/api/http';
import EditScheduleModal from '@/components/server/schedules/EditScheduleModal';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Button from '@/components/elements/Button';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default () => {
  const match = useRouteMatch();
  const history = useHistory();

  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const { clearFlashes, addError } = useFlash();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  const schedules = ServerContext.useStoreState(state => state.schedules.data);
  const setSchedules = ServerContext.useStoreActions(actions => actions.schedules.setSchedules);

  useEffect(() => {
    clearFlashes('schedules');
    getServerSchedules(uuid)
      .then(schedules => setSchedules(schedules))
      .catch(error => {
        addError({ message: httpErrorToHuman(error), key: 'schedules' });
        console.error(error);
      })
      .then(() => setLoading(false));
  }, []);

  return (
    <ServerContentBlock title={'Schedules'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Schedule Manager</h1></li>
                    <li className="spacingfix1"><small>Manage all of this server's schedules in one place.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Schedules</li>
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
          <FlashMessageRender byKey={'schedules'} css={tw`mb-4`} />
          {(!schedules.length && loading) ?
            <Spinner size={'large'} centered />
            :
            <div className="col">
              <div className="card">
                <div className="card-header">
                  <div className="row">
                    <div className="ScheduleHeader">
                      <h3>Current Schedules</h3>
                    </div>
                    <div className="ScheduleHeader">
                      <Can action={'schedule.create'}>
                        <EditScheduleModal visible={visible} onModalDismissed={() => setVisible(false)} />
                        <Button css={tw`float-right`} size={'xsmall'} color={'purple'} type={'button'} onClick={() => setVisible(true)}>
                          Create New
                        </Button>
                      </Can>
                    </div>
                  </div>
                </div>
                <div className="padding-none card-body table-responsive">
                  <table className="table table-hover">
                    <tbody css={tw`w-full`}>
                      <tr css={tw`w-full`}>
                        <th css="font-weight: 600;">Name</th>
                        <th css="font-weight: 600;">Status</th>
                        <th css="font-weight: 600;">Last Run</th>
                        <th css="font-weight: 600;">Next Run</th>
                      </tr>
                      <>
                        {
                          schedules.length === 0 ?
                            null
                            :
                            schedules.map(schedule => (
                              <tr
                                key={schedule.id}
                                css={tw`cursor-pointer mb-2 flex-wrap`}
                                onClick={(e: any) => {
                                  e.preventDefault();
                                  history.push(`${match.url}/${schedule.id}`);
                                }}
                              >
                                <ScheduleRow schedule={schedule} />
                              </tr>
                            ))
                        }
                      </>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </ServerContentBlock>
  );
};
