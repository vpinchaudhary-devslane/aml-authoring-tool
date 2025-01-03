/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { getSelectionColumn, useTable } from '@/hooks/useTable';
import { tableStringFilter } from '@/shared-resources/TableComponent/Filters/StringFilter';
import TableComponent from '@/shared-resources/TableComponent/TableComponent';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import AmlAvatar from './AmlAvatar/AmlAvatar';
import AmlDialog from './AmlDialog/AmlDialog';
import AmlMenu from './AmlMenu/AmlMenu';
import AmlTooltip from './AmlTooltip/AmlTooltip';

type Fruit = {
  identifier: string;
  name: string;
  price: number;
  unit: string;
};

const DemoComps = () => {
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    page_no: 1,
    orderBy: null,
    sortOrder: null,
  });
  const [selectedRows, setSelectedRows] = React.useState<RowSelectionState>({});
  const columns: ColumnDef<Fruit>[] = useMemo(
    () => [
      getSelectionColumn(),
      {
        accessorKey: 'name',
        header: 'Name',
        filter: tableStringFilter,
      },
      {
        accessorKey: 'price',
        header: 'Price',
        enableColumnFilter: false,
      },
      {
        accessorKey: 'unit',
        header: 'Unit',
        cell: (info) =>
          info.getValue() === 'PP' ? 'Per Piece' : 'Per Kilogram',
        enableColumnFilter: false,
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
        unit: 'KG',
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

  const [openDialog, setOpenDialog] = React.useState(false);

  return (
    <div className='bg-white flex flex-col w-full min-h-screen'>
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
      <div className='flex flex-col p-3'>
        <span>Avatar</span>
        <AmlAvatar src='https://github.com/shadcn.png' alt='CN' />
      </div>
      <div className='flex flex-col p-3'>
        <button onClick={() => setOpenDialog(true)}>Dialog</button>
        <AmlDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          title='Are you absolutely sure?'
          description='This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
          primaryButtonText='Yes'
          secondaryButtonText='No'
          onPrimaryButtonClick={() => setOpenDialog(false)}
          onSecondaryButtonClick={() => setOpenDialog(false)}
        />
      </div>
      <div className='flex flex-col p-3'>
        <span>Menu</span>
        <AmlMenu
          trigger='Open'
          label='My Account'
          menuItems={[
            {
              label: 'Profile',
              onClick: () => {},
            },
          ]}
        />
      </div>
      <div className='flex flex-col p-3'>
        <span>Radio Group</span>
        <RadioGroup defaultValue='option-one'>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='option-one' id='option-one' />
            <label htmlFor='option-one'>Option One</label>
          </div>
          <div className='flex items-center space-x-2'>
            <RadioGroupItem value='option-two' id='option-two' />
            <label htmlFor='option-two'>Option Two</label>
          </div>
        </RadioGroup>
      </div>
      <div className='flex flex-col p-3'>
        <span>Switch</span>
        <Switch />
      </div>
      <div className='flex flex-col p-3'>
        <AmlTooltip tooltip='Tooltip text'>Tooltip</AmlTooltip>
      </div>
      <div className='flex flex-col flex-1 p-3'>
        <span>Table</span>
        <TableComponent
          tableInstance={tableInstance}
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          totalCount={100}
        />
      </div>
    </div>
  );
};

export default DemoComps;
