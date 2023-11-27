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

import { headers } from 'next/headers';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { TRPCReactProvider } from '@/trpc/react';

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
