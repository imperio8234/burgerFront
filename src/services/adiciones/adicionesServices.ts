import { AxiosError } from "axios";
import { backApi } from "../baseUrl";

export type TipoProducto = "salsa" | "producto";
export interface Adicion {
    nombre: string;
    precio: number;
    descripcion: string;
    tipo: TipoProducto;
    foto: string;
}

export interface CreateAdicionDto {
    nombre: string;
    precio: number;
    tipo: string;
    foto?: string;
}

export interface Adicion extends CreateAdicionDto {
  id: string;
}

export const adicionesService = {
    async getAll(): Promise<Adicion[]> {
        try {
            const { data } = await backApi.get("/adiciones");
            return data;
        } catch (error: any) {
            handleAxiosError(error);
        }
    },

    async getById(id: string): Promise<Adicion> {
        try {
            const { data } = await backApi.get(`/adiciones/${id}`);
            return data;
        } catch (error: any) {
            handleAxiosError(error);
        }
    },

    async create(payload: CreateAdicionDto): Promise<Adicion> {
        try {
            const { data } = await backApi.post("/adiciones", payload);
            return data;
        } catch (error: any) {
            handleAxiosError(error);
        }
    },

    async update(id: string, payload: Partial<CreateAdicionDto>): Promise<Adicion> {
        try {
            const { data } = await backApi.put(`/adiciones/${id}`, payload);
            return data;
        } catch (error: any) {
            handleAxiosError(error);
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await backApi.delete(`/adiciones/${id}`);
        } catch (error: any) {
            handleAxiosError(error);
        }
    },
};

// Manejador de errores
function handleAxiosError(error: AxiosError | any): never {
    const message =
        error?.response?.data?.message || error?.message || "Error desconocido";
    throw new Error(message);
}
