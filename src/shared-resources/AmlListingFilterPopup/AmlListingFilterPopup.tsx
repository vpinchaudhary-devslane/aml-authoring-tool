import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Filter } from 'lucide-react';
import React, { useMemo } from 'react';

type AmlListingFilterPopupProps = {
  searchFilters: any;
  setSearchFilters: any;
  Component: React.FC<any>;
  componentProps?: any;
};

const AmlListingFilterPopup = ({
  searchFilters,
  setSearchFilters,
  Component,
  componentProps,
}: AmlListingFilterPopupProps) => {
  const isFilterApplied = useMemo(
    () =>
      !(
        Object.keys(searchFilters).length === 1 &&
        Boolean(searchFilters.page_no)
      ),
    [searchFilters]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='relative cursor-pointer'>
          <Filter
            className={cn(
              'text-primary/50',
              isFilterApplied
                ? 'fill-primary'
                : 'fill-primary/30 hover:fill-primary/70'
            )}
          />
          {isFilterApplied && (
            <div className='absolute -top-1 -right-2 bg-primary h-4 w-4 rounded-full flex items-center justify-center text-white text-xs'>
              {Object.keys(searchFilters ?? {}).length - 1}
            </div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className='w-[600px] max-h-[95%] overflow-y-auto'
        side='bottom'
        align='start'
      >
        <Component
          searchFilters={searchFilters}
          setSearchFilters={setSearchFilters}
          {...componentProps}
        />
      </PopoverContent>
    </Popover>
  );
};

export default AmlListingFilterPopup;
