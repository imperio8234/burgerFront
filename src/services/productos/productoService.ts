import type { PedidoItemDto } from "../../components/context/orderContext";
import { backApi } from "../baseUrl";


// DTO exacto según tu backend
export interface CreateProductoDto {
    nombre: string;
    ingredientes: string;
    precio: number;
    descripcion: string;
    tipo: string; // Ej: "hamburguesa" | "gaseosa"
    foto: File | string;
    acompanantes?: PedidoItemDto[];
}

export interface Producto extends CreateProductoDto {
    id: string;
    creadoEn?: string;
}

export const productoService = {
    /**
     * Crear producto
     */
    async create(data: CreateProductoDto): Promise<Producto> {
        try {
            const formData = new FormData();
            formData.append("nombre", data.nombre);
            formData.append("ingredientes", data.ingredientes);
            formData.append("precio", data.precio.toString());
            formData.append("descripcion", data.descripcion);
            formData.append("tipo", data.tipo);

            // Verifica si 'foto' es un archivo (File o Blob)
            if (data.foto instanceof File || typeof data.foto === "object") {
                formData.append("foto", data.foto); // ⬅️ clave debe coincidir con @UploadedFile('foto')
            }

            const res = await backApi.post("/productos", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Error al crear producto");
        }
    },
    /**
     * Obtener todos los productos
     */
    async getAll(): Promise<Producto[]> {
        try {
            const res = await backApi.get("/productos");
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Error al obtener productos");
        }
    },

    /**
     * Obtener producto por ID
     */
    async getById(id: string): Promise<Producto> {
        try {
            const res = await backApi.get(`/productos/${id}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Producto no encontrado");
        }
    },

    /**
     * Actualizar producto
     */
    async update(id: string, data: Partial<CreateProductoDto>): Promise<Producto> {
        try {
            const formData = new FormData();
            if (data.nombre) formData.append("nombre", data.nombre);
            if (data.ingredientes) formData.append("ingredientes", data.ingredientes);
            if (data.precio !== undefined) formData.append("precio", data.precio.toString());
            if (data.descripcion) formData.append("descripcion", data.descripcion);
            if (data.tipo) formData.append("tipo", data.tipo);

            if (data.foto instanceof File || typeof data.foto === "object") {
                formData.append("foto", data.foto); // clave 'foto' esperada por backend
            }

            const res = await backApi.put(`/productos/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Error al actualizar producto");
        }
    },

    /**
     * Eliminar producto
     */
    async delete(id: string): Promise<{ message: string }> {
        try {
            const res = await backApi.delete(`/productos/${id}`);
            return res.data;
        } catch (error: any) {
            throw new Error(error?.response?.data?.message || "Error al eliminar producto");
        }
    },
};
