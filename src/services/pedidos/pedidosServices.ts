// src/services/pedidos/pedidoService.ts

import type { CreatePedidoDto } from "../../components/context/orderContext";
import type { CreateAdicionDto } from "../adiciones/adicionesServices";
import { backApi } from "../baseUrl";
import type { CreateProductoDto } from "../productos/productoService";
export type EstadoPedido = "cancelado" | "entregado" | "pendiente";
export type ItemTipo = "producto" | "servicio";

/*export interface PedidoItemDto {
    itemTipo: ItemTipo;
    cantidad: number;
    precio_unitario: number;
    item_id: string;
    nombre: string;

}

export interface CreatePedidoDto {
    numeroPedido: string;
    fecha: string; // ISO string
    total: number;
    estado: EstadoPedido;
    direccion: string;
    comentario: string;
    usuario: string;
    items: PedidoItemDto[];
}*/

// Puedes ampliar según la respuesta del backend (por ejemplo, con un `id`)
export interface Pedido extends CreatePedidoDto {
    id: string;
}


const RESOURCE = "/pedidos";

export const pedidoService = {
    getAll: async (): Promise<Pedido[]> => {
        const res = await backApi.get(RESOURCE);
        return res.data;
    },

    getOne: async (id: string): Promise<Pedido> => {
        const res = await backApi.get(`${RESOURCE}/${id}`);
        return res.data;
    },

    create: async (data: any): Promise<Pedido> => {
        const res = await backApi.post(RESOURCE, data);
        return res.data;
    },

    update: async (id: string, data: Partial<CreatePedidoDto>): Promise<Pedido> => {
        const res = await backApi.put(`${RESOURCE}/${id}`, data);
        return res.data;
    },

    remove: async (id: string): Promise<void> => {
        await backApi.delete(`${RESOURCE}/${id}`);
    },
};
