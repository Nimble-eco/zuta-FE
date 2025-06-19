import Cookies from "js-cookie";
import { LogOutIcon, User2, UserCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import LoginSelectWorkSpaceModal from "../../modals/switch-worskapce/LoginSelectWorkSpaceModal";

const VendorNavBar = () => {
    const router = useRouter();
    const [showDropDown, setShowDropDown] = useState(false);
    const [showSwitchProfileModal, setShowSwitchProfileModal] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>({});

    const logout = () => {
        Cookies.remove('user');
        setTimeout(()=>router.push('/'), 1300);
    }

    useEffect(() => {
        let userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        setUser(userCookie);
    }, []);

    useEffect(() => {
        let isMounted = true

        const handleClickOutside = (event: any) => {
            if (isMounted) {
                if (
                    dropDownRef.current &&
                    !dropDownRef.current!.contains(event.target)
                )
                setShowDropDown(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            isMounted = false
        }
    }, []);

    return (
        <div className="flex flex-row py-3 bg-white items-center justify-end mb-8 px-4 border-b-[1px] border-slate-800 border-opacity-40 shadow-xl">
            <LoginSelectWorkSpaceModal
                show={showSwitchProfileModal}
                setShow={setShowSwitchProfileModal}
            />
            <div className="flex flex-row gap-2 items-center">
                {
                    user?.picture ? (
                        <img
                            src={user?.picture}
                            className="rounded-full w-8 h-8 object-center object-cover bg-gray-200"
                        />
                    ) : (
                        <UserCircle className="text-slate-600 h-8 w-8" />
                    )
                }
                
                <div className="relative flex flex-col">
                    <div 
                        className="flex flex-row gap-1 items-center cursor-pointer"
                        onClick={()=>setShowDropDown(!showDropDown)}
                    >
                        <p className="text-slate-600 text-sm font-semibold !mb-0">Logout</p>
                        <LogOutIcon className="text-slate-600 h-5 w-5" />
                    </div>
                    {
                        showDropDown && (
                            <div 
                                className="flex flex-col gap-3 px-4 py-2 rounded-xl bg-white shadow-xl absolute top-10 -left-10 text-center"
                                ref={dropDownRef}
                            >
                                <p 
                                    className="text-slate-800 cursor-pointer whitespace-nowrap font-medium text-sm"
                                    onClick={()=>setShowSwitchProfileModal(!showSwitchProfileModal)}
                                >
                                    Switch profile
                                </p>
                                <p 
                                    className="text-red-800 cursor-pointer whitespace-nowrap font-medium text-sm"
                                    onClick={logout}    
                                >
                                    Logout
                                </p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default VendorNavBar;