import { Berita } from './_components/landing-page/berita';
import { Fitur } from './_components/landing-page/fitur';
import { Footer } from './_components/landing-page/footer';
import { Header } from './_components/landing-page/header';
import { Hero } from './_components/landing-page/hero';
import { Keunggulan } from './_components/landing-page/keunggulan';
import { MataPelajaran } from './_components/landing-page/mata-pelajaran';
import { Penilaian } from './_components/landing-page/penilaian';
import { TentangKami } from './_components/landing-page/tentang-kami';

export default function Home() {
  return (
    <main className='relative'>
      <Header />
      <Hero />
      <MataPelajaran />
      <TentangKami />
      <Keunggulan />
      <Fitur />
      <Penilaian />
      <Berita />
      <Footer />
    </main>
  );
}
