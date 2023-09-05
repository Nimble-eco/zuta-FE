import { useRouter } from 'next/router';

interface ICategoryCardProps {
  image: string;
  title: string;
}

const CategoryCard = ({image, title}: ICategoryCardProps) => {
  const router = useRouter();

  const handleClick = (tag: string) => {
    router.push(`/results?tag=${tag}`);
  }

  return (
    <div
      className="flex flex-col justify-center items-center bg-white rounded-md px-2 py-6 min-w-54 cursor-pointer h-48 drop-shadow-2xl"
      onClick={() => handleClick(title)}
    >
      <img
        src={image} 
        alt={title}
        className='rounded-full mb-4 min-h-[60%] min-w-[5rem] w-full'  
      />
      <span
        className='text-center text-base font-bold text-gray-500 pt-1 max-h-[15%]'
      >
        {title}
      </span>
    </div>
  )
}

export default CategoryCard