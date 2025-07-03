import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AuthButton } from "../buttons/AuthButton";
import { productoService, type Producto } from "../../services/productos/productoService";
import { usePedido } from "../context/orderContext";
import { adicionesService, type Adicion } from "../../services/adiciones/adicionesServices";
import { generarCodigoVerificacion } from "@/util/util";

export const MainContent = () => {
    const { user } = useAuth();
    const { pedido, setPedido, addItem } = usePedido();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
    const [adiciones, setAdiciones] = useState<Adicion[] | null>(null);
    const [selectedAdiciones, setSelectedAdiciones] = useState<Adicion[]>([]);
    const [selectedAcompanantes, setSelectedAcompanantes] = useState<Producto[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const cargarAdiciones = async () => {
        try {
            const getAllAdiciones = await adicionesService.getAll();
            setAdiciones(getAllAdiciones);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await productoService.getAll();
                setProductos(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        cargarAdiciones();
        cargarProductos();
    }, []);

    const createPedido = () => {
        if (!pedido) {
            const numeroPedi = generarCodigoVerificacion();
            setPedido({
                numeroPedido: numeroPedi,
                fecha: "string",
                total: 3,
                estado: "pendiente",
                usuario: "string",
                items: [],
                direccion: "",
                comentario: ""
            });
        }
    };

    const productosFiltrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
            {user ? (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Hello, {user?.user?.nombre ?? ""}</h2>
                    <div className="relative w-1/3">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Que quieres hoy "
                            className="w-full border border-gray-300 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <AuthButton />
            )}

            <div className="bg-yellow-400 rounded-xl p-6 flex justify-between items-center text-white mb-8 mt-6">
                <div>
                    <h3 className="text-lg font-bold mb-1">Obtén un cupón de descuento de hasta el 20%</h3>
                    <p className="text-xs w-2/3">Aprovecha esta promoción exclusiva por tiempo limitado.</p>
                </div>
                <img src="https://i.ibb.co/sCcbB6q/discount-lady.png" alt="Descuento" className="h-20" />
            </div>

            <section className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-800">Productos</h4>
                    <button className="text-xs text-yellow-500 font-medium">View all</button>
                </div>

                {loading ? (
                    <p className="text-sm text-gray-500">Cargando productos...</p>
                ) : error ? (
                    <p className="text-sm text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {productosFiltrados.map((producto) => (
                            <div
                                key={producto.id}
                                onClick={() => {
                                    setSelectedProduct(producto);
                                    createPedido();
                                }}
                                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition relative cursor-pointer"
                            >
                                <div
                                    className="h-24 w-full bg-cover bg-center mb-3 rounded"
                                    style={{ backgroundImage: `url(${producto.foto})` }}
                                />
                                <h5 className="text-sm font-medium mb-1">{producto.nombre}</h5>
                                <p className="text-xs text-gray-500 mb-1">{producto.descripcion}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-yellow-500 font-bold text-sm">${producto.precio}</span>
                                    <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-lg">+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Modal producto */}
            <Dialog
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                className="fixed inset-0 z-50 flex items-center justify-center"
            >
                <div className="fixed inset-0 bg-black/40" />
                {selectedProduct && (
                    <Dialog.Panel className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl relative z-50 border border-red-600">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute right-5 top-5 text-red-600 hover:text-red-800"
                        >
                            <X size={24} />
                        </button>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="rounded-lg overflow-hidden">
                                <img
                                    src={
                                        typeof selectedProduct.foto === "string"
                                            ? selectedProduct.foto
                                            : selectedProduct.foto
                                                ? URL.createObjectURL(selectedProduct.foto)
                                                : ""
                                    }
                                    alt={selectedProduct.nombre}
                                    className="w-full h-64 object-cover rounded-md shadow"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-1 uppercase tracking-wide">
                                    {selectedProduct.nombre}
                                </h2>
                                <p className="text-gray-600 mb-2 text-sm">{selectedProduct.descripcion}</p>
                                <p className="text-red-600 font-extrabold text-xl mb-4">${selectedProduct.precio}</p>

                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Adiciones</h3>
                                    <div className="flex flex-col gap-2 text-sm text-gray-800">
                                        {adiciones?.map((adicion, i) => (
                                            <label key={i} className="flex gap-10">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={selectedAdiciones.some((a) => a.id === adicion.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setSelectedAdiciones((prev) =>
                                                            checked
                                                                ? [...prev, adicion]
                                                                : prev.filter((a) => a.id !== adicion.id)
                                                        );
                                                    }}
                                                />
                                                <p>{adicion.nombre}</p>
                                                <p>{adicion.precio}</p>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Acompañantes</h3>
                                    <div className="flex flex-col gap-2 text-sm text-gray-800">
                                        {productos.filter((producto) => producto.tipo === "acompañantes").map((pro) => (
                                            <label className="flex gap-10" key={pro.id}>
                                                <input
                                                    type="checkbox"
                                                    className="mr-2"
                                                    checked={selectedAcompanantes.some((a) => a.id === pro.id)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setSelectedAcompanantes((prev) =>
                                                            checked
                                                                ? [...prev, pro]
                                                                : prev.filter((a) => a.id !== pro.id)
                                                        );
                                                    }}
                                                />
                                                <p>{pro.nombre}</p>
                                                <p>${pro.precio}</p>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!selectedProduct) return;
                                        addItem({
                                            item_id: selectedProduct.id,
                                            itemTipo: "producto",
                                            cantidad: 1,
                                            precio_unitario: selectedProduct.precio,
                                            adiciones: selectedAdiciones,
                                            acompanantes: selectedAcompanantes,
                                            nombre: selectedProduct.nombre,
                                            foto: selectedProduct.foto
                                        });

                                        setSelectedProduct(null);
                                        setSelectedAdiciones([]);
                                    }}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-md transition"
                                >
                                    Agregar al pedido
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                )}
            </Dialog>
        </main>
    );
};
