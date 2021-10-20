import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import Field from '@/components/elements/Field';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Label from '@/components/elements/Label';

interface Values {
  email: string;
  password: string;
}

export default () => {
  const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
  const updateEmail = useStoreActions((state: Actions<ApplicationStore>) => state.user.updateUserEmail);

  const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

  const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required('You must provide your current account password.'),
  });

  const submit = (values: Values, { resetForm, setSubmitting }: FormikHelpers<Values>) => {
    clearFlashes('account:email');

    updateEmail({ ...values })
      .then(() => addFlash({
        type: 'success',
        key: 'account:email',
        message: 'Your primary email has been updated.',
      }))
      .catch(error => addFlash({
        type: 'error',
        key: 'account:email',
        title: 'Error',
        message: httpErrorToHuman(error),
      }))
      .then(() => {
        resetForm();
        setSubmitting(false);
      });
  };

  return (
    <Formik
      onSubmit={submit}
      initialValues={{ email: '', password: '' }}
      validationSchema={schema}
    >
      {
        ({ isSubmitting, isValid }) => (
          <React.Fragment>
            <SpinnerOverlay size={'large'} visible={isSubmitting} />
            <div className="updatePassword">
              <div className="row">
                <div className="updatePasswordCol">
                  <div className="card">
                    <div className="card-header">
                      <h3 css={tw`mb-0`}>Update Email Address</h3>
                    </div>
                    <Form css={tw`m-0`}>
                      <div className="card-body">
                        <div css={tw`mb-6`}>
                          <Label className="bigLabel">New Email Address</Label>
                          <Field
                            id={'current_email'}
                            type={'email'}
                            name={'email'}
                            css="height: 46px;"
                          />
                        </div>
                        <div css={tw`mb-6`}>
                          <Label className="bigLabel">Current Password</Label>
                          <Field
                            id={'confirm_password'}
                            type={'password'}
                            name={'password'}
                            css="height: 46px;"
                          />
                        </div>
                      </div>
                      <div className="card-footer">
                        <Button css="height: 28px;" color={'purple'} size={'xsmall'} disabled={isSubmitting || !isValid}>
                          Submit
                        </Button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      }
    </Formik>
  );
};
