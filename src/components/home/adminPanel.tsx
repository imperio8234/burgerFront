import { useEffect, useRef, useState } from "react";
import { productoService, type CreateProductoDto, type Producto } from "../../services/productos/productoService";
import { adicionesService, type Adicion, type CreateAdicionDto } from "../../services/adiciones/adicionesServices";
import { userService, type CreateUsuarioDto, type Usuario } from "../../services/user/userServices";
import { Users, Sandwich, PlusCircle, Plus } from "lucide-react";

export const AdminPanel = () => {
    const [producto, setProducto] = useState<CreateProductoDto>({
        nombre: "", ingredientes: "", precio: 0, descripcion: "", tipo: "", foto: ""
    });
    const [adicion, setAdicion] = useState<CreateAdicionDto>({
        nombre: "", precio: 0, tipo: "producto", foto: ""
    });
    const [nuevoUsuario, setNuevoUsuario] = useState<CreateUsuarioDto>({
        nombre: "",
        correo: "",
        rol: "cliente",
        foto: "",
        contrasena: ""
    });

    const [productos, setProductos] = useState<Producto[]>([]);
    const [adiciones, setAdiciones] = useState<Adicion[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [seccion, setSeccion] = useState("productos");
    const [showModal, setShowModal] = useState(false);
    const [previewFotoProducto, setPreviewFotoProducto] = useState<string | null>(null);
    const [previewFotoAdicion, setPreviewFotoAdicion] = useState<string | null>(null);
    const [previewFotoUsuario, setPreviewFotoUsuario] = useState<string | null>(null);
    const [editandoProducto, setEditandoProducto] = useState<Producto | null>(null);
    const [editandoAdicion, setEditandoAdicion] = useState<Adicion | null>(null);
    const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);


    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: "producto" | "adicion") => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (tipo === "producto") {
                    setProducto({ ...producto, foto: file }); 
                    setPreviewFotoProducto(reader.result as string);
                } else {
                    setAdicion({ ...adicion, foto: file.name });
                    setPreviewFotoAdicion(reader.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFoto = (tipo: "producto" | "adicion") => {
        if (tipo === "producto") {
            setPreviewFotoProducto(null);
            setProducto({ ...producto, foto: "" });
        } else {
            setPreviewFotoAdicion(null);
            setAdicion({ ...adicion, foto: "" });
        }
    };

    const handleFotoChangeUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNuevoUsuario({ ...nuevoUsuario, foto: file.name });
                setPreviewFotoUsuario(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFotoUsuario = () => {
        setPreviewFotoUsuario(null);
        setNuevoUsuario({ ...nuevoUsuario, foto: "" });
    };


    // Referencias para scroll
    const refProductos = useRef<HTMLDivElement>(null);
    const refAdiciones = useRef<HTMLDivElement>(null);
    const refUsuarios = useRef<HTMLDivElement>(null);


    const fetchData = async () => {
        setProductos(await productoService.getAll());
        setAdiciones(await adicionesService.getAll());
        setUsuarios(await userService.getAll());
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGuardarProducto = async () => {
        if (editandoProducto) {
            console.log("actualizando")
            await productoService.update(editandoProducto.id, producto);
        } else {
            console.log("creando", producto)
            await productoService.create(producto);
        }
        fetchData();
        setShowModal(false);
        setEditandoProducto(null);
    };


    const handleGuardarAdicion = async () => {
        if (editandoAdicion) {
            await adicionesService.update(editandoAdicion.id, adicion);
        } else {
            await adicionesService.create(adicion);
        }
        fetchData();
        setShowModal(false);
        setEditandoAdicion(null);
    };

    const handleGuardarUsuario = async () => {
        if (editandoUsuario) {
            await userService.update(editandoUsuario.id, nuevoUsuario);
        } else {
            await userService.register(nuevoUsuario);
        }
        fetchData();
        setShowModal(false);
        setEditandoUsuario(null);
    };



    const handleDeleteProducto = async (id: string) => {
        await productoService.delete(id);
        fetchData();
    };

    const handleDeleteAdicion = async (id: string) => {
        await adicionesService.delete(id);
        fetchData();
    };

    const handleDeleteUsuario = async (id: string) => {
        await userService.delete(id);
        fetchData();
    };

    const handleOpenModal = (item?: any) => {
        if (seccion === "productos" && item) {
            console.log("edicion", item)
            setEditandoProducto(item);
            setProducto({ ...item });
            setPreviewFotoProducto(item.foto || null);
        } else if (seccion === "adiciones" && item) {
            setEditandoAdicion(item);
            setAdicion({ ...item });
            setPreviewFotoAdicion(item.foto || null);
        } else if (seccion === "usuarios" && item) {
            setEditandoUsuario(item);
            setNuevoUsuario({ ...item, contrasena: "" });
            setPreviewFotoUsuario(item.foto || null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditandoProducto(null);
        setEditandoAdicion(null);
        setEditandoUsuario(null);
        setProducto({ nombre: "", ingredientes: "", precio: 0, descripcion: "", tipo: "", foto: "" });
        setAdicion({ nombre: "", precio: 0, tipo: "producto", foto: "" });
        setNuevoUsuario({ nombre: "", correo: "", rol: "cliente", foto: "", contrasena: "" });
        setPreviewFotoProducto(null);
        setPreviewFotoAdicion(null);
        setPreviewFotoUsuario(null);
    };



    return (
        <div className="p-6">

            {/* Botones de navegación */}
            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-4 mb-6">
                <button
                    onClick={() => setSeccion("productos")}
                    className={`flex flex-col items-center justify-center border rounded-lg p-4 text-sm transition ${seccion === "productos"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <Sandwich className="w-6 h-6 mb-1" />
                    <span>Productos</span>
                    <span className="text-xs"> en stock</span>
                </button>

                <button
                    onClick={() => setSeccion("adiciones")}
                    className={`flex flex-col items-center justify-center border rounded-lg p-4 text-sm transition ${seccion === "adiciones"
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <PlusCircle className="w-6 h-6 mb-1" />
                    <span>Adiciones</span>
                    <span className="text-xs"> en stock</span>
                </button>

                <button
                    onClick={() => setSeccion("usuarios")}
                    className={`flex flex-col items-center justify-center border rounded-lg p-4 text-sm transition ${seccion === "usuarios"
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    <Users className="w-6 h-6 mb-1" />
                    <span>Usuarios</span>
                    <span className="text-xs"> en stock</span>
                </button>
            </div>

            {/* Producto */}
            {
                seccion == "productos" &&
                <div ref={refProductos} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">


                    <div className="md:col-span-2">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-semibold mb-2">Productos Registrados</h3>
                            <div onClick={() => handleOpenModal()} className=" flex border rounded-2xl p-1 hover:bg-blue-600">
                                <Plus size={18} />
                                <p>Agregar</p>
                            </div>
                        </div>
                        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden text-sm">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nombre</th>
                                    <th className="px-4 py-3 text-left">Precio</th>
                                    <th className="px-4 py-3 text-left">Tipo</th>
                                    <th className="px-4 py-3 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-800">
                                {productos.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <img
                                                src={
                                                    typeof p.foto === "string"
                                                        ? p.foto
                                                        : p.foto instanceof File
                                                            ? URL.createObjectURL(p.foto)
                                                            : "/placeholder.png"
                                                }
                                                alt={p.nombre}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                            {p.nombre}
                                        </td>
                                        <td className="px-4 py-3">${p.precio.toFixed(2)}</td>
                                        <td className="px-4 py-3 capitalize">{p.tipo}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-2"
                                                onClick={() => handleOpenModal(p)} // o `a` o `u` según el caso
                                            >
                                                Editar
                                            </button>
                                            <button className="text-red-500 hover:text-red-700 text-sm font-medium" onClick={() => handleDeleteProducto(p.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            }

            {/* Adiciones */}
            {
                seccion == "adiciones"
                &&
                <div ref={refAdiciones} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">


                    <div className="md:col-span-2">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-semibold mb-2">Adiciones Registradas</h3>
                            <div onClick={() => handleOpenModal()} className=" flex border rounded-2xl p-1 hover:bg-blue-600">
                                <Plus size={18} />
                                <p>Agregar</p>
                            </div>
                        </div>
                        <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden text-sm">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-4 py-3 text-left">Nombre</th>
                                    <th className="px-4 py-3 text-left">Precio</th>
                                    <th className="px-4 py-3 text-left">Tipo</th>
                                    <th className="px-4 py-3 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-gray-800">
                                {adiciones.map((a) => (
                                    <tr key={a.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <img src={a.foto || '/placeholder.png'} alt={a.nombre} className="w-6 h-6 rounded-full object-cover" />
                                            {a.nombre}
                                        </td>
                                        <td className="px-4 py-3">${a.precio.toFixed(2)}</td>
                                        <td className="px-4 py-3 capitalize">{a.tipo}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-2"
                                                onClick={() => handleOpenModal(a)} // o `a` o `u` según el caso
                                            >
                                                Editar
                                            </button>
                                            <button className="text-red-500 hover:text-red-700 text-sm font-medium" onClick={() => handleDeleteAdicion(a.id)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            }

            {/* Usuarios */}
            {
                seccion == "usuarios"
                &&
                <div ref={refUsuarios}>
                    <div className="flex justify-between mb-2">
                        <h3 className="font-semibold mb-2">Usuarios Registrados</h3>
                        <div onClick={() => handleOpenModal()} className=" flex border rounded-2xl p-1 hover:bg-blue-600">
                            <Plus size={18} />
                            <p>Agregar</p>
                        </div>
                    </div>
                    <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden text-sm">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-4 py-3 text-left">Nombre</th>
                                <th className="px-4 py-3 text-left">Correo</th>
                                <th className="px-4 py-3 text-left">Rol</th>
                                <th className="px-4 py-3 text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-800">
                            {usuarios.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">{u.nombre}</td>
                                    <td className="px-4 py-3">{u.correo}</td>
                                    <td className="px-4 py-3 capitalize">{u.rol}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-2"
                                            onClick={() => handleOpenModal(u)} // o `a` o `u` según el caso
                                        >
                                            Editar
                                        </button>
                                        <button className="text-red-500 hover:text-red-700 text-sm font-medium" onClick={() => handleDeleteUsuario(u.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            }

            {showModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button onClick={handleCloseModal} className="absolute top-2 right-3 text-gray-500 hover:text-gray-800">✖</button>

                        {seccion === "productos" && (
                            <div className="border p-6 rounded-xl shadow bg-white space-y-4">
                                <h3 className="text-xl font-semibold text-gray-700">Registrar Producto</h3>

                                {/* Imagen */}
                                <div className="flex flex-col items-center">
                                    {previewFotoProducto ? (
                                        <div className="relative">
                                            <img src={previewFotoProducto} className="w-24 h-24 rounded-full object-cover shadow" />
                                            <button onClick={() => removeFoto("producto")} className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">×</button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer w-24 h-24 bg-orange-100 flex items-center justify-center rounded-full shadow hover:bg-orange-200">
                                            📷
                                            <input type="file" accept="image/*" onChange={(e) => handleFotoChange(e, "producto")} className="hidden" />
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre del producto"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Ingredientes"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setProducto({ ...producto, ingredientes: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Precio"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setProducto({ ...producto, precio: +e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Descripción"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setProducto({ ...producto, descripcion: e.target.value })}
                                    />
                                    <select
                                        value={producto.tipo}
                                        onChange={(e) => setProducto({ ...producto, tipo: e.target.value })}
                                        className="p-2 border rounded-lg w-full bg-white"
                                    >
                                        <option value="">Seleccionar tipo</option>
                                        <option value="acompañantes">Acompañantes</option>
                                        <option value="otros">Otros</option>
                                    </select>

                                </div>

                                <div className="text-right">
                                    <button onClick={handleGuardarProducto} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">
                                        Guardar Producto
                                    </button>
                                </div>
                            </div>

                        )}

                        {seccion === "adiciones" && (
                            <div className="border p-6 rounded-xl shadow bg-white space-y-4">
                                <h3 className="text-xl font-semibold text-gray-700">Registrar Adición</h3>

                                {/* Imagen */}
                                <div className="flex flex-col items-center">
                                    {previewFotoAdicion ? (
                                        <div className="relative">
                                            <img src={previewFotoAdicion} className="w-24 h-24 rounded-full object-cover shadow" />
                                            <button
                                                onClick={() => removeFoto("adicion")}
                                                className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer w-24 h-24 bg-orange-100 flex items-center justify-center rounded-full shadow hover:bg-orange-200">
                                            📷
                                            <input type="file" accept="image/*" onChange={(e) => handleFotoChange(e, "adicion")} className="hidden" />
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre de la adición"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setAdicion({ ...adicion, nombre: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Precio"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setAdicion({ ...adicion, precio: +e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tipo"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setAdicion({ ...adicion, tipo: e.target.value as any })}
                                    />
                                </div>

                                <div className="text-right">
                                    <button
                                        onClick={handleGuardarAdicion}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
                                    >
                                        Guardar Adición
                                    </button>
                                </div>
                            </div>

                        )}

                        {seccion === "usuarios" && (
                            <div className="border p-6 rounded-xl shadow bg-white space-y-4">
                                <h3 className="text-xl font-semibold text-gray-700">Registrar Usuario</h3>

                                {/* Avatar */}
                                <div className="flex flex-col items-center">
                                    {previewFotoUsuario ? (
                                        <div className="relative">
                                            <img src={previewFotoUsuario} className="w-24 h-24 rounded-full object-cover shadow" />
                                            <button
                                                onClick={removeFotoUsuario}
                                                className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer w-24 h-24 bg-orange-100 flex items-center justify-center rounded-full shadow hover:bg-orange-200">
                                            📷
                                            <input type="file" accept="image/*" onChange={handleFotoChangeUser} className="hidden" />
                                        </label>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo"
                                        className="p-2 border rounded-lg w-full"
                                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })}
                                    />
                                    <select
                                        value={nuevoUsuario.rol}
                                        onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.value as "admin" | "cliente" })}
                                        className="p-2 border rounded-lg w-full bg-white text-gray-700"
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>

                                </div>

                                <div className="text-right">
                                    <button
                                        onClick={() => {
                                            handleGuardarUsuario()
                                        }}
                                        className="bg-purple-600 text-white px-6 py-2 rounded-lg shadow hover:bg-purple-700 transition"
                                    >
                                        Guardar Usuario
                                    </button>
                                </div>
                            </div>

                        )}
                    </div>
                </div>
            )}

        </div>
    );
};
