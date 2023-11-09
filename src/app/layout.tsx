import '@/styles/globals.css';
import '@fontsource-variable/rubik';
import '@fontsource/poppins/100.css';
import '@fontsource/poppins/200.css';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import 'dayjs/locale/id';

import dayjs from 'dayjs';
import { headers } from 'next/headers';

import { TRPCReactProvider } from '@/trpc/react';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('id');
dayjs.extend(relativeTime);

export const metadata = {
  title: 'Yukitanya',
  description:
    'Yukitanya adalah sebuah website yang menghubungkan banyak siswa ke dalam sebuah forum diskusi untuk menyelesaikan tugas sekolah secara bersama.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className='font-poppins'>
        <TRPCReactProvider headers={headers()}>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
