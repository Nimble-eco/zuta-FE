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
      className="flex flex-col bg-white rounded-md p-4 cursor-pointer min-w-fit min-h-fit shadow-2xl"
      onClick={() => handleClick(title)}
    >
      <img
        src={image} 
        alt={title}
        className='rounded-full mb-2 h-[6rem] w-[6rem] mx-auto object-cover object-center hidden md:flex'  
      />
      <span
        className='text-center text-sm font-semibold text-slate-800 '
      >
        {title}
      </span>
    </div>
  )
}

export default CategoryCard