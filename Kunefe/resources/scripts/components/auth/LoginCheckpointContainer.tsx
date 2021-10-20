import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import loginCheckpoint from '@/api/auth/loginCheckpoint';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { ActionCreator } from 'easy-peasy';
import { StaticContext } from 'react-router';
import { useFormikContext, withFormik } from 'formik';
import useFlash from '@/plugins/useFlash';
import { FlashStore } from '@/state/flashes';
import Field from '@/components/elements/Field';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    code: string;
    recoveryCode: '',
}

type OwnProps = RouteComponentProps<Record<string, string | undefined>, StaticContext, { token?: string }>

type Props = OwnProps & {
    clearAndAddHttpError: ActionCreator<FlashStore['clearAndAddHttpError']['payload']>;
}

const LoginCheckpointContainer = () => {
    const { isSubmitting, setFieldValue } = useFormikContext<Values>();
    const [ isMissingDevice, setIsMissingDevice ] = useState(false);

    return (
        <LoginFormContainer title={'Device Checkpoint'} css={tw`w-full flex`}>
                <Field
                    name={isMissingDevice ? 'recoveryCode' : 'code'}
                    placeholder={isMissingDevice ? 'Recovery Code' : 'Authentication Code'}
                    className="h57"
                    type={'text'}
                />
            <div css={tw`mt-6`}>
                <Button
                    size={'small'}
                    color={'purple'}
                    css={tw`block w-full`}
                    type={'submit'}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                >
                    Continue
                </Button>
            </div>
            <div css={tw`mt-6 text-center`}>
                <span
                    onClick={() => {
                        setFieldValue('code', '');
                        setFieldValue('recoveryCode', '');
                        setIsMissingDevice(s => !s);
                    }}
                    css={tw`cursor-pointer text-base text-white text-center opacity-75 hover:opacity-100`}
                >
                    {!isMissingDevice ? 'I\'ve Lost My Device' : 'I Have My Device'}
                </span>
            </div>
            <div css={tw`mt-6 text-center`}>
                <Link
                    to={'/auth/login'}
                    css={tw`text-base text-white text-center opacity-75 hover:opacity-100`}
                >
                    Return to Login
                </Link>
            </div>
        </LoginFormContainer>
    );
};

const EnhancedForm = withFormik<Props, Values>({
    handleSubmit: ({ code, recoveryCode }, { setSubmitting, props: { clearAndAddHttpError, location } }) => {
        loginCheckpoint(location.state?.token || '', code, recoveryCode)
            .then(response => {
                if (response.complete) {
                    // @ts-ignore
                    window.location = response.intended || '/';
                    return;
                }

                setSubmitting(false);
            })
            .catch(error => {
                console.error(error);
                setSubmitting(false);
                clearAndAddHttpError({ error });
            });
    },

    mapPropsToValues: () => ({
        code: '',
        recoveryCode: '',
    }),
})(LoginCheckpointContainer);

export default ({ history, location, ...props }: OwnProps) => {
    const { clearAndAddHttpError } = useFlash();

    if (!location.state?.token) {
        history.replace('/auth/login');

        return null;
    }

    return <EnhancedForm
        clearAndAddHttpError={clearAndAddHttpError}
        history={history}
        location={location}
        {...props}
    />;
};
