import { Berita } from './_components/landing-page/berita';
import { Fitur } from './_components/landing-page/fitur';
import { Footer } from './_components/landing-page/footer';
import { Header } from './_components/landing-page/header';
import { Hero } from './_components/landing-page/hero';
import { Keunggulan } from './_components/landing-page/keunggulan';
import { MataPelajaran } from './_components/landing-page/mata-pelajaran';
import { TentangKami } from './_components/landing-page/tentang-kami';
import { Testimoni } from './_components/landing-page/testimoni';

export default function Home() {
  return (
    <main className='relative'>
      <Header />
      <Hero />
      <MataPelajaran />
      <TentangKami />
      <Keunggulan />
      <Fitur />
      <Testimoni />
      <Berita />
      <Footer scroll />
    </main>
  );
}
