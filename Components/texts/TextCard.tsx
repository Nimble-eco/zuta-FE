interface ITextCardProps {
    label: string;
    value: string;
}

const TextCard = ({label, value}: ITextCardProps) => {
  return (
    <div className="flex flex-col px-5 py-3">
        <p className="text-sm text-gray-600">
            {label}
        </p>
        <p className="text-base text-black font-semibold">
            {value}
        </p>
    </div>
  )
}

export default TextCard