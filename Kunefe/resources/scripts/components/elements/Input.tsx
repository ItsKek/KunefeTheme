import styled, { css } from 'styled-components/macro';
import tw from 'twin.macro';

export interface Props {
    isLight?: boolean;
    hasError?: boolean;
}

const light = css<Props>`
    ${tw`bg-neutral-910 text-white`};

    &:disabled {
        ${tw`opacity-60`};
    }
`;

const checkboxStyle = css<Props>`
    ${tw`bg-neutral-500 cursor-pointer appearance-none inline-block align-middle select-none flex-shrink-0 w-4 h-4 text-primary-400 border border-neutral-300 rounded-sm`};
    color-adjust: exact;
    background-origin: border-box;
    transition: all 75ms linear, box-shadow 25ms linear;

    &:checked {
        ${tw`border-transparent bg-no-repeat bg-center`};
        background-size: 100% 100%;
    }

    &:focus {
        ${tw`outline-none border-primary-300`};
        box-shadow: 0 0 0 1px rgba(9, 103, 210, 0.25);
    }
`;

const inputStyle = css<Props>`
    // Reset to normal styling.
    resize: none;
    ${tw`appearance-none outline-none w-full min-w-0`};
    ${tw`p-3 border-0 rounded text-sm transition-all duration-150`};
    ${tw`bg-neutral-910 text-white shadow-none focus:ring-0`};

    & + .input-help {
    ${tw`mt-1 text-xs`};
    ${props => props.hasError ? tw`text-red-915` : tw`text-white`};
    }

    &:required, &:invalid {
        ${tw`shadow-none`};
    }

    &:disabled {
        ${tw`opacity-75`};
    }

    ${props => props.isLight && light};
`;

const Input = styled.input<Props>`
    &:not([type="checkbox"]):not([type="radio"]) {
        ${inputStyle};
    }

    &[type="checkbox"], &[type="radio"] {
        ${checkboxStyle};

        &[type="radio"] {
            ${tw`rounded-full`};
        }
    }
`;
const Textarea = styled.textarea<Props>`${inputStyle}`;

export { Textarea };
export default Input;
