import { GiClothes, GiLipstick, GiTomato } from "react-icons/gi";
import { FcSmartphoneTablet } from "react-icons/fc";
import { MdOutlineChair, MdMenu , MdPlaylistPlay, MdOutlineSubscriptions} from "react-icons/md";
import router from "next/router";

function CategoriesNav() {
    const getCategory = (category: string) => {
        router.push(`/category?category=${category}`);
    }
    return (
        <div>
            <ul className="grid grid-cols-4 gap-4" >
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex flex-col">
                    <a href="#">
                        <MdPlaylistPlay className="text-gray-600 text-4xl"/>
                        <span>Onpgoing orders</span>
                    </a>
                </li>
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a onClick={() => getCategory("fashion")}>
                        <GiClothes className="text-gray-600 text-4xl"/>
                        <span>Clothes</span>
                    </a>
                </li>
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a onClick={() => getCategory("electronics")}>
                        <FcSmartphoneTablet className="text-gray-600 text-4xl"/>
                        <span>Electronics</span>
                    </a>
                </li>
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a onClick={() => getCategory("beauty")}>
                        <GiLipstick className="text-gray-600 text-4xl"/>
                        <span>Beauty</span>
                    </a>
                </li>
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a onClick={() => getCategory("agriculture")}>
                        <GiTomato className="text-gray-600 text-4xl"/>
                        <span>Food stuffs in bulk</span>
                    </a>
                </li>
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a onClick={() => getCategory("home")}>
                        <MdOutlineChair className="text-gray-600 text-4xl"/>
                        <span>Home</span>
                    </a>
                </li>
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a onClick={() => getCategory("subcriptions")}>
                        <MdOutlineSubscriptions className="text-gray-600 text-4xl"/>
                        <span>Subscriptions</span>
                    </a>
                </li>
                
                <li className="w-[80%] ml-[10%] bg-#ede6e6 text-white p-5 flex-col">
                    <a href="#">
                        <MdMenu className="text-gray-600 text-4xl"/>
                        <span>More</span>
                    </a>
                </li>
            </ul>
            
        </div>
    )
}

export default CategoriesNav
