import {

    UploadCloud,
    RefreshCw,
    MapPin,
    MoreHorizontal,
    Trash2,
    CheckCircle,
    LogOut
} from "lucide-react";
import { AuthButton } from "../buttons/AuthButton";
import { useAuth } from "../context/AuthContext";
import { usePedido } from "../context/orderContext";
import { useState } from "react";
import { pedidoService } from "../../services/pedidos/pedidosServices";
import { showNotification } from "../buttons/notify";
import { emailService } from "@/services/emailServices/emailServices";

export const RightPanel = () => {
    const { user, logout } = useAuth();
    const { pedido, setPedido, clearPedido, removeItem } = usePedido();
    const [showModalConfirmacion, setShowModalConfirmacion] = useState(false);

    const total = pedido?.items.reduce((sum, item) => {
        const adicionesTotal = item.adiciones?.reduce((acc, a) => acc + a.precio, 0) || 0;
        const acompanantesTotal = item.acompanantes?.reduce((acc, a) => acc + a.precio, 0) || 0;
        const itemTotal = (item.precio_unitario + adicionesTotal + acompanantesTotal) * item.cantidad;
        return sum + itemTotal;
    }, 0) ?? 0;


    const logOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        logout();
    }

    const finalizarPedido = async () => {
        if (!pedido?.direccion || pedido.direccion.trim() === "") {
            showNotification("info", "Por favor, proporciona una dirección para tu pedido.");
            return;
        }

        try {
            const pedidoFinal = {
                ...pedido,
                total: total + 1,
                estado: "pendiente",
                fecha: new Date().toISOString(),
                usuario: user?.user?.sub || "sin-usuario"
            };

            const crearPedi = await pedidoService.create(pedidoFinal);
            await emailService.enviarCorreoBienvenida({
                correo: user.user.correo,
                nombre: user.user.nombre,
                pedido: pedidoFinal

            });

            console.log("pedido", crearPedi);

            clearPedido();
            setShowModalConfirmacion(false);
            showNotification("success", "¡Pedido enviado correctamente!");
        } catch (err) {
            console.error("Error enviando el pedido:", err);
            showNotification("error", "Ocurrió un error al enviar el pedido.");
        }
    };


    return (
        <aside className="w-96 h-screen bg-white shadow-md p-6 flex flex-col justify-between text-sm">
            {/* Header */}
            {user ? (
                <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-3">
                        <LogOut className="text-yellow-500 cursor-pointer" onClick={() => logOut()} size={18} />
                        <UploadCloud className="text-gray-500" size={18} />
                        <RefreshCw className="text-gray-500" size={18} />
                    </div>
                    <img
                        src={user?.user?.foto || "https://i.pravatar.cc/40"}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full"
                    />
                </div>
            ) : (
                <AuthButton />
            )}

            {/* Balance */}
            <section className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Your Balance</h4>
                <div className="bg-yellow-400 rounded-xl p-4 text-white mb-3">
                    <p className="text-sm">Balance</p>
                    <h2 className="text-2xl font-bold">$12.000</h2>
                    <div className="flex gap-2 mt-3">
                        <button className="bg-white text-yellow-500 text-xs px-3 py-1 rounded-md font-medium flex-1">
                            Top Up
                        </button>
                        <button className="bg-white text-yellow-500 text-xs px-3 py-1 rounded-md font-medium flex-1">
                            Transfer
                        </button>
                    </div>
                </div>
            </section>

            {/* Dirección */}
            <section className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Tu dirección</h4>
                <div className="flex items-start gap-2 text-gray-600 text-xs mb-2">
                    <MapPin className="mt-1 text-yellow-500" size={16} />
                    <input
                        type="text"
                        placeholder="Dirección de entrega"
                        value={pedido?.direccion || ""}
                        onChange={(e) =>
                            pedido &&
                            setPedido({
                                ...pedido,
                                direccion: e.target.value,
                            })
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs"
                    />
                </div>
            </section>

            {/* Comentario */}
            <section className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Comentario</h4>
                <textarea
                    placeholder="¿Deseas dejar una nota para el pedido?"
                    value={pedido?.comentario || ""}
                    onChange={(e) =>
                        pedido &&
                        setPedido({
                            ...pedido,
                            comentario: e.target.value,
                        })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-1 text-xs"
                    rows={2}
                />
            </section>

            {/* Pedido */}
            <section className="mb-6">
                <h4 className="font-semibold text-gray-700 mb-2">Order Menu</h4>
                {pedido?.items.length ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {pedido.items.map((item) => (
                            <div key={item.item_id} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="text-xl">
                                        {item.itemTipo === "producto" ? "🍔" : "🔧"}
                                    </div>
                                    <span className="text-xs">
                                        {item.nombre} x {item.cantidad}
                                    </span>
                                    <div className="ml-6 text-[11px] text-gray-500">
                                        {item.adiciones?.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Adiciones:</span>{" "}
                                                {item.adiciones.map((a) => a.nombre).join(", ")}
                                            </div>
                                        )}
                                        {item.acompanantes?.length > 0 && (
                                            <div>
                                                <span className="font-semibold">Acompañantes:</span>{" "}
                                                {item.acompanantes.map((a) => a.nombre).join(", ")}
                                            </div>
                                        )}
                                    </div>

                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-800 text-xs">
                                        ${(item.precio_unitario * item.cantidad).toFixed(2)}
                                    </span>
                                    <button
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => removeItem(item.item_id)}
                                        title="Eliminar"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400">No hay ítems en el pedido.</p>
                )}
            </section>

            {/* Total y acciones */}
            <section>
                <div className="flex justify-between text-gray-600 text-xs mb-1">
                    <span>Service</span>
                    <span>$1.00</span>
                </div>
                <div className="flex justify-between text-md font-bold mb-3">
                    <span>Total</span>
                    <span>${(total + 1).toFixed(2)}</span>
                </div>

                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder="Have a coupon code?"
                        className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-xs"
                    />
                    <MoreHorizontal className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={clearPedido}
                        className="w-full bg-gray-100 text-gray-600 py-2 rounded-xl text-sm flex items-center justify-center gap-1 hover:bg-gray-200"
                    >
                        <Trash2 size={16} /> Vaciar Pedido
                    </button>
                    <button
                        disabled={!pedido || pedido.items.length === 0}
                        onClick={() => setShowModalConfirmacion(true)}
                        className="w-full bg-yellow-400 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 hover:bg-yellow-500 disabled:opacity-50"
                    >
                        <CheckCircle size={16} />
                        Finalizar Pedido
                    </button>

                </div>
            </section>
            {showModalConfirmacion && pedido && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-40 flex items-center justify-center z-50 font-sans">
                    <div className="bg-white rounded-2xl shadow-2xl w-[620px] p-8 max-h-[90vh] overflow-y-auto relative">

                        <button
                            onClick={() => setShowModalConfirmacion(false)}
                            className="absolute right-5 top-5 text-gray-400 hover:text-red-500 text-xl"
                        >
                            ✕
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-6">You're almost there!</h2>

                        {/* Información del Pedido */}
                        <div className="text-sm text-gray-700 space-y-1 mb-6">
                            <p><strong>Pedido:</strong> #{pedido.numeroPedido}</p>
                            <p><strong>Fecha:</strong> {pedido.fecha}</p>
                            <p><strong>Estado:</strong> {pedido.estado}</p>
                            <p><strong>Usuario:</strong> {pedido.usuario}</p>
                            {pedido.direccion && <p><strong>Dirección:</strong> {pedido.direccion}</p>}
                            {pedido.comentario && <p><strong>Comentario:</strong> {pedido.comentario}</p>}
                        </div>

                        {/* Productos */}
                        <div className="space-y-5 mb-6">
                            {pedido.items.map((item, index) => (
                                <div key={item.item_id || index} className="flex gap-4 items-start border-b pb-4">
                                    <img
                                        src={
                                            typeof item.foto === "string"
                                                ? item.foto
                                                : item.foto instanceof File
                                                    ? URL.createObjectURL(item.foto)
                                                    : "https://via.placeholder.com/60"
                                        }
                                        alt={item.nombre}
                                        className="w-14 h-14 rounded-lg object-cover border"
                                    />

                                    <div className="flex-1 text-sm">
                                        <p className="font-semibold text-gray-800">{item.nombre}</p>
                                        <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                                        <p className="text-gray-600">Precio unitario: ${item.precio_unitario}</p>

                                        {/* Adiciones */}
                                        {item.adiciones?.length > 0 && (
                                            <div className="mt-1 text-xs text-gray-500">
                                                <p className="font-semibold mb-1">Adiciones:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {item.adiciones.map((a) => (
                                                        <li key={a.id}>
                                                            {a.nombre} (${a.precio})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Acompañantes */}
                                        {item.acompanantes?.length > 0 && (
                                            <div className="mt-1 text-xs text-gray-500">
                                                <p className="font-semibold mb-1">Acompañantes:</p>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {item.acompanantes.map((a) => (
                                                        <li key={a.id}>
                                                            {a.nombre} (${a.precio})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="text-right mb-6">
                            <p className="text-sm text-gray-600">Shipping: <strong className="text-black">Free</strong></p>
                            <p className="text-lg font-bold text-gray-900">Total: ${pedido.total.toFixed(2)}</p>
                        </div>

                        {/* Método de pago */}
                        <div className="mb-6 space-y-4">
                            <p className="text-sm font-semibold text-gray-800">Payment Method</p>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input type="radio" name="payment" defaultChecked className="accent-purple-600" />
                                    Credit Card
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700">
                                    <input type="radio" name="payment" className="accent-purple-600" />
                                    Paypal
                                </label>
                            </div>

                            {/* Campos de tarjeta */}
                            <div className="space-y-2 text-sm">
                                <input
                                    type="text"
                                    placeholder="Name on Card"
                                    className="w-full border rounded-md px-3 py-2 text-gray-700"
                                    defaultValue="John Center"
                                />
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="w-full border rounded-md px-3 py-2 text-gray-700"
                                    defaultValue="•••• •••• •••• 2153"
                                />
                                <div className="flex gap-2">
                                    <select className="flex-1 border rounded-md px-2 py-2 text-gray-700">
                                        <option value="05">05</option>
                                        <option value="06">06</option>
                                        <option value="07">07</option>
                                    </select>
                                    <select className="flex-1 border rounded-md px-2 py-2 text-gray-700">
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="CVV"
                                        className="w-[60px] border rounded-md px-2 py-2 text-gray-700"
                                        defaultValue="156"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={finalizarPedido}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-full transition"
                        >
                            Check Out
                        </button>
                    </div>
                </div>
            )}



        </aside>
    );
};
