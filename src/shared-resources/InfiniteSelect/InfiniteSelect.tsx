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
import * as _ from 'lodash';

type InfiniteSelectProps = {
  onChange: (value: any) => void;
  value: any;
  placeholder?: string;
  data: any[];
  multiple?: boolean;
  dispatchAction: (data: { value: string; page_no: number }) => {
    type: string;
    payload: any;
  };
  labelKey?: string;
  valueKey?: string;
  isLoading: boolean;
  totalCount: number;
};

export const InfiniteSelect = ({
  onChange,
  value,
  placeholder,
  data,
  multiple,
  dispatchAction,
  labelKey,
  valueKey,
  isLoading,
  totalCount,
}: InfiniteSelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [searchFilters, setSearchFilters] = React.useState({
    value: '',
    page_no: 1,
  });
  const [searchValue, setSearchValue] = React.useState('');
  const [options, setOptions] = React.useState<any[]>([]);
  const [selectedValues, setSelectedValues] = React.useState<any>(() => {
    if (!Array.isArray(value)) return _.get(value, valueKey ?? '');
    return value.map((item) => _.get(item, valueKey ?? ''));
  });

  React.useEffect(() => {
    if (data.length) {
      let newDataArray = structuredClone(options);
      const preLoadedOptions = Array.isArray(value) ? value : [];
      const availableOptions = preLoadedOptions.filter((option) => {
        const itemLabel = _.get(option, labelKey ?? '');

        if (itemLabel.includes(searchFilters.value)) return true;
        return false;
      });

      newDataArray.push(...data);
      const newOptions = _.differenceBy(
        availableOptions,
        newDataArray,
        'identifier'
      );
      newDataArray.unshift(...newOptions);

      if (!Array.isArray(selectedValues)) {
        newDataArray = newDataArray.filter(
          (item) => _.get(item, valueKey ?? '') !== selectedValues
        );
        if (value) newDataArray.unshift(value);
      } else {
        newDataArray.sort((a, b) => {
          const itemValueA = _.get(a, valueKey ?? '');
          const itemValueB = _.get(b, valueKey ?? '');

          const inA = selectedValues.includes(itemValueA);
          const inB = selectedValues.includes(itemValueB);

          if (inA && inB) return 0;
          if (inA) return -1;
          if (inB) return 1;
          return 0;
        });
      }

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

  const handleSetValue = (val: any) => {
    if (!multiple) {
      onChange(val);
      setSelectedValues(_.get(val, valueKey ?? ''));
      setOpen(false);
      return;
    }

    if (!Array.isArray(selectedValues)) return;

    if (selectedValues.includes(_.get(val, valueKey ?? ''))) {
      onChange(
        value.filter(
          (item: any) =>
            _.get(item, valueKey ?? '') !== _.get(val, valueKey ?? '')
        )
      );
      setSelectedValues(
        selectedValues.filter((item) => _.get(val, valueKey ?? '') !== item)
      );
    } else {
      onChange([...value, val]);
      setSelectedValues([...selectedValues, _.get(val, valueKey ?? '')]);
    }
  };

  const checkValue = (val: string | number) => {
    if (Array.isArray(value)) {
      return selectedValues.includes(val);
    }

    return selectedValues === val;
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
            {Array.isArray(value)
              ? value.map((item) => _.get(item, labelKey ?? '')).join(', ')
              : _.get(value, labelKey ?? '')}
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
                  const itemValue = _.get(listItem, valueKey ?? '');
                  const itemLabel = _.get(listItem, labelKey ?? '');

                  const isSelected = checkValue(itemValue);

                  return (
                    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                    <p
                      className='hover:bg-blue-50/80 flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
                      key={itemValue}
                      data-selected={isSelected}
                      onClick={() => {
                        handleSetValue(listItem);
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
                {isLoading && (
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
