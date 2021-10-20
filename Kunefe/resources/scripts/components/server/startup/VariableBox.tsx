import React, { memo, useState } from 'react';
import { ServerEggVariable } from '@/api/server/types';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import { usePermissions } from '@/plugins/usePermissions';
import InputSpinner from '@/components/elements/InputSpinner';
import Input from '@/components/elements/Input';
import tw from 'twin.macro';
import { debounce } from 'debounce';
import updateStartupVariable from '@/api/server/updateStartupVariable';
import useFlash from '@/plugins/useFlash';
import FlashMessageRender from '@/components/FlashMessageRender';
import getServerStartup from '@/api/swr/getServerStartup';
import isEqual from 'react-fast-compare';
import { ServerContext } from '@/state/server';

interface Props {
  variable: ServerEggVariable;
}

const VariableBox = ({ variable }: Props) => {
  const FLASH_KEY = `server:startup:${variable.envVariable}`;

  const uuid = ServerContext.useStoreState(state => state.server.data!.uuid);
  const [loading, setLoading] = useState(false);
  const [canEdit] = usePermissions(['startup.update']);
  const { clearFlashes, clearAndAddHttpError } = useFlash();
  const { mutate } = getServerStartup(uuid);

  const setVariableValue = debounce((value: string) => {
    setLoading(true);
    clearFlashes(FLASH_KEY);

    updateStartupVariable(uuid, variable.envVariable, value)
      .then(([response, invocation]) => mutate(data => ({
        ...data,
        invocation,
        variables: (data.variables || []).map(v => v.envVariable === response.envVariable ? response : v),
      }), false))
      .catch(error => {
        console.error(error);
        clearAndAddHttpError({ error, key: FLASH_KEY });
      })
      .then(() => setLoading(false));
  }, 500);

  return (
    <>
      <FlashMessageRender byKey={FLASH_KEY} css={tw`mb-2 md:mb-4`} />
      <div css={tw`mb-6`} className="infoContainer1">
        <div className="card">
          <div className="card-header">
            <h3>{variable.name}</h3>
          </div>
          <div className="card-body">
            <InputSpinner visible={loading}>
              <Input
                onKeyUp={e => {
                  if (canEdit && variable.isEditable) {
                    setVariableValue(e.currentTarget.value);
                  }
                }}
                readOnly={!canEdit || !variable.isEditable}
                name={variable.envVariable}
                defaultValue={variable.serverValue}
                placeholder={variable.defaultValue}
              />
            </InputSpinner>
            <p css="color: #8898aa !important; font-size: 80%; font-weight: 400;">
              {variable.description}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(VariableBox, isEqual);
