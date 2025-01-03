import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';

type AmlMenuProps = {
  trigger: React.ReactNode;
  label?: string;
  menuItems?: {
    label: string;
    onClick: () => void;
  }[];
};

const AmlMenu = ({ trigger, label, menuItems }: AmlMenuProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
    <DropdownMenuContent>
      {label && (
        <>
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          <DropdownMenuSeparator />
        </>
      )}
      {menuItems?.map((item) => (
        <DropdownMenuItem key={item.label} onClick={item.onClick}>
          {item.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default AmlMenu;
