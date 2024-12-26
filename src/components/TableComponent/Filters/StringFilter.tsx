/* eslint-disable react/function-component-definition */
import { Input } from '@/components/ui/input';
import { ColumnDef, RowData } from '@tanstack/react-table';
import React from 'react';

export default function stringFilter<TData extends RowData, TValue>(
  props: ColumnDef<TData, TValue>['filter']
) {
  return (
    <div className='flex gap-2 items-center bg-white px-3 py-2'>
      <Input placeholder='Search' />
    </div>
  );
}
