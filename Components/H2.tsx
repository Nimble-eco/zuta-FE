import { FC } from 'react'
import { capitalizeFirstLetter } from '../Utils/capitalizeFirstLettersOfString'

interface IH2Props {
    heading: string
}

const H2: FC<IH2Props> = ({heading}) => {
  return (
    <div>
        <div
            className='flex flex-col justify-center w-auto'
        >
            <h2
                className='text-orange-500 py-5 font-mono text-2xl text-center'
            >
                {capitalizeFirstLetter(heading)}
            </h2>
            <div className='w-[10%] mx-auto border-b-2 border-orange-500 mb-4' />
        </div>
    </div>
  )
}

export default H2