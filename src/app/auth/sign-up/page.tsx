import { Footer } from '@/app/_components/landing-page/footer';
import { SignupForm } from '@/app/_components/sign-up/signup-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card';

export const metadata = {
  title: 'Sign Up - Yukitanya',
};

export default function SignUp() {
  return (
    <>
      <section className='h-auto bg-[url(/img/hero_bg.svg)] bg-cover bg-bottom'>
        <div className='container px-5 pb-52 pt-5 md:pb-64 md:pt-12'>
          <Card className='mx-auto w-fit rounded-3xl border-2 border-black p-0 font-poppins md:p-6'>
            <CardHeader>
              <CardTitle className='text-center text-3xl font-extrabold uppercase'>
                Sign up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer scroll={false} />
    </>
  );
}
