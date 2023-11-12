import { type Metadata } from 'next';
import { SearchForm } from './search-form';

export const metadata: Metadata = {
  title: 'Cari Pertanyaan - Yukitanya',
};

export default function SearchPage() {
  return (
    <main>
      <SearchForm />
    </main>
  );
}
