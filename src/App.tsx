import React, { ReactNode, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import store from '@/store';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import TableComponent from './components/TableComponent/TableComponent';
import { getSelectionColumn, useTable } from './hooks/useTable';
import StringFilter from './components/TableComponent/Filters/StringFilter';
import stringFilter from './components/TableComponent/Filters/StringFilter';

type Fruit = {
  identifier: string;
  name: string;
  price: number;
  unit: string;
};

const App: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<{}>({});
  const [selectedRows, setSelectedRows] = React.useState<RowSelectionState>({});
  const columns: ColumnDef<Fruit>[] = useMemo(
    () => [
      getSelectionColumn(),
      {
        accessorKey: 'name',
        header: 'Name',
        filter: stringFilter,
      },
      {
        accessorKey: 'price',
        header: 'Price',
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
        cell: (info) =>
          info.getValue() === 'PP' ? 'Per Piece' : 'Per Kilogram',
      },
    ],
    []
  );

  const rows = useMemo(
    () => [
      {
        identifier: '1',
        name: 'Apple',
        price: 100,
        unit: 'PP',
      },
      {
        identifier: '2',
        name: 'Orange',
        price: 200,
        unit: 'PP',
      },
      {
        identifier: '3',
        name: 'Banana',
        price: 300,
        unit: 'PP',
      },
    ],
    []
  );

  const tableInstance = useTable({
    columns,
    rows,
    enableRowSelection: true,
    selectedRows,
    setSelectedRows,
  });

  return (
    <Provider store={store}>
      <div className='flex gap-6 items-center p-3'>
        <span>Buttons</span>
        <Button>Submit</Button>
        <Button disabled size='sm'>
          Disabled
        </Button>
        <Button variant='destructive' size='lg'>
          Delete
        </Button>
        <Button variant='outline'>Button</Button>
      </div>
      <div className='flex gap-6 items-center p-3'>
        <span>Input</span>
        <Input placeholder='Input' />
        <Input placeholder='Input' disabled />
        <Input placeholder='Input' hasError />
      </div>
      <div>
        <span>Table</span>
        <TableComponent
          noPagination
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={() => {}}
        />
      </div>
    </Provider>
  );
};

export default App;
