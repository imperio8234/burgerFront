import { Dialog } from "@headlessui/react";
import {
    LayoutDashboard,
    ShoppingCart,
    Heart,
    MessageCircle,
    Clock,
    FileText,
    Settings,
    PlusCircle
} from "lucide-react";
import { useState } from "react";
import { AdminPanel } from "../home/adminPanel";
import { ModalPedidos } from "./modalPedidos";
import { useAuth } from "../context/AuthContext";

export const Sidebar = () => {
    const { user } = useAuth();
    const [openAdminModal, setOpenAdminModal] = useState(false);
    const [openModalPedidos, setOpenModalPedidos] = useState(false);
    const [activeItem, setActiveItem] = useState("Dashboard");
    const rol = user?.user?.rol;

    return (
        <aside className="w-72 h-screen bg-white shadow-md p-6 flex flex-col justify-between">
            {/* Logo */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-10">
                    The Burger <span className="text-yellow-500">Station.</span>
                </h1>

                {/* Menu */}
                <nav className="flex flex-col gap-4 text-gray-600 text-sm">
                    {/*<SidebarItem
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        active={activeItem === "Dashboard"}
                        onClick={() => setActiveItem("Dashboard")}
                    />/*}

                    {/*<SidebarItem
                        icon={<Heart size={18} />}
                        label="Favorite"
                        active={activeItem === "Favorite"}
                        onClick={() => setActiveItem("Favorite")}
                    />*/}
                   {/* <SidebarItem
                        icon={<MessageCircle size={18} />}
                        label="Message"
                        active={activeItem === "Message"}
                        onClick={() => setActiveItem("Message")}
                    />*/}
                    <SidebarItem
                        icon={<Clock size={18} />}
                        label="Order History"
                        active={activeItem === "Order History"}
                        onClick={() => {
                            setActiveItem("Order History");
                            setOpenModalPedidos(true);
                        }}
                    />
                   {/*} <SidebarItem
                        icon={<FileText size={18} />}
                        label="Bills"
                        active={activeItem === "Bills"}
                        onClick={() => setActiveItem("Bills")}
                    />*/}
                    <SidebarItem
                        icon={<Settings size={18} />}
                        label="Setting"
                        active={activeItem === "Setting"}
                        onClick={() => setActiveItem("Setting")}
                    />

                    {rol === "admin" && (
                        <>
                            <SidebarItem
                                icon={<ShoppingCart size={18} />}
                                label="Food Order"
                                active={activeItem === "Food Order"}
                                onClick={() => setActiveItem("Food Order")}
                            />
                            <SidebarItem
                                icon={<PlusCircle size={18} />}
                                label="Administrar"
                                active={activeItem === "Administrar"}
                                onClick={() => {
                                    setActiveItem("Administrar");
                                    setOpenAdminModal(true);
                                }}
                            />
                        </>
                    )}
                </nav>
            </div>

            {/* Modales */}
            <Dialog open={openAdminModal} onClose={() => setOpenAdminModal(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-7xl shadow-lg relative">
                        <Dialog.Title className="text-xl font-bold mb-4">
                            Administrar Productos y Adiciones
                        </Dialog.Title>

                        <AdminPanel />

                        <button
                            onClick={() => setOpenAdminModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                        >
                            ✕
                        </button>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <ModalPedidos open={openModalPedidos} onClose={() => setOpenModalPedidos(false)} />
        </aside>
    );
};

type SidebarItemProps = {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
};

const SidebarItem = ({ icon, label, active = false, onClick }: SidebarItemProps) => {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-all
                ${active ? "bg-yellow-400 text-white font-semibold" : "hover:bg-gray-100"}
            `}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
};
