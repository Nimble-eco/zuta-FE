import React from 'react'
import ProductComponent from '../../Components/ProductComponent'
import { Users2Icon } from 'lucide-react'
import ExploreItemCard from '../../Components/cards/ExploreItemCard'
import { productsDummyData } from '../../data/products'
import ExploreUserCard from '../../Components/cards/ExploreUserCard'
import Header from '../../Components/Header'

const index = () => {
  return (
    <div className="flex flex-col w-full bg-white min-h-screen relative">
        <Header search={false} />
        <div className="flex flex-row pt-8">
            <div className="hidden md:flex flex-col gap-4 md:w-[20%] px-4 justify-center items-center">
                <h5 className="font-bold text-slate-600">Featured products</h5>
                {
                    productsDummyData?.slice(0,4).map((product) => (
                        <ProductComponent
                            key={product.id}
                            product={product}
                        />
                    ))
                }
            </div>
            <div className="flex flex-col gap-6 mt-8 lg:w-[560px] lg:mx-auto border-l border-r border-gray-200">
                <div className="flex flex-row gap-4 items-center justify-center">
                    <input
                        type="text"
                        placeholder="Search communities"
                        className="bg-gray-200 rounded-xl border-0 outline-none px-4 py-2 lg:w-[30rem]" 
                    />
                    <Users2Icon className="h-7 w-7 cursor-pointer" />
                </div>
                <ExploreItemCard
                    id={'1'}
                    banner_image="https://via.placeholder.com/100"
                    name="jemiseu"
                    message="How nigrians went to head with south africans. uber for uber, bolt got bold"
                />
                <ExploreItemCard
                    id={'1'}
                    banner_image="https://via.placeholder.com/100"
                    name="jemiseu"
                    message="How nigrians went to head with south africans. uber for uber, bolt got bold"
                    images={[
                        'https://via.placeholder.com/100',
                        'https://via.placeholder.com/100',
                        'https://via.placeholder.com/100',
                        'https://via.placeholder.com/100'
                    ]}
                />
                <ExploreItemCard
                    id={'1'}
                    banner_image="https://via.placeholder.com/100"
                    name="jemiseu"
                    message="How nigrians went to head with south africans. uber for uber, bolt got bold"
                    videos={[
                        'https://via.placeholder.com/100',
                    ]}
                />
            </div>
            <div className="hidden md:flex flex-col gap-4 md:w-[25%] md:mx-4 border border-gray-300 rounded-xl px-4 py-6 h-fit">
                <h5 className="font-bold text-slate-600">Join the community</h5>
                <ExploreUserCard
                    id={'1'}
                    name="jemiseu"
                    image="https://via.placeholder.com/100"
                />  
                <ExploreUserCard
                    id={'1'}
                    name="jemiseu"
                    image="https://via.placeholder.com/100"
                />  
                <ExploreUserCard
                    id={'1'}
                    name="jemiseu"
                    image="https://via.placeholder.com/100"
                />  
            </div>
        </div>
    </div>
  )
}

export default index