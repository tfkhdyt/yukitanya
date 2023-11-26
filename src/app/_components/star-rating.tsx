import { Star } from 'lucide-react';

export function StarRating({ rating }: { rating: number }) {
  // Calculate the number of full stars and the number of half stars
  const fullStars = Math.round(rating);
  //   const hasHalfStar = rating % 1 !== 0;

  // Create an array of JSX elements to represent the stars
  const stars = [];
  for (let index = 0; index < fullStars; index++) {
    stars.push(<Star color='#F48C06' fill='#F48C06' key={index} />);
  }

  //   if (hasHalfStar) {
  //     stars.push(
  //       <StarHalf key='half' size={18} color='#F48C06' fill='#F48C06' />,
  //     );
  //   }

  // Fill in the remaining stars with empty stars
  while (stars.length < 5) {
    stars.push(<Star color='#F48C06' fill='none' key={stars.length} />);
  }

  return (
    <div className='flex items-center' title={`${rating.toString()}/5`}>
      {stars}
    </div>
  );
}
