import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faEye, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/elements/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import { object, string } from 'yup';
import FlashMessageRender from '@/components/FlashMessageRender';
import { ServerContext } from '@/state/server';
import deleteServerDatabase from '@/api/server/databases/deleteServerDatabase';
import { httpErrorToHuman } from '@/api/http';
import RotatePasswordButton from '@/components/server/databases/RotatePasswordButton';
import Can from '@/components/elements/Can';
import { ServerDatabase } from '@/api/server/databases/getServerDatabases';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Label from '@/components/elements/Label';
import Input from '@/components/elements/Input';
import GreyRowBox from '@/components/elements/GreyRowBox';
import CopyOnClick from '@/components/elements/CopyOnClick';

interface Props {
  database: ServerDatabase;
  className?: string;
}

export default ({ database, className }: Props) => {
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const { addError, clearFlashes } = useFlash();
  const [visible, setVisible] = useState(false);
  const [connectionVisible, setConnectionVisible] = useState(false);

  const appendDatabase = ServerContext.useStoreActions(actions => actions.databases.appendDatabase);
  const removeDatabase = ServerContext.useStoreActions(actions => actions.databases.removeDatabase);

  const schema = object().shape({
    confirm: string()
      .required('The database name must be provided.')
      .oneOf([database.name.split('_', 2)[1], database.name], 'The database name must be provided.'),
  });

  const submit = (values: { confirm: string }, { setSubmitting }: FormikHelpers<{ confirm: string }>) => {
    clearFlashes();
    deleteServerDatabase(uuid, database.id)
      .then(() => {
        setVisible(false);
        setTimeout(() => removeDatabase(database.id), 150);
      })
      .catch(error => {
        console.error(error);
        setSubmitting(false);
        addError({ key: 'database:delete', message: httpErrorToHuman(error) });
      });
  };

  return (
    <>
      <Formik
        onSubmit={submit}
        initialValues={{ confirm: '' }}
        validationSchema={schema}
        isInitialValid={false}
      >
        {
          ({ isSubmitting, isValid, resetForm }) => (
            <Modal
              visible={visible}
              dismissable={!isSubmitting}
              showSpinnerOverlay={isSubmitting}
              onDismissed={() => {
                setVisible(false);
                resetForm();
              }}
            >
              <FlashMessageRender byKey={'database:delete'} css={tw`mb-6`} />
              <h2 css={tw`text-2xl mb-6`}>Confirm database deletion</h2>
              <p css={tw`text-sm`}>
                Deleting a database is a permanent action, it cannot be undone. This will permanetly
                delete the <strong>{database.name}</strong> database and remove all associated data.
                </p>
              <Form css={tw`m-0 mt-6`}>
                <Field
                  type={'text'}
                  id={'confirm_name'}
                  name={'confirm'}
                  label={'Confirm Database Name'}
                  description={'Enter the database name to confirm deletion.'}
                />
                <div css={tw`mt-6 text-right`}>
                  <Button
                    type={'button'}
                    color={'purple'}
                    css={tw`mr-2`}
                    onClick={() => setVisible(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type={'submit'}
                    color={'purple'}
                    disabled={!isValid}
                  >
                    Delete Database
                  </Button>
                </div>
              </Form>
            </Modal>
          )
        }
      </Formik>
      <Modal visible={connectionVisible} onDismissed={() => setConnectionVisible(false)}>
        <FlashMessageRender byKey={'database-connection-modal'} css={tw`mb-6`} />
        <h3 css={tw`mb-6 text-2xl`}>Database connection details</h3>
        <div>
          <Label>Endpoint</Label>
          <CopyOnClick text={database.connectionString}><Input type={'text'} readOnly value={database.connectionString} /></CopyOnClick>
        </div>
        <div css={tw`mt-6`}>
          <Label>Connections from</Label>
          <Input type={'text'} readOnly value={database.allowConnectionsFrom} />
        </div>
        <div css={tw`mt-6`}>
          <Label>Username</Label>
          <CopyOnClick text={database.username}><Input type={'text'} readOnly value={database.username} /></CopyOnClick>
        </div>
        <Can action={'database.view_password'}>
          <div css={tw`mt-6`}>
            <Label>Password</Label>
            <CopyOnClick text={database.password}><Input type={'text'} readOnly value={database.password} /></CopyOnClick>
          </div>
        </Can>
        <div css={tw`mt-6`}>
          <Label>JDBC Connection String</Label>
          <CopyOnClick text={`jdbc:mysql://${database.username}:${database.password}@${database.connectionString}/${database.name}`}>
            <Input
              type={'text'}
              readOnly
              value={`jdbc:mysql://${database.username}:${database.password}@${database.connectionString}/${database.name}`}
            />
          </CopyOnClick>
        </div>
      </Modal>
      <tr className={className}>
        <td>
          {database.name}
        </td>
        <td>
          {database.username}
        </td>
        <td>
          <code>{database.password}</code>
        </td>
        <td>
          <code>{database.connectionString}</code>
        </td>
        <Can action={'database.update'}>
          <td css={tw`text-right`}>
            <RotatePasswordButton databaseId={database.id} onUpdate={appendDatabase} />
            <Button className="transparentButton" onClick={() => setVisible(true)} size={'xsmall'} color={'purple'}>
              <span><FontAwesomeIcon icon={faTrashAlt} /></span>
            </Button>
          </td>
        </Can>
      </tr>
    </>
  );
};
