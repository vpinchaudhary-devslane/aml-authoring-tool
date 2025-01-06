import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { cn, debounce } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDispatch } from 'react-redux';
import { PaginationLimit } from '@/enums/tableEnums';

type InfiniteSelectProps<T> = {
  onChange: (value: T) => void;
  value: T;
  renderValue?: (value: T) => React.ReactNode;
  placeholder?: string;
  data: any[];
  multiple?: boolean;
  dispatchAction: (data: { value: string; page_no: number }) => {
    type: string;
    payload: any;
  };
  labelKey: string;
  valueKey: string;
  isLoading: boolean;
  totalCount: number;
};

export const InfiniteSelect = <
  T extends string | number | (string | number)[]
>({
  onChange,
  value,
  renderValue,
  placeholder,
  data,
  multiple,
  dispatchAction,
  labelKey,
  valueKey,
  isLoading,
  totalCount,
}: InfiniteSelectProps<T>) => {
  const [open, setOpen] = React.useState(false);
  const [searchFilters, setSearchFilters] = React.useState({
    value: '',
    page_no: 1,
  });
  const [searchValue, setSearchValue] = React.useState('');
  const [options, setOptions] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (data.length) {
      const newDataArray = structuredClone(options);
      newDataArray.push(...data);
      setOptions(newDataArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const nextPageRef = React.useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();

  const selectRef = React.useRef<HTMLButtonElement>(null);
  const totalPages = Math.ceil(totalCount / PaginationLimit.PAGE_SIZE);

  React.useEffect(() => {
    if (open && !isLoading) {
      dispatch(dispatchAction(searchFilters));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, searchFilters, isLoading]);

  React.useEffect(() => {
    if (!open || searchFilters.page_no === totalPages) return;

    const element = nextPageRef.current;
    if (!element) return;

    const handleNextPage = () => {
      if (
        Math.ceil(element.scrollTop + element.offsetHeight) >=
        element.scrollHeight
      ) {
        setSearchFilters((prev) => ({
          ...prev,
          page_no: searchFilters.page_no + 1,
        }));
      }
    };

    element.addEventListener('scroll', handleNextPage);

    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener('scroll', handleNextPage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, options]);

  const handleSetValue = (val: string | number) => {
    if (!multiple) {
      onChange(val as T);
      setOpen(false);
      return;
    }

    if (!Array.isArray(value)) return;

    if (value.includes(val)) {
      onChange(value.filter((item) => item !== val) as T);
    } else {
      onChange([...value, val] as T);
    }
  };

  const checkValue = (val: string | number) => {
    if (Array.isArray(value)) {
      return value.includes(val);
    }

    return value === val;
  };
  const handleDebouncedSearch = React.useMemo(
    () =>
      debounce((e: string) => {
        setSearchFilters({ value: e, page_no: 1 });
      }, 300),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions([]);
    setSearchValue(e.target.value);
    handleDebouncedSearch(e.target.value);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        setOptions([]);
        setSearchValue('');
        setSearchFilters({ value: '', page_no: 1 });
      }}
    >
      <PopoverTrigger asChild>
        <Button
          ref={selectRef}
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='border-input flex justify-between max-w-full'
        >
          <p className='truncate max-w-full'>
            {renderValue?.(value) ??
              (Array.isArray(value) ? value.join(', ') : value)}
          </p>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='p-0'
        style={{ width: selectRef.current?.clientWidth }}
        ref={(ref) => {
          if (ref) {
            ref.addEventListener('wheel', (e) => e.stopPropagation());
          }
        }}
      >
        <div>
          <div className='flex items-center border-b px-3'>
            <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
            <input
              className='flex h-10 w-full focus-visible:ring-none rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
              defaultValue={searchValue}
              onChange={handleSearch}
              placeholder={placeholder ?? 'Select...'}
            />
          </div>
          {options.length || isLoading ? (
            <div className='overflow-hidden p-1 text-foreground'>
              <div
                className='max-h-[300px] overflow-y-auto overflow-x-hidden'
                ref={nextPageRef}
              >
                {options.map((listItem) => {
                  const itemValue = valueKey
                    ? valueKey
                        .split('.')
                        .reduce((acc, part) => acc && acc[part], listItem ?? {})
                    : listItem;
                  const itemLabel = labelKey
                    ? labelKey
                        .split('.')
                        .reduce((acc, part) => acc && acc[part], listItem ?? {})
                    : listItem;

                  const isSelected = checkValue(itemValue);

                  return (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                    <p
                      className='hover:bg-blue-50/80 flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
                      key={itemValue}
                      data-selected={isSelected}
                      onClick={() => {
                        handleSetValue(itemValue);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {itemLabel}
                    </p>
                  );
                })}
                {!isLoading && (
                  <p className='hover:bg-blue-50/80 flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'>
                    <Check className={cn('mr-2 h-4 w-4 opacity-0')} />
                    Loading...
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p className='py-6 text-center text-sm'>No item found.</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
