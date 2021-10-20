import styled from 'styled-components/macro';
import tw, { theme } from 'twin.macro';

const SubNavigation = styled.div`
    ${tw`flex w-full bg-neutral-905 overflow-x-auto`};
    height: 51px;

    & > div {
        ${tw`flex items-center mx-auto px-2`};

        & > a, & > div {
            ${tw`inline-block no-underline whitespace-nowrap transition-all duration-150`};
              color: #929fc1;
              font-weight: 600;
              font-size: 13px;
              padding: 0.25rem 0.75rem;
              height: 27px

            &:hover {
                ${tw`text-white`};
            }

            &:active, &.active {
                ${tw`text-white`};
            }
        }
    }
`;

export default SubNavigation;
