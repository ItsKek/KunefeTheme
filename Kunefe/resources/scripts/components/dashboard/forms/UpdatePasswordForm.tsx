import React from 'react';
import { Actions, State, useStoreActions, useStoreState } from 'easy-peasy';
import { Form, Formik, FormikHelpers, ErrorMessage } from 'formik';
import Field from '@/components/elements/Field';
import * as Yup from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import updateAccountPassword from '@/api/account/updateAccountPassword';
import { httpErrorToHuman } from '@/api/http';
import { ApplicationStore } from '@/state';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Label from '@/components/elements/Label';

interface Values {
  current: string;
  password: string;
  confirmPassword: string;
}

export default () => {
  const user = useStoreState((state: State<ApplicationStore>) => state.user.data);
  const { clearFlashes, addFlash } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

  if (!user) {
    return null;
  }

  const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    clearFlashes('account:password');
    updateAccountPassword({ ...values })
      .then(() => {
        // @ts-ignore
        window.location = '/auth/login';
      })
      .catch(error => addFlash({
        key: 'account:password',
        type: 'error',
        title: 'Error',
        message: httpErrorToHuman(error),
      }))
      .then(() => setSubmitting(false));
  };

  const schema = Yup.object().shape({
    current: Yup.string().min(1).required('You must provide your current password.'),
    password: Yup.string().min(8).required(),
    confirmPassword: Yup.string().test('password', 'Password confirmation does not match the password you entered.', function (value) {
        return value === this.parent.password;
    }),
});

  return (
    <React.Fragment>
      <Formik
        onSubmit={submit}
        initialValues={{ current: '', password: '', confirmPassword: '' }}
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
                        <h3 css={tw`mb-0`}>Update Password</h3>
                      </div>
                      <Form css={tw`m-0`}>
                        <div className="card-body">
                          <div css={tw`mb-6`}>
                            <Label className="bigLabel">Current Password</Label>
                            <Field
                              id={'current_password'}
                              type={'password'}
                              name={'current'}
                              css="height: 46px;"
                            />
                          </div>
                          <div css={tw`mb-6`}>
                            <Label className="bigLabel">New Password</Label>
                            <Field
                              id={'new_password'}
                              type={'password'}
                              name={'password'}
                              css="height: 46px;"
                            />
                            <p css="font-size: 80%; font-weight: 400; color: #8898aa; margin-bottom: 1rem; line-height: 1.7;">Passwords must contain at least one uppercase, lowercase, and numeric character and must be at least 8 characters in length.</p>
                          </div>
                          <div css={tw`mb-6`}>
                            <Label className="bigLabel">Repeat New Password</Label>
                            <Field
                              id={'confirm_new_password'}
                              type={'password'}
                              name={'confirmPassword'}
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
    </React.Fragment>
  );
};
