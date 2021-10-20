import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { parse } from 'query-string';
import { Link } from 'react-router-dom';
import performPasswordReset from '@/api/auth/performPasswordReset';
import { httpErrorToHuman } from '@/api/http';
import LoginFormContainer from '@/components/auth/LoginFormContainer';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { Formik, FormikHelpers } from 'formik';
import { object, ref, string } from 'yup';
import Field from '@/components/elements/Field';
import Input from '@/components/elements/Input';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';

interface Values {
    password: string;
    passwordConfirmation: string;
}

export default ({ match, location }: RouteComponentProps<{ token: string }>) => {
    const [ email, setEmail ] = useState('');

    const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

    const parsed = parse(location.search);
    if (email.length === 0 && parsed.email) {
        setEmail(parsed.email as string);
    }

    const submit = ({ password, passwordConfirmation }: Values, { setSubmitting }: FormikHelpers<Values>) => {
        clearFlashes();
        performPasswordReset(email, { token: match.params.token, password, passwordConfirmation })
            .then(() => {
                // @ts-ignore
                window.location = '/';
            })
            .catch(error => {
                console.error(error);

                setSubmitting(false);
                addFlash({ type: 'error', title: 'Error', message: httpErrorToHuman(error) });
            });
    };

    return (
        <Formik
            onSubmit={submit}
            initialValues={{
                password: '',
                passwordConfirmation: '',
            }}
        >
            {({ isSubmitting }) => (
                <LoginFormContainer
                    title={'Reset Password'}
                    css={tw`w-full flex`}
                >
                        <Field
                            placeholder={'New Password'}
                            name={'password'}
                            className="h57"
                            type={'password'}
                            description={'Passwords must be at least 8 characters in length.'}
                        />
                        <Field
                            placeholder={'Confirm New Password'}
                            className="h57"
                            name={'passwordConfirmation'}
                            type={'password'}
                        />
                    <div css={tw`mt-6`}>
                        <Button
                            size={'small'}
                            type={'submit'}
                            color={'purple'}
                            css={tw`block w-full`}
                            disabled={isSubmitting}
                            isLoading={isSubmitting}
                        >
                            Reset Password
                        </Button>
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
            )}
        </Formik>
    );
};
