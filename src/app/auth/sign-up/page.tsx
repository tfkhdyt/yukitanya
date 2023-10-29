import { Footer } from '@/app/_components/landing-page/footer';
import { RegisterForm } from '@/app/_components/register/register-form';
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
        <div className='container pb-64 pt-12'>
          <Card className='mx-auto w-fit rounded-3xl border-2 border-black p-0 font-poppins md:p-6'>
            <CardHeader>
              <CardTitle className='text-center text-3xl font-extrabold uppercase'>
                Sign up
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RegisterForm />
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  );
}
