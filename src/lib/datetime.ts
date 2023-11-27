import 'dayjs/locale/id';

import dayjs, { extend, locale, Ls, updateLocale } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocalePlugin from 'dayjs/plugin/updateLocale';

locale('id');
extend(relativeTime);
extend(updateLocalePlugin);
updateLocale('id', {
  relativeTime: {
    ...Ls.id?.relativeTime,
    M: '1b',
    MM: '%db',
    d: '1h',
    dd: '%dh',
    h: '1j',
    hh: '%dj',
    m: '1m',
    mm: '%dm',
    s: 'Baru saja',
    y: '1t',
    yy: '%dt',
  },
});

export function formatLongDateTime(date: Date) {
  return dayjs(date).format('dddd, D MMM YYYY, HH:mm:ss');
}

export function getFromNowTime(date: Date) {
  return dayjs(date).fromNow(true);
}
