import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';

import { getServerAuthSession } from '@/server/auth';
import { SigninForm } from './signin-form';

export const metadata = {
	title: 'Sign In - Yukitanya',
};

export default async function SignIn() {
	const session = await getServerAuthSession();
	if (session) return redirect('/home');

	return (
		<>
			<section className='min-h-[100svh] bg-[url(/img/hero_bg.svg)] bg-cover lg:bg-bottom'>
				<div className='container px-5 pt-5 md:pt-12'>
					<Card className='mx-auto w-fit rounded-3xl border-2 border-black p-0 md:p-6'>
						<CardHeader>
							<CardTitle className='text-center text-3xl font-extrabold uppercase'>
								Sign in
							</CardTitle>
						</CardHeader>
						<CardContent>
							<SigninForm />
						</CardContent>
					</Card>
				</div>
			</section>
			<Footer />
		</>
	);
}
