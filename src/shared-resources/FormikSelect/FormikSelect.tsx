import { ErrorMessage, useField } from 'formik';
import React from 'react';
import { cn } from '@/lib/utils';
import { Select } from '../Select/Select';

interface FormikSelectProps
  extends Omit<React.ComponentProps<typeof Select>, 'onChange' | 'value'> {
  name: string;
  label?: string;
  required?: boolean;
}

const FormikSelect: React.FC<FormikSelectProps> = (props) => {
  const { label, name, required } = props;
  const [, meta, helpers] = useField(name);

  const { value, touched, error } = meta;
  const { setValue } = helpers;

  return (
    <div
      className={cn(
        'flex flex-1 overflow-hidden flex-col gap-1 mb-2',
        Boolean(touched && error) && '[&_button]:!border-red-500'
      )}
    >
      {label && (
        <label className='font-medium text-sm text-primary' htmlFor={name}>
          {label} {required && <span className='text-red-500'>*</span>}
        </label>
      )}
      <Select value={value} onChange={(v) => setValue(v)} {...props} />
      <ErrorMessage
        className='text-red-500 mt-2 text-sm'
        name={name}
        component='p'
      />
    </div>
  );
};

export default React.memo(FormikSelect);
