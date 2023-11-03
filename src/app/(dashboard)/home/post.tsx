import { Heart, Link, MessageCircle, Star } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar';
import { Badge } from '@/app/_components/ui/badge';
import { Button } from '@/app/_components/ui/button';

export function Post() {
  return (
    <div className='flex space-x-3 border-b-2 p-6'>
      <Avatar>
        <AvatarImage src='https://github.com/tfkhdyt.png' />
        <AvatarFallback>TH</AvatarFallback>
      </Avatar>
      <div className='space-y-1'>
        <div className='flex space-x-2 text-[#696984]'>
          <p className='font-semibold'>Taufik Hidayat</p>
          <p className='font-light'>@tfkhdyt</p>
          <p>•</p>
          <p>24m</p>
        </div>
        <p className='py-1 text-sm leading-relaxed text-[#696984]'>
          Pada masa Daulah Abbasiyah, kedudukan kaum muslim di Bagdad berada
          .... a. lebih tinggi daripada warga lainnya b. sejajar dengan warga
          lainnya c. lebih rendah daripada warga lainnya d. sebagai warga yang
          istimewa
        </p>
        <div className='flex justify-between pt-2'>
          <div className='space-x-1'>
            <Badge variant='secondary' className='hover:bg-slate-200'>
              <button>Sejarah</button>
            </Badge>
            <Badge variant='secondary' className='hover:bg-slate-200'>
              <button>Pendidikan Agama Islam</button>
            </Badge>
          </div>
          <div className='flex items-center space-x-1'>
            <Star size={18} color='#F48C06' fill='#F48C06' />
            <Star size={18} color='#F48C06' fill='#F48C06' />
            <Star size={18} color='#F48C06' fill='#F48C06' />
            <Star size={18} color='#F48C06' fill='#F48C06' />
            <Star size={18} color='#F48C06' />
          </div>
        </div>
        <div className='space-x-2 pt-2 text-[#696984]'>
          <Button size='sm' variant='outline' className='rounded-full text-sm'>
            <MessageCircle size={18} className='mr-2' />
            Lihat jawaban (2)
          </Button>
          <Button size='sm' variant='outline' className='rounded-full text-sm'>
            <Heart size={18} className='mr-2' />
            Favorit (5)
          </Button>
          <Button size='sm' variant='outline' className='rounded-full text-sm'>
            <Link size={18} className='mr-2' />
            Salin link
          </Button>
        </div>
      </div>
    </div>
  );
}
