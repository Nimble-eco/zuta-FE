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
      className="flex flex-col justify-center items-center bg-white rounded-md px-4 py-3 min-w-70 cursor-pointer h-fit lg:h-40"
      onClick={() => handleClick(title)}
    >
      <img
        src={image} 
        alt={title}
        className='flex rounded-full mb-2 min-h-[6rem] min-w-[6rem] w-full'  
      />
      <span
        className='text-center text-base font-bold text-gray-500 '
      >
        {title}
      </span>
    </div>
  )
}

export default CategoryCard