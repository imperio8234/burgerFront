import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FileText, Clock } from "lucide-react";
import { pedidoService } from "../../services/pedidos/pedidosServices";

export const ModalPedidos = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [pedidos, setPedidos] = useState<any[]>([]);
    const [vista, setVista] = useState<"historial" | "todos">("historial");

    useEffect(() => {
        if (open) {
            pedidoService.getAll().then(setPedidos);
        }
    }, [open]);
    console.log("pedidos", pedidos)
    const resumen = {
        pendientes: pedidos.filter((p: any) => p.estado === "pendiente").length,
        entregados: pedidos.filter((p: any) => p.estado === "entregado").length,
        cancelados: pedidos.filter((p: any) => p.estado === "cancelado").length,
    };

    const pedidosMostrar = vista === "historial"
        ? pedidos.slice(-5).reverse()
        : pedidos;

    return (
        <Dialog open={open} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
                <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-6 relative">
                    <Dialog.Title className="text-xl font-bold mb-4">Gestión de Pedidos</Dialog.Title>

                    {/* Botones de filtro */}
                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={() => setVista("historial")}
                            className={`px-4 py-2 rounded-full text-sm ${vista === "historial"
                                ? "bg-yellow-400 text-white font-semibold"
                                : "bg-gray-100 text-gray-700 hover:bg-yellow-100"
                                }`}
                        >
                            <Clock size={16} className="inline mr-1" /> Últimos Pedidos
                            {resumen.pendientes > 0 && vista === "historial" && (
                                <span className="ml-2 bg-white text-yellow-500 px-2 py-0.5 rounded-full text-xs">
                                    {resumen.pendientes}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setVista("todos")}
                            className={`px-4 py-2 rounded-full text-sm ${vista === "todos"
                                ? "bg-blue-500 text-white font-semibold"
                                : "bg-gray-100 text-gray-700 hover:bg-blue-100"
                                }`}
                        >
                            <FileText size={16} className="inline mr-1" /> Todos los Pedidos
                        </button>
                    </div>

                    {/* Tarjetas resumen */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-yellow-600">Pendientes</h4>
                            <p className="text-lg font-bold text-yellow-700">{resumen.pendientes}</p>
                        </div>
                        <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-green-600">Entregados</h4>
                            <p className="text-lg font-bold text-green-700">{resumen.entregados}</p>
                        </div>
                        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                            <h4 className="text-sm font-medium text-red-600">Cancelados</h4>
                            <p className="text-lg font-bold text-red-700">{resumen.cancelados}</p>
                        </div>
                    </div>

                    {/* Tabla de pedidos */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden text-sm">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-2 text-left">N° Pedido</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2 text-left">Total</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                    <th className="px-4 py-2 text-left">Dirección</th>
                                    <th className="px-4 py-2 text-left">Usuario</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-800">
                                {pedidosMostrar.map((pedido: any) => (
                                    <tr key={pedido.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-2">{pedido.numeroPedido}</td>
                                        <td className="px-4 py-2">{new Date(pedido.fecha).toLocaleString()}</td>
                                        <td className="px-4 py-2">${pedido.total.toFixed(2)}</td>
                                        <td className="px-4 py-2 capitalize">{pedido.estado}</td>
                                        <td className="px-4 py-2">{pedido.direccion}</td>
                                        <td className="px-4 py-2">{pedido.usuario?.nombre || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-lg"
                    >
                        ✕
                    </button>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
