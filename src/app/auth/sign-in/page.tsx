import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { SigninForm } from './signin-form';

export const metadata = {
  title: 'Sign In - Yukitanya',
};

export default function SignIn() {
  return (
    <>
      <section className='h-screen bg-[url(/img/hero_bg.svg)] bg-cover lg:bg-bottom'>
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
