import React from 'react';
import { MdStar, MdOutlineStarOutline } from 'react-icons/md';

interface IRatingsCardProps {
  rating: number;
  setRatings?: (score: number) => void;
}
const RatingsCard = ({ rating, setRatings }: IRatingsCardProps) => {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<MdStar key={i} className="text-orange-300"/>);
    } else {
      stars.push(
      <MdOutlineStarOutline 
        key={i} 
        className="cursor-pointer" 
        onClick={() => {
          if(setRatings) setRatings(i + 1);
        }}
      />);
    }
  }

  return (
    <div className="flex flex-row">
      {stars}
    </div>
  );
};

export default RatingsCard;
