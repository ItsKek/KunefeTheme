import React from 'react';
import { ServerContext } from '@/state/server';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { Actions, useStoreActions } from 'easy-peasy';
import renameServer from '@/api/server/renameServer';
import Field from '@/components/elements/Field';
import { object, string } from 'yup';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import Button from '@/components/elements/Button';
import tw from 'twin.macro';

interface Values {
  name: string;
}

const RenameServerBox = () => {
  const { isSubmitting } = useFormikContext<Values>();

  return (
    <>
      <Form>
        <div className="card">
          <SpinnerOverlay visible={isSubmitting} />
          <div className="card-header">
            <span>Server Name</span>
          </div>
          <div css="height: 223px;" className="card-body">
            <div>
              <Field
                id={'name'}
                name={'name'}
                type={'text'}
              />
              <p css={tw`text-justify pt-2`} className="text-muted">The server name is only a reference to this server on the panel, and will not affect any server specific configurations that may display to users in games.</p>
            </div>
            <Button css="float: right; width: 189.05px; height: 43px;" size={'small'} color={'purple'}>
              Update Server Name
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
};

export default () => {
  const server = ServerContext.useStoreState(state => state.server.data!);
  const setServer = ServerContext.useStoreActions(actions => actions.server.setServer);
  const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

  const submit = ({ name }: Values, { setSubmitting }: FormikHelpers<Values>) => {
    clearFlashes('settings');
    renameServer(server.uuid, name)
      .then(() => setServer({ ...server, name }))
      .catch(error => {
        console.error(error);
        addError({ key: 'settings', message: httpErrorToHuman(error) });
      })
      .then(() => setSubmitting(false));
  };

  return (
    <Formik
      onSubmit={submit}
      initialValues={{
        name: server.name,
      }}
      validationSchema={object().shape({
        name: string().required().min(1),
      })}
    >
      <RenameServerBox />
    </Formik>
  );
};
