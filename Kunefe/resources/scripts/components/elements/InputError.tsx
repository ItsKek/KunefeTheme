import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';
import tw from 'twin.macro';
import { capitalize } from '@/helpers';
import styled, { keyframes } from 'styled-components/macro';
import Fade from '@/components/elements/Fade';

interface Props {
  errors: FormikErrors<any>;
  touched: FormikTouched<any>;
  name: string;
  children?: string | number | null | undefined;
}

const InputError = ({ errors, touched, name, children }: Props) => (
    touched[name] && errors[name] ?
        <p className="marginBottom-none" css={tw`text-xs text-red-915 pt-2`}>
            {typeof errors[name] === 'string' ?
                capitalize(errors[name] as string)
                :
                capitalize((errors[name] as unknown as string[])[0])
            }
        </p>
        :
        <>
            {children ? <p className="marginBottom-none" css={tw`text-xs text-white pt-2`}>{children}</p> : null}
        </>
);

export default InputError;
