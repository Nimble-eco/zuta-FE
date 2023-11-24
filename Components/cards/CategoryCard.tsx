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
      className="flex flex-col bg-white rounded-md px-2 py-3 min-w-70 cursor-pointer h-fit lg:h-40"
      onClick={() => handleClick(title)}
    >
      <img
        src={image} 
        alt={title}
        className='hidden lg:flex rounded-full mb-4 min-h-[6rem] min-w-[6rem] w-full'  
      />
      <span
        className='text-center text-base font-bold text-gray-500 pt-1 max-h-[10%]'
      >
        {title}
      </span>
    </div>
  )
}

export default CategoryCard