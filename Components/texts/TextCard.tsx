interface ITextCardProps {
    label: string;
    value: string | number | string[];
}

const TextCard = ({label, value}: ITextCardProps) => {
  return (
    <div className="flex flex-col px-5 py-3 max-w-fit">
        <p className="text-sm text-gray-600 whitespace-nowrap">
            {label}
        </p>
        <p className="text-base text-black font-semibold max-w-full w-full text-justify">
            {value}
        </p>
    </div>
  )
}

export default TextCard