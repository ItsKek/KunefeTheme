import React, { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import getServerSchedule from '@/api/server/schedules/getServerSchedule';
import Spinner from '@/components/elements/Spinner';
import FlashMessageRender from '@/components/FlashMessageRender';
import EditScheduleModal from '@/components/server/schedules/EditScheduleModal';
import NewTaskButton from '@/components/server/schedules/NewTaskButton';
import DeleteScheduleButton from '@/components/server/schedules/DeleteScheduleButton';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import { ServerContext } from '@/state/server';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import ScheduleTaskRow from '@/components/server/schedules/ScheduleTaskRow';
import isEqual from 'react-fast-compare';
import { format } from 'date-fns';
import ScheduleCronRow from '@/components/server/schedules/ScheduleCronRow';
import RunScheduleButton from '@/components/server/schedules/RunScheduleButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface Params {
  id: string;
}

const CronBox = ({ title, value }: { title: string; value: string }) => (
  <div css={tw`bg-neutral-910 rounded p-3`}>
    <p css={tw`text-white text-sm`}>{title}</p>
    <p css={tw`text-xl font-medium text-white`}>{value}</p>
  </div>
);

const ActivePill = ({ active }: { active: boolean }) => (
  <span
    css={[
      tw`rounded-full px-2 py-px text-xs ml-4 uppercase`,
      active ? tw`bg-purple-50 text-white` : tw`bg-purple-50 text-white`,
    ]}
  >
    {active ? 'Active' : 'Inactive'}
  </span>
);

export default () => {
  const history = useHistory();
  const { id: scheduleId } = useParams<Params>();

  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const id = ServerContext.useStoreState(state => state.server.data!.id);
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);

  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  const schedule = ServerContext.useStoreState(st => st.schedules.data.find(s => s.id === Number(scheduleId)), isEqual);
  const appendSchedule = ServerContext.useStoreActions(actions => actions.schedules.appendSchedule);

  useEffect(() => {
    if (schedule ?.id === Number(scheduleId)) {
      setIsLoading(false);
      return;
    }

    clearFlashes('schedules');
    getServerSchedule(uuid, Number(scheduleId))
      .then(schedule => appendSchedule(schedule))
      .catch(error => {
        console.error(error);
        clearAndAddHttpError({ error, key: 'schedules' });
      })
      .then(() => setIsLoading(false));
  }, [scheduleId]);

  const toggleEditModal = useCallback(() => {
    setShowEditModal(s => !s);
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
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Edit Schedule</h1></li>
                    <li className="spacingfix1"><small>Edit the schedule details.</small></li>
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
        <FlashMessageRender byKey={'schedules'} css={tw`mb-4`} />
        {!schedule || isLoading ?
          <Spinner size={'large'} centered />
          :
          <>
            <ScheduleCronRow cron={schedule.cron} css={tw`sm:hidden bg-neutral-910 rounded mb-4 p-3`} />
            <div css={tw`rounded shadow`}>
              <div css={tw`sm:flex items-center bg-neutral-910 p-3 sm:p-6 border-b-4 border-purple-50 rounded-t`}>
                <div css={tw`flex-1`}>
                  <h3 css={tw`flex items-center text-white text-2xl`}>
                    {schedule.name}
                    {schedule.isProcessing ?
                      <span
                        css={tw`flex items-center rounded-full px-2 py-px text-xs ml-4 uppercase bg-purple-50 text-white`}
                      >
                        <Spinner css={tw`w-3! h-3! mr-2`} />
                        Processing
                                        </span>
                      :
                      <ActivePill active={schedule.isActive} />
                    }
                  </h3>
                  <p css={tw`mt-1 text-sm text-white`}>
                    Last run at:&nbsp;
                                    {schedule.lastRunAt ?
                      format(schedule.lastRunAt, 'MMM do \'at\' h:mma')
                      :
                      <span css={tw`text-white`}>n/a</span>
                    }
                    <span css={tw`ml-4 pl-4 border-l-4 border-purple-50 py-px`}>
                      Next run at:&nbsp;
                                        {schedule.nextRunAt ?
                        format(schedule.nextRunAt, 'MMM do \'at\' h:mma')
                        :
                        <span css={tw`text-white`}>n/a</span>
                      }
                    </span>
                  </p>
                </div>
                <div css={tw`flex sm:block mt-3 sm:mt-0`}>
                  <Can action={'schedule.update'}>
                    <Button
                      color={'purple'}
                      size={'small'}
                      css={tw`flex-1 mr-4 border-transparent`}
                      onClick={toggleEditModal}
                    >
                      Edit
                                    </Button>
                    <NewTaskButton schedule={schedule} />
                  </Can>
                </div>
              </div>
              <div css={tw`hidden sm:grid grid-cols-5 md:grid-cols-5 gap-4 mb-4 mt-4`}>
                <CronBox title={'Minute'} value={schedule.cron.minute} />
                <CronBox title={'Hour'} value={schedule.cron.hour} />
                <CronBox title={'Day (Month)'} value={schedule.cron.dayOfMonth} />
                <CronBox title={'Month'} value={schedule.cron.month} />
                <CronBox title={'Day (Week)'} value={schedule.cron.dayOfWeek} />
              </div>
              <div css={tw`bg-neutral-700 rounded-b`}>
                {schedule.tasks.length > 0 ?
                  schedule.tasks.map(task => (
                    <ScheduleTaskRow key={`${schedule.id}_${task.id}`} task={task} schedule={schedule} />
                  ))
                  :
                  null
                }
              </div>
            </div>
            <EditScheduleModal visible={showEditModal} schedule={schedule} onModalDismissed={toggleEditModal} />
            <div css={tw`mt-6 flex sm:justify-end`}>
              <Can action={'schedule.delete'}>
                <DeleteScheduleButton
                  scheduleId={schedule.id}
                  onDeleted={() => history.push(`/server/${id}/schedules`)}
                />
              </Can>
              {schedule.tasks.length > 0 &&
                <Can action={'schedule.update'}>
                  <RunScheduleButton schedule={schedule} />
                </Can>
              }
            </div>
          </>
        }
      </div>
    </ServerContentBlock>
  );
};
