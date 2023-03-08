import React from 'react';
import { MdStar, MdOutlineStarOutline } from 'react-icons/md';

interface IRatingsCardProps {
    rating: number;
}
const RatingsCard = ({ rating }: IRatingsCardProps) => {
  let stars = [];
  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      stars.push(<MdStar key={i} className="text-orange-300"/>);
    } else {
      stars.push(<MdOutlineStarOutline key={i} className="" />);
    }
  }

  return (
    <div className="flex flex-row">
      {stars}
    </div>
  );
};

export default RatingsCard;
