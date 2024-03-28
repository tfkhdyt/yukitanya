import { StarIcon } from 'lucide-react';

import { StarHalfIcon } from './icons/star-half';

export function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  // Create an array of JSX elements to represent the stars
  const stars = [];
  for (let index = 0; index < fullStars; index++) {
    // Limit the number of full stars to 5
    stars.push(<StarIcon color='#F48C06' fill='#F48C06' key={index} />);
  }

  if (hasHalfStar && stars.length < 5) {
    stars.push(<StarHalfIcon key='half' />);
  }

  // Fill in the remaining stars with empty stars
  while (stars.length < 5) {
    stars.push(<StarIcon color='#F48C06' fill='none' key={stars.length} />);
  }

  return (
    <div
      className='-mt-0.5 flex items-center gap-0.5'
      title={`${rating.toString()}/5`}
    >
      {stars}
    </div>
  );
}
