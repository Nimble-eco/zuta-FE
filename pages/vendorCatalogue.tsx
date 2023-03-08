import { FC, useState } from "react"
import { MdOutlineAdd, MdOutlineDeleteForever } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import Header from "../Components/Header";
import Loader from "../Components/Loader";
import NewProductCard from "../Components/NewProductCard";
import { notify } from "../Utils/displayToastMessage";
import generateRandomKey from "../Utils/generateRandowmKey";
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";

interface IVendorCatalogueProps {
    catalogue: any;
    vendorId: string;
}

const vendorCatalogueCategory: FC<IVendorCatalogueProps> = (props) => {
    let token: string = "";
    const [loading, setLoading] = useState<boolean>(false);
    if(typeof window !== 'undefined'){
        injectStyle();
        token = localStorage.getItem('token')!;
    }

    const  [categoryCard, setCategoryCard] = useState(
        props.catalogue && props.catalogue.length > 0 ? props.catalogue : [{
            category_name: '',
            category_uid: generateRandomKey(20),
            products: [{
                uid: generateRandomKey(20),
                name: "",
                price: "",
                description: "",
                tags: [],
                image: "",
                quantity: 0,
                discount: 0,
                isSoldOut: false,
                vendor_uid: props.vendorId,
            }]
        }]
    );

    const addNewCategoryCard = () => {
        setCategoryCard([...categoryCard, {
            category_name: '',
            category_uid: generateRandomKey(20),
            products: [{
                uid: generateRandomKey(20),
                name: "",
                price: "",
                description: "",
                tags: [],
                image: "",
                quantity: 0,
                discount: 0,
                isSoldOut: false,
                vendor_uid: props.vendorId,
            }]
        }])
    }

    const removeCategoryCard = async (index: number, category_uid: string) => {
        const newCategoryCards = [...categoryCard];

        if(newCategoryCards[index].category_name !== '') {
            setLoading(true);
            const res = await sendAxiosRequest(
                "/api/vendors/catalogue/category/delete",
                "post",
                {category_uid},
                token,
                props.vendorId
            );
            setLoading(false);
            if(res.status === 204) {
                newCategoryCards.splice(index, 1);
                setCategoryCard(newCategoryCards);
                notify('Deleted successfully');
            }
        }
        
    }

    const handleCategoryNameChange = (e: any, index: number) => {
        let catCards = [...categoryCard];
        catCards[index].category_name = e.target.value;
        setCategoryCard(catCards)
    }

    // ----------------------------------------------

    //HANDLE NEW PRODUCT CARD
    const addNewProduct = (index: number) => {
        let catCard = categoryCard;
        catCard[index].products.push({
            uid: generateRandomKey(20),
            name: "",
            price: "",
            description: "",
            tags: [],
            image: "",
            quantity: 0,
            discount: 0,
            isSoldOut: false,
            vendor_uid: props.vendorId,
        })
        setCategoryCard([...catCard]);
    }

    const removeNewProduct = (index: number, i:number) => {
        const catCards = categoryCard;
        catCards[index].products.splice(i, 1);
        setCategoryCard([...catCards]);
    }

    const handleNewProductChange = (
        index: number,
        i: number,
        name: string,
        price: string,
        description: string,
        tags: [],
        image: string,
        quantity: number,
        discount: number,
        isSoldOut: boolean
    ) => {
        const catCard = [...categoryCard];
        catCard[index].products[i] = {name, price, description, tags, image, quantity, discount, isSoldOut};
        setCategoryCard(catCard);
    }

    const toggleSoldOut = (index: number, i: number) => {
        const catCard = [...categoryCard];
        catCard[index].products[i].isSoldOut = !catCard[index].products[i]?.isSoldOut;
        setCategoryCard(catCard);
    }

    // -------------------------------------------------------------

    // CREATE CATALOGUE
    const updateCatalogue = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        const res = await sendAxiosRequest(
            "/api/vendors/catalogue/update",
            "post",
            categoryCard,
            token,
            props.vendorId
        );
        setLoading(false);
        if(res.status === 200) notify('Updated Catalogue');
        else if(res.message === "Your account has not yet been approved") notify("Your account has not yet been approved");
    }

    // -------------------------------------------------------------


    return (
        <div
            className="flex flex-col text-center bg-gray-200 pb-20"
        >
            {
                loading && <Loader />
            }

            <Header/>
            <ToastContainer />
            <h2
                className="text-2xl font-mono my-10 text-orange-500"
            >
                Which type of market you dy sell?    
            </h2>

            { categoryCard.map((card: any, index: number) => (
            <div
                key={index}
                className="flex flex-col rounded-md bg-white text-gray-800 text-center text-base justify-between w-[70%] mx-auto px-4 py-5 border border-gray-100 my-3"
            >
                <div
                    className="flex flex-row pb-3 border-b-2 border-gray-200 justify-center"
                >
                    <select
                        className="text-gray-800 text-xl px-7 py-4 bg-transparent flex justify-center"
                        name="category"
                        value={card.category_name || ""}
                        onChange={(e) => handleCategoryNameChange(e, index)}
                    >
                        <option value="">Select category</option>
                        <option value="food-stuffs">Food stuffs</option>
                        <option value="electronics">Electronics</option>
                        <option value="clothes">Clothes</option>
                        <option value="home">Home</option>
                        <option value="others">Others</option>
                    </select>    
                    {
                        index ? (
                            <div
                                className="w-[18%] py-1"
                            >
                                <button 
                                    className="text-lg pt-3 text-center py-1"
                                    onClick={() => removeCategoryCard(index, card.category_uid)}
                                >
                                    <MdOutlineDeleteForever className="text-3xl text-center text-red-500"/>
                                </button>
                            </div>
                        ) : null
                    }
                </div>
                <NewProductCard 
                    category={card.category_name}
                    categoryCardIndex={index}
                    newProducts={card.products}
                    addNewProduct={addNewProduct}
                    removeNewProduct={removeNewProduct}
                    handleNewProductChange={handleNewProductChange}
                    toggleSoldOut={toggleSoldOut}
                />
            </div>
            ))}
            <div
                className="w-full flex justify-end pt-5"
            >
                 <button
                    className="text-2xl py-1 border border-orange-500 text-orange-500 rounded-md px-3 mr-20 mb-10 hover:bg-orange-500 hover:text-white"
                    onClick={addNewCategoryCard}
                >
                    <div
                        className="flex flex-row text-center"
                    >
                        <MdOutlineAdd className="text-3xl group"/>
                        <span
                            className="text-sm pl-3 pt-1"
                        >
                            Add category
                        </span>
                    </div>
                </button>
            </div>
            <button
                onClick={(e) => updateCatalogue(e)}
                className="bg-orange-500 px-5 text-sm py-3 text-white rounded-md w-[40%] mx-auto hover:bg-orange-800"
            >
                Submit
            </button>
            
        </div>
    )
}

export default vendorCatalogueCategory

export async function getServerSideProps(context: any) {
    try {
        let token: string = context.query.token || "";
        let vendorId: string = context.query.vendorId || '';
        const getCatalogue = await sendAxiosRequest(
            `/api/vendors/catalogue`,
            "get",
            {},
            token,
            vendorId
        );

        const catalogue = getCatalogue.catalogue;
       
        return {
            props: {
                catalogue: catalogue,
                vendorId,
            }
        }
    } catch (error: any) {
        throw new Error(error.message);
    }
}