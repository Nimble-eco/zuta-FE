import { User2, Store, ChevronRight, LayoutGrid } from 'lucide-react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from 'next/router';

interface ILoginSelectWorkspaceModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
}

const LoginSelectWorkSpaceModal = ({ show, setShow }: ILoginSelectWorkspaceModalProps) => {
    const router = useRouter();

    const workspaces = [
        {
            title: "Shopping Profile",
            desc: "Explore products, follow friends, and manage orders.",
            icon: <User2 size={24} />,
            route: '/',
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Vendor Dashboard",
            desc: "Manage your inventory, sales, and store analytics.",
            icon: <Store size={24} />,
            route: '/vendor',
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ];

    return (
        <Modal 
            show={show} 
            onHide={() => setShow(false)} 
            centered
            contentClassName="!border-none !rounded-[2rem] shadow-2xl"
        >
            <Modal.Body className="p-8 lg:p-10 flex flex-col gap-6">
                
                {/* Header Section */}
                <div className="text-center space-y-2 mb-2 pt-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <LayoutGrid size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Choose Workspace</h2>
                    <p className="text-slate-500 text-sm">Where would you like to start today?</p>
                </div>

                {/* Workspace Cards */}
                <div className="flex flex-col gap-4">
                    {workspaces.map((ws) => (
                        <div 
                            key={ws.title}
                            onClick={() => router.push(ws.route)}
                            className="group relative flex items-center justify-between p-5 rounded-3xl bg-slate-50 border-2 border-transparent hover:border-orange-500 hover:bg-white hover:shadow-xl hover:shadow-orange-100/50 cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="flex items-center gap-5">
                                {/* Icon Container */}
                                <div className={`w-14 h-14 rounded-2xl ${ws.bg} ${ws.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                                    {ws.icon}
                                </div>

                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                        {ws.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">
                                        {ws.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-2 rounded-full shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Tip */}
                <div className="mt-4 pt-6 border-t border-slate-100 flex items-center justify-center">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Session Active: {new Date().toLocaleDateString()}
                    </p>
                </div>

            </Modal.Body>
        </Modal>
    );
};

export default LoginSelectWorkSpaceModal;