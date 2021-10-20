import React, { useState } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { object, string } from 'yup';
import FormikFieldWrapper from '@/components/elements/FormikFieldWrapper';
import createApiKey from '@/api/account/createApiKey';
import { Actions, useStoreActions } from 'easy-peasy';
import { ApplicationStore } from '@/state';
import { httpErrorToHuman } from '@/api/http';
import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import { ApiKey } from '@/api/account/getApiKeys';
import tw from 'twin.macro';
import Button from '@/components/elements/Button';
import Input, { Textarea } from '@/components/elements/Input';
import Label from '@/components/elements/Label';
import styled from 'styled-components/macro';
import ApiKeyModal from '@/components/dashboard/ApiKeyModal';
import PageContentBlock from '@/components/elements/PageContentBlock';
import { useLocation, Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import FlashMessageRender from '@/components/FlashMessageRender';

interface Values {
  description: string;
  allowedIps: string;
}

const CustomTextarea = styled(Textarea)`${tw`h-32`}`;

export default ({ onKeyCreated }: { onKeyCreated: (key: ApiKey) => void }) => {
  const [apiKey, setApiKey] = useState('');
  const { addError, clearFlashes } = useStoreActions((actions: Actions<ApplicationStore>) => actions.flashes);

  const submit = (values: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
    clearFlashes('account');
    createApiKey(values.description, values.allowedIps)
      .then(({ secretToken, ...key }) => {
        resetForm();
        setSubmitting(false);
        setApiKey(`${key.identifier}${secretToken}`);
        onKeyCreated(key);
      })
      .catch(error => {
        console.error(error);

        addError({ key: 'account', message: httpErrorToHuman(error) });
        setSubmitting(false);
      });
  };

  return (
    <PageContentBlock title={'Create API Key'}>
      <>
        <div css={tw`relative mb-12`}>
          <div className="container">
          <FlashMessageRender byKey={'account'}/>
            <div>
              <div className="row" css={tw`flex justify-between items-center`}>
                <div className="dashboardHeader">
                  <div css={tw`inline-flex`}>
                    <div className="serverIcon">
                      <FontAwesomeIcon icon={faKey} />
                    </div>
                    <ul className="dashboardHeaderText">
                      <li><h1 css={tw`mb-0`}>New API Key</h1></li>
                      <li className="spacingfix1"><small>Create a new account access key.</small></li>
                    </ul>
                  </div>
                </div>
                <div className="dashboardHeader">
                  <div>
                    <ol className="breadcrumb">
                      <Link className="breadcrumb-item" to={'/'}>
                        <li className="breadcrumb-item">Home</li>
                      </Link>
                      <li className="breadcrumb-item active">Account API</li>
                      <li className="breadcrumb-item active">New API Key</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ApiKeyModal
          visible={apiKey.length > 0}
          onModalDismissed={() => setApiKey('')}
          apiKey={apiKey}
        />
        <Formik
          onSubmit={submit}
          initialValues={{ description: '', allowedIps: '' }}
          validationSchema={object().shape({
              allowedIps: string(),
              description: string().required().min(4),
          })}
        >
          {({ isSubmitting, errors, touched }) => (
            <div className="container">
              <Form>
                <div className="creatApiKeyForms">
                  <div className="card">
                    <div className="card-body">
                      <div css={tw`mb-6`}>
                        <Label className="bigLabel">Description</Label>
                        <FormikFieldWrapper
                          name={'description'}
                        >
                          <Field name={'description'} as={Input} />
                        </FormikFieldWrapper>
                      </div>
                      <p css={tw`mb-4`} className="text-muted">Set an easy to understand description for this API key to help you identify it later on.</p>
                    </div>
                  </div>
                </div>
                <div css={tw`mt-6`} className="creatApiKeyForms">
                  <div className="card">
                    <div className="card-body">
                      <div css={tw`mb-6`}>
                        <Label className="bigLabel">Allowed Connection IPs</Label>
                        <FormikFieldWrapper
                            name={'allowedIps'}
                        >
                          <Field name={'allowedIps'} as={CustomTextarea} />
                        </FormikFieldWrapper>
                      </div>
                      <p css={tw`mb-4`} className="text-muted">If you would like to limit this API key to specific IP addresses enter them above, one per line. CIDR notation is allowed for each IP address. Leave blank to allow any IP address.</p>
                    </div>
                  </div>
                  <div className="card-footer">
                    <Button css="height: 28px;" color={'start'} size={'xsmall'}>Create</Button>
                  </div>
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </>
    </PageContentBlock>
  );
};
