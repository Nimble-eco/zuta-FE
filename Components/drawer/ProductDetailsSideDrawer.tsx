import React from 'react'
import { MdArrowBackIos } from 'react-icons/md';

interface IProductDetailsSideDrawerProps {
    title: string;
    description: string;
    introduction?: string;
    visibilityState?: string;
}

const ProductDetailsSideDrawer = ({title, introduction, description, visibilityState='closed'}: IProductDetailsSideDrawerProps, ref: any) => {
    /**
	    * Modal control and content
    */
    React.useImperativeHandle(ref, () => ({
        open: (value?:string) => {openModal();},
        close: () => closeModal(),
    }));
    
    const [visibility, setVisibility] = React.useState(visibilityState);
    
    function closeModal() {
        setVisibility('closed');
    }
    
    function openModal() {
        setVisibility('open');
    }
     
  return (
        <div className={`${visibility === 'open' ? 'flex' : 'hidden'} flex-col w-[95%] lg:w-[814px] fixed right-0 top-0 bottom-0 z-50 bg-white px-4 lg:px-10 pt-10 shadow-2xl overflow-scroll`}>
            <div className="flex flex-row gap-6 cursor-pointer" onClick={() => closeModal()}>
                <div className="bg-[#F2F2F2] rounded-[50px] px-3 py-3">
                    <MdArrowBackIos className="text-orange-500 text-sm text-center mx-auto"/>
                </div>
                <p className="text-[#13151A] font-semibold lg:text-lg my-auto mt-6">About {title}</p>
            </div>
            {
                introduction ? (
                    <p className='text-slate-800'>{introduction}</p>
                ) : null
            }
            <div 
                dangerouslySetInnerHTML={{__html: description}} 
                className='text-sm text-[#545454] mt-10 px-4'    
            />
        </div>
  )
}

export default React.forwardRef(ProductDetailsSideDrawer)