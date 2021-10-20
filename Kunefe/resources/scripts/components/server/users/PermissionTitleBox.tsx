import React, { memo, useCallback } from 'react';
import { useField } from 'formik';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import tw from 'twin.macro';
import Input from '@/components/elements/Input';
import isEqual from 'react-fast-compare';

interface Props {
  isEditable: boolean;
  title: string;
  permissions: string[];
  className?: string;
}

const PermissionTitleBox: React.FC<Props> = memo(({ isEditable, title, permissions, className, children }) => {
  const [{ value }, , { setValue }] = useField<string[]>('permissions');

  const onCheckboxClicked = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      setValue([
        ...value,
        ...permissions.filter(p => !value.includes(p)),
      ]);
    } else {
      setValue(value.filter(p => !permissions.includes(p)));
    }
  }, [permissions, value]);

  return (
    <div css={tw`mb-4`} className="card">
      <div css="background: var(--other) !important;" className="card-header">
        <div className="row">
          <div className="userHeader">
            <h3>{(title).charAt(0).toUpperCase() + (title).slice(1)}</h3>
          </div>
          <div css={tw`text-right float-right`} className="userHeader">
            {isEditable &&
              <Input
                type={'checkbox'}
                checked={permissions.every(p => value.includes(p))}
                onChange={onCheckboxClicked}
              />
            }
          </div>
        </div>
      </div>
      <div css="background: var(--other)" className="card-body">
        {children}
      </div>
    </div>
  );
}, isEqual);

export default PermissionTitleBox;
