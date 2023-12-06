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

import { headers } from 'next/headers';
import { type ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

import { environment } from '@/environment.mjs';
import { TRPCReactProvider } from '@/trpc/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Yukitanya',
	description:
		'Yukitanya adalah sebuah platform yang menghubungkan banyak siswa ke dalam sebuah forum diskusi untuk menyelesaikan tugas sekolah secara bersama.',
	applicationName: 'Yukitanya',
	keywords: [
		'Forum',
		'QnA',
		'Student',
		'Question',
		'Answer',
		'seKODlah',
		'Yukitanya',
		'yukitanya',
		'Brainly',
		'brainly',
	],
	creator: 'Taufik Hidayat',
	publisher: 'seKODlah Kelompok 5 MSIB 5',
	metadataBase: new URL(environment.NEXT_PUBLIC_BASE_PATH),
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
