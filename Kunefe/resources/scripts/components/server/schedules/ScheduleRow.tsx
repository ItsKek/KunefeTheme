import React from 'react';
import { Schedule, Task } from '@/api/server/schedules/getServerSchedules';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { format } from 'date-fns';
import tw from 'twin.macro';
import ScheduleCronRow from '@/components/server/schedules/ScheduleCronRow';

export default ({ schedule }: { schedule: Schedule }) => (
    <>
      <th css="font-weight: 400;">{schedule.name}</th>
      <th css="font-weight: 400;">{schedule.isActive ? 'Active' : 'Inactive'}</th>
      <th css="font-weight: 400;">{schedule.lastRunAt ? format(schedule.lastRunAt, 'MMM do \'at\' h:mma') : 'Never'}</th>
      <th css="font-weight: 400;">{schedule.nextRunAt ? format(schedule.nextRunAt, 'MMM do \'at\' h:mma') : 'Never'}</th>
    </>
);
