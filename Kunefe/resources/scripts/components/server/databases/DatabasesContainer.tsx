import React, { useEffect, useState } from 'react';
import getServerDatabases from '@/api/server/databases/getServerDatabases';
import { ServerContext } from '@/state/server';
import { httpErrorToHuman } from '@/api/http';
import FlashMessageRender from '@/components/FlashMessageRender';
import DatabaseRow from '@/components/server/databases/DatabaseRow';
import Spinner from '@/components/elements/Spinner';
import CreateDatabaseButton from '@/components/server/databases/CreateDatabaseButton';
import Can from '@/components/elements/Can';
import useFlash from '@/plugins/useFlash';
import tw from 'twin.macro';
import Fade from '@/components/elements/Fade';
import Label from '@/components/elements/Label';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import createServerDatabase from '@/api/server/databases/createServerDatabase';
import { object, string } from 'yup';
import Modal from '@/components/elements/Modal';
import { Form, Formik, FormikHelpers } from 'formik';
import Field from '@/components/elements/Field';
import Button from '@/components/elements/Button';

interface Values {
  databaseName: string;
  connectionsFrom: string;
}

const schema = object().shape({
  databaseName: string()
    .required('A database name must be provided.')
    .min(3, 'Database name must be at least 3 characters.')
    .max(48, 'Database name must not exceed 48 characters.')
    .matches(/^[A-Za-z0-9_\-.]{3,48}$/, 'Database name should only contain alphanumeric characters, underscores, dashes, and/or periods.'),
  connectionsFrom: string()
    .required('A connection value must be provided.')
    .matches(/^([0-9]{1,3}|%)(\.([0-9]{1,3}|%))?(\.([0-9]{1,3}|%))?(\.([0-9]{1,3}|%))?$/, 'A valid connection address must be provided.'),
});

export default () => {
  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const databaseLimit = ServerContext.useStoreState(state => state.server.data!.featureLimits.databases);
  const { addError, clearFlashes } = useFlash();
  const [visible, setVisible] = useState(false);

  const appendDatabase = ServerContext.useStoreActions(actions => actions.databases.appendDatabase);

  const submit = (values: Values, { setSubmitting }: FormikHelpers<Values>) => {
    clearFlashes('database:create');
    createServerDatabase(uuid, { ...values })
      .then(database => {
        appendDatabase(database);
        setVisible(false);
      })
      .catch(error => {
        addError({ key: 'database:create', message: httpErrorToHuman(error) });
        setSubmitting(false);
      });
  };

  const [loading, setLoading] = useState(true);

  const databases = useDeepMemoize(ServerContext.useStoreState(state => state.databases.data));
  const setDatabases = ServerContext.useStoreActions(state => state.databases.setDatabases);
  const name = ServerContext.useStoreState(state => state.server.data!.name);
  const id = ServerContext.useStoreState(state => state.server.data!.id);

  useEffect(() => {
    setLoading(!databases.length);
    clearFlashes('databases');

    getServerDatabases(uuid)
      .then(databases => setDatabases(databases))
      .catch(error => {
        console.error(error);
        addError({ key: 'databases', message: httpErrorToHuman(error) });
      })
      .then(() => setLoading(false));
  }, []);

  return (
    <ServerContentBlock title={'Databases'}>
      <div css={tw`relative mb-12`}>
        <div className="container">
          <div>
            <div className="row" css={tw`flex justify-between items-center`}>
              <div className="dashboardHeader">
                <div css={tw`inline-flex`}>
                  <div className="serverIcon">
                    <FontAwesomeIcon icon={faDatabase} />
                  </div>
                  <ul className="dashboardHeaderText">
                    <li><h1 css={tw`mb-0`}>Databases</h1></li>
                    <li className="spacingfix1"><small>All databases available for this server.</small></li>
                  </ul>
                </div>
              </div>
              <div className="dashboardHeader">
                <div>
                  <ol className="breadcrumb">
                    <Link className="breadcrumb-item" to={`/server/${id}`}>
                      <li className="breadcrumb-item">{(name).charAt(0).toUpperCase() + (name).slice(1)}</li>
                    </Link>
                    <li className="breadcrumb-item active">Databases</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <FlashMessageRender byKey={'databases'} css={tw`mb-4`} />
        {(!databases.length && loading) ?
          <Spinner size={'large'} centered />
          :
          <Fade timeout={150}>
            <>
              <div className="row">
                <div className="flexGrow" />
              </div>
              <div className="row">
                <div css={tw`mb-6`} className="DatabasesContainer">
                  <div className="card">
                    <div className="card-header">
                      <h3>Configured Databases</h3>
                    </div>
                    {databases.length > 0 ?
                      <div className="padding-none card-body table-responsive">
                        <table className="table table-hover">
                          <tbody css={tw`w-full`}>
                            <tr css={tw`w-full`}>
                              <th css="font-weight: 600;">Database</th>
                              <th css="font-weight: 600;">Username</th>
                              <th css="font-weight: 600;">Password</th>
                              <th css="font-weight: 600;">MySQL Host</th>
                              <td></td>
                            </tr>
                            {databases.length > 0 &&
                              databases.map((database, index) => (
                                <DatabaseRow
                                  key={database.id}
                                  database={database}
                                />
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                      :
                      <div className="card-body">
                        <div className="marginBottom-none alert alert-info">
                          There are no databases listed for this server.
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className="DatabasesContainer">
                  <div className="card">
                    <div className="card-header">
                      <h3>Create New Database</h3>
                    </div>
                    <div className="card-body">
                      {databaseLimit > 0 ?
                        databaseLimit > 0 && databaseLimit !== databases.length &&
                        <Can action={'database.create'}>
                          <Formik
                            onSubmit={submit}
                            initialValues={{ databaseName: '', connectionsFrom: '%' }}
                            validationSchema={schema}
                          >
                            {
                              ({ isSubmitting, resetForm }) => (
                                <>
                                  <FlashMessageRender byKey={'database:create'} css={tw`mb-6`} />
                                  <Form css={tw`m-0`}>
                                    <div css={tw`mb-6`}>
                                      <Label className="bigLabel">Database Name</Label>
                                      <Field
                                        type={'string'}
                                        id={'database_name'}
                                        name={'databaseName'}
                                        placeholder={'s1_'}
                                      />
                                    </div>
                                    <div css={tw`mb-6`}>
                                      <Label className="bigLabel">Connections From</Label>
                                      <Field
                                        type={'string'}
                                        id={'connections_from'}
                                        name={'connectionsFrom'}
                                      />
                                    </div>
                                    <p className="alert bg-info">
                                      This should reflect the IP address that connections are allowed from. Uses standard MySQL notation. If unsure leave as
                                      <code> %</code>
                                      .
                                    </p>
                                    <p className="alert bg-info">
                                      You are currently using
                                      <strong> {databases.length} </strong>
                                      of
                                      <strong> {databaseLimit} </strong>
                                      databases. A username and password for this database will be randomly generated after form submission.
                                    </p>
                                    <Button css="height: 43px; float: right;" color={'start'} type={'submit'}>
                                      Create New Database
                                    </Button>
                                  </Form>
                                </>
                              )
                            }
                          </Formik>
                        </Can>
                        :
                        <div className="alert alert-danger">
                          Number of databases allowed to use:
                          <strong> 0 </strong>
                          /
                          <strong> 0</strong>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          </Fade>
        }
      </div>
    </ServerContentBlock>
  );
};
