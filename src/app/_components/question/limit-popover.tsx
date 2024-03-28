import type { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export function LimitPopover({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className='text-[#696984] font-medium rounded-xl'>
        Anda telah melewati batas pembuatan pertanyaan hari ini, coba lagi
        besok.
      </PopoverContent>
    </Popover>
  );
}
