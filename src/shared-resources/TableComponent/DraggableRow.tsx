/* eslint-disable react/function-component-definition */
import { flexRender, Row } from '@tanstack/react-table';
import React, { CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type DraggableRowProps<T> = { row: Row<T>; disableDrag?: boolean };

function DraggableRow<T>({ row, disableDrag }: DraggableRowProps<T>) {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: row.id,
    disabled: disableDrag,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  };
  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      key={row.id}
      data-state={row.getIsSelected() ? 'selected' : ''}
      {...attributes}
      {...listeners}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          className={cn('text-center', cell.column.columnDef.cellClassName)}
          key={cell.id}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export default DraggableRow;
