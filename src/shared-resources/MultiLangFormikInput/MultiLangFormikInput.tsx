import React from 'react';
import {
  SupportedLanguages,
  SupportedLanguagesLabel,
} from '@/models/enums/SupportedLanguages.enum';
import { cn } from '@/lib/utils';
import FormikInput from '../FormikInput/FormikInput';

type Props = {
  name: string;
  label: string;
  supportedLanguages: Record<string, boolean>;
};

const MultiLangFormikInput = ({ name, label, supportedLanguages }: Props) => (
  <div className={cn('flex flex-col w-full mb-3 items-start')}>
    {Object.values(SupportedLanguages).map((lang, index) => (
      <div className='flex w-full items-center gap-3' key={lang}>
        <FormikInput
          name={`${name}.${lang}`}
          label={index === 0 ? label : undefined}
          placeholder={`${label} (${
            SupportedLanguagesLabel[
              lang as keyof typeof SupportedLanguagesLabel
            ]
          }) ${supportedLanguages[lang] ? '' : '(Optional)'}`}
          required={index === 0}
        />
      </div>
    ))}
  </div>
);

export default MultiLangFormikInput;
