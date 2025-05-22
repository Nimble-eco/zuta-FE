interface ITextImageCardProps {
    image: string;
    title: string;
    link?: string;
    onClick?: any;
}

const TextImageCard = ({title, image, link, onClick}: ITextImageCardProps) => {
  return (
    <a  
        href={link ?? '#0'}
        className="flex flex-col justify-center items-center rounded-full relative h-fit w-fit"
        onClick={onClick ?? null}
    >
        <div className='absolute top-0 left-0 right-0 bottom-0 rounded-full bg-black bg-opacity-40 ' />
        <img
            src={image} 
            alt={title}
            className='flex rounded-full min-h-[6rem] h-[6rem] min-w-[6rem] w-[6rem]'  
        />
        <span
            className='text-center text-sm font-semibold text-white absolute top-1/2 center-absolute-el'
        >
            {title}
        </span>
    </a>
  )
}

export default TextImageCard