import { RowData } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface ColumnDefBase<TData extends RowData, TValue = unknown> {
    filter?: (props: {
      filterValue: any;
      setFilterValue: (value: any) => void;
      hideFilter?: () => void;
    }) => JSX.Element;
  }
}
