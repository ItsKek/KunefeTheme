import React, { useContext, useState } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import FlashMessageRender from '@/components/FlashMessageRender';
import Field from '@/components/elements/Field';
import { object, string } from 'yup';
import { Actions, useStoreActions, useStoreState } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import disableAccountTwoFactor from '@/api/account/disableAccountTwoFactor';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Label from '@/components/elements/Label';
import asModal from '@/hoc/asModal';
import ModalContext from '@/context/ModalContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

interface Values {
  password: string;
}

const DisableTwoFactorForm = () => {
  const { dismiss, setPropOverrides } = useContext(ModalContext);
  const { clearAndAddHttpError } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);
  const updateUserData = useStoreActions((actions: Actions<ApplicationStore>) => actions.user.updateUserData);
  const [visible, setVisible] = useState(false);
  const isEnabled = useStoreState((state: ApplicationStore) => state.user.data!.useTotp);

  const submit = ({ password }: Values, { setSubmitting }: FormikHelpers<Values>) => {
    setPropOverrides({ showSpinnerOverlay: true, dismissable: false });
    disableAccountTwoFactor(password)
      .then(() => {
        updateUserData({ useTotp: false });
        dismiss();
      })
      .catch(error => {
        console.error(error);

        clearAndAddHttpError({ error, key: 'account:two-factor' });
        setSubmitting(false);
        setPropOverrides(null);
      });
  };

  return (
    <div className="setup2fa">
      <div className="row">
        <div className="updatePasswordCol">
          <div className="card">
            <div className="card-header">
              {isEnabled ?
                <h3 css={tw`mb-0`}><FontAwesomeIcon css="margin-right: .4rem; color: #2dce89;" icon={faCircle} fixedWidth />2-Factor Authentication</h3>
                :
                <h3 css={tw`mb-0`}><FontAwesomeIcon css="margin-right: .4rem; color: #f5365c;" icon={faCircle} fixedWidth />2-Factor Authentication</h3>
              }
            </div>
            <Formik
              onSubmit={submit}
              initialValues={{
                password: '',
              }}
              validationSchema={object().shape({
                password: string().required('You must provide your current password in order to continue.'),
              })}
            >
              {({ isValid }) => (
                <Form className={'mb-0'}>
                  <FlashMessageRender css={tw`mb-6`} byKey={'account:two-factor'} />
                  <div className="card-body">
                    <p>
                      2-Factor Authentication is enabled on this account and will be required in order to login to the panel. If you would like to disable 2FA, simply enter a valid token below and submit the form.
                    </p>
                    <div css={tw`mb-10`}>
                      <Label className="bigLabel">Current Password</Label>
                      <Field
                        id={'password'}
                        name={'password'}
                        type={'password'}
                      />
                    </div>
                  </div>
                  <div className="card-footer">
                    <Button color={'stop'} size={'xsmall'} css="height: 28px;" disabled={!isValid}>
                      Disable 2-Factor Authentication
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisableTwoFactorForm;
