import React from 'react';
import MessageBox from '@/components/MessageBox';
import { useStoreState } from 'easy-peasy';
import styled, { keyframes } from 'styled-components/macro';
import Fade from '@/components/elements/Fade';
import tw from 'twin.macro';

const fade = keyframes`
    from { opacity: 0 }
    to { opacity: 1 }
`;

const Toast = styled.div`
    ${tw`fixed z-50 bottom-0 left-0 mb-4 w-full flex justify-end pr-4`};
    animation: ${fade} 250ms linear;

    & > div {
        ${tw`rounded px-4 py-2 text-white border border-neutral-910 bg-red-915`};
    }
`;

type Props = Readonly<{
  byKey?: string;
  className?: string;
}>;

const FlashMessageRender = ({ byKey, className }: Props) => {
  const flashes = useStoreState(state => state.flashes.items.filter(
    flash => byKey ? flash.key === byKey : true,
  ));

  return (
    flashes.length ?
      <div className={className}>
        {
          flashes.map((flash, index) => (
            <React.Fragment key={flash.id || flash.type + flash.message}>
              {index > 0 && <div css={tw`mt-2`}></div>}
              <Toast>
                <div>
                  {flash.message}
                </div>
              </Toast>
            </React.Fragment>
          ))
        }
      </div>
      :
      null
  );
};

export default FlashMessageRender;
