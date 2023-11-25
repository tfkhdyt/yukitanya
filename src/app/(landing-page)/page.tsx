import { Footer } from '@/components/footer';

import { Berita } from './berita';
import { Fitur } from './fitur';
import { Header } from './header';
import { Hero } from './hero';
import { Keunggulan } from './keunggulan';
import { MataPelajaran } from './mata-pelajaran';
import { TentangKami } from './tentang-kami';
import { Testimoni } from './testimoni';

export default function Landing() {
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
