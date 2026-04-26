import Cookies from "js-cookie";
import { LogOut, User, ChevronDown, Repeat } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import LoginSelectWorkSpaceModal from "../../modals/switch-worskapce/LoginSelectWorkSpaceModal";

const VendorNavBar = () => {
    const router = useRouter();
    const [showDropDown, setShowDropDown] = useState(false);
    const [showSwitchProfileModal, setShowSwitchProfileModal] = useState(false);
    const dropDownRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<any>(null);

    const logout = () => {
        Cookies.remove('user');
        router.push('/');
    }

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) setUser(JSON.parse(userCookie));

        const handleClickOutside = (event: MouseEvent) => {
            if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
                setShowDropDown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="h-16 flex items-center justify-end bg-white px-8 border-b border-slate-200 sticky top-0 z-10">
            <LoginSelectWorkSpaceModal
                show={showSwitchProfileModal}
                setShow={setShowSwitchProfileModal}
            />

            <div className="relative" ref={dropDownRef}>
                <button 
                    onClick={() => setShowDropDown(!showDropDown)}
                    className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors"
                >
                    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                        {user?.picture ? (
                            <img src={user.picture} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            <User className="text-slate-400" size={20} />
                        )}
                    </div>
                    <div className="hidden md:block text-left">
                        <p className="text-sm font-semibold text-slate-700 leading-tight !mb-0">
                            {user?.name || "Vendor Account"}
                        </p>
                        <p className="text-xs text-slate-500 !mb-0">Manage Account</p>
                    </div>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${showDropDown ? 'rotate-180' : ''}`} />
                </button>

                {showDropDown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-150">
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account</p>
                        </div>
                        
                        <button 
                            onClick={() => {
                                setShowSwitchProfileModal(true);
                                setShowDropDown(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            <Repeat size={16} /> Switch Profile
                        </button>

                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VendorNavBar;