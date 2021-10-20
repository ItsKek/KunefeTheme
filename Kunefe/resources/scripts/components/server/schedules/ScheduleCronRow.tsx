import React from 'react';
import tw from 'twin.macro';
import { Schedule } from '@/api/server/schedules/getServerSchedules';

interface Props {
    cron: Schedule['cron'];
    className?: string;
}

const ScheduleCronRow = ({ cron, className }: Props) => (
    <div css={tw`flex bg-neutral-910`} className={className}>
        <div css={tw`w-1/5 sm:w-auto text-center`}>
            <p css={tw`font-medium`}>{cron.minute}</p>
            <p css={tw`text-2xs text-white uppercase`}>Minute</p>
        </div>
        <div css={tw`w-1/5 sm:w-auto text-center`}>
            <p css={tw`font-medium`}>{cron.hour}</p>
            <p css={tw`text-2xs text-white uppercase`}>Hour</p>
        </div>
        <div css={tw`w-1/5 sm:w-auto text-center`}>
            <p css={tw`font-medium`}>{cron.dayOfMonth}</p>
            <p css={tw`text-2xs text-white uppercase`}>Day (Month)</p>
        </div>
        <div css={tw`w-1/5 sm:w-auto text-center`}>
            <p css={tw`font-medium`}>{cron.month}</p>
            <p css={tw`text-2xs text-white uppercase`}>Month</p>
        </div>
        <div css={tw`w-1/5 sm:w-auto text-center`}>
            <p css={tw`font-medium`}>{cron.dayOfWeek}</p>
            <p css={tw`text-2xs text-white uppercase`}>Day (Week)</p>
        </div>
    </div>
);

export default ScheduleCronRow;
