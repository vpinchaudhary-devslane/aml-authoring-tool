import { Table } from '@tanstack/react-table';

type TableComponentNoPaginationProps<S extends Record<string, any>> =
  | {
      noPagination?: false;
      totalCount: number;
      totalPages: number;
      currentPage: number;
      searchFilters: S & { page_no: number };
      setSearchFilters: React.Dispatch<
        React.SetStateAction<S & { page_no: number }>
      >;
    }
  | {
      noPagination: true;
      totalCount?: never;
      totalPages?: never;
      currentPage?: never;
      searchFilters: S;
      setSearchFilters: React.Dispatch<React.SetStateAction<S>>;
    };

export type TableComponentProps<T, S extends Record<string, any>> = {
  tableInstance: Table<T>;
} & TableComponentNoPaginationProps<S>;
