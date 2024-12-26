/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/function-component-definition */
import React from 'react';
import { TableComponentProps } from '@/components/TableComponent/types/TableComponent.types';
import TableSkeleton from './TableSkeleton';
import AmlPagination from '../AmlPagination/AmlPagination';

export default function TableComponent<T, S extends Record<string, any>>(
  props: TableComponentProps<T, S>
) {
  return (
    <>
      <TableSkeleton {...props} />
      {!props.noPagination && (
        <AmlPagination
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          onPageChange={(pageNo: number) =>
            props.setSearchFilters((p) => ({ ...p, page_no: pageNo }))
          }
          totalCount={props.totalCount}
        />
      )}
    </>
  );
}
