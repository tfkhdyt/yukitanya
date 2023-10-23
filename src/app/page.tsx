import { Hero } from './_components/landing-page/hero';
import { MataPelajaran } from './_components/landing-page/mata-pelajaran';
import { TentangKami } from './_components/landing-page/tentang-kami';

export default function Home() {
  return (
    <main>
      <Hero />
      <MataPelajaran />
      <TentangKami />
    </main>
  );
}
