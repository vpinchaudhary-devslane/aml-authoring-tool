/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import { flexRender } from '@tanstack/react-table';
import { TableComponentProps } from '@/components/TableComponent/types/TableComponent.types';
import { Filter } from 'lucide-react';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Popover } from '../ui/popover';

export default function TableSkeleton<T, S extends Record<string, any>>({
  tableInstance,
  searchFilters,
  setSearchFilters,
}: TableComponentProps<T, S>) {
  const [openedPopup, setOpenedPopup] = useState<string | null>(null);

  return (
    <Table>
      <TableHeader>
        {tableInstance.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className='[&_svg]:hover:fill-primary/70'
              >
                <div className='flex'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanFilter() && (
                    <Popover
                      open={openedPopup === header.id}
                      onOpenChange={(open) =>
                        setOpenedPopup(open ? header.id : null)
                      }
                    >
                      <PopoverTrigger>
                        <Filter
                          className={cn(
                            'h-5 w-5',
                            openedPopup === header.id
                              ? 'fill-primary'
                              : 'fill-slate-400/50'
                          )}
                          strokeWidth={0}
                        />
                      </PopoverTrigger>
                      <PopoverContent>
                        {header.column.columnDef.filter?.({
                          column: header.column,
                          filterValue: searchFilters?.[header.id],
                          setFilterValue: (value) =>
                            setSearchFilters((p: any) => ({
                              ...p,
                              [header.id]: value,
                            })),
                          hideFilter: () => setOpenedPopup(null),
                        })}
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {tableInstance.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() ? 'selected' : ''}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
