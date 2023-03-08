import { RiHomeSmileLine, RiMenu5Fill } from "react-icons/ri";
import { MdPersonOutline, MdOutlineMenuBook} from "react-icons/md";

function FooterNav(user: any) {
    return (
        <div className="fixed bottom-0 right-0 left-0 z-50">
            <ul className="bg-white text-black p-4 flex flex-row justify-between">
                <li className="flex flex-col px-3 py-2">
                    <a href="/">
                        <RiHomeSmileLine className="text-3xl"/>
                        <span>Home</span>
                    </a>
                </li>
                <li className="flex flex-col px-3 py-2">
                    <a href="/category">
                        <RiMenu5Fill className="text-3xl"/>
                        <span>Categories</span>
                    </a>
                </li>
                <li className="flex flex-col px-3 py-2">
                    <a href="/profile">
                        <MdPersonOutline className="text-3xl"/>
                        <span>Profile</span>
                    </a>
                </li>
                {
                    user.gig ? 
                    <li className="flex flex-col px-3 py-2">
                        <a href="/catalogue">
                            <MdOutlineMenuBook className="text-3xl"/>
                            <span>Catalogue</span>
                        </a>
                    </li>
                    :
                    null
                }
            </ul>
            
        </div>
    )
}

export default FooterNav
