import '@/styles/globals.css';
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import '@fontsource-variable/rubik';
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { headers } from 'next/headers';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { TRPCReactProvider } from '@/trpc/react';

dayjs.locale('id');
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('id', {
  relativeTime: {
    ...dayjs.Ls.id?.relativeTime,
    M: '1b',
    MM: '%db',
    d: '1h',
    dd: '%dh',
    h: '1j',
    hh: '%dj',
    m: '1m',
    mm: '%dm',
    s: 'Baru saja',
    y: '1t',
    yy: '%dt',
  },
});

export const metadata = {
  description:
    'Yukitanya adalah sebuah website yang menghubungkan banyak siswa ke dalam sebuah forum diskusi untuk menyelesaikan tugas sekolah secara bersama.',
  title: 'Yukitanya',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body className='font-poppins'>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
        <Toaster position='top-right' reverseOrder={false} />
      </body>
    </html>
  );
}
