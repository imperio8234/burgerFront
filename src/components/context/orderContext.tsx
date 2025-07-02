import { createContext, useContext, useState, } from "react";
import type { Adicion } from "../../services/adiciones/adicionesServices";
import type { Producto } from "../../services/productos/productoService";

type EstadoPedido = "cancelado" | "entregado" | "pendiente";

export type ItemTipo = "producto" | "servicio";

export interface PedidoItemDto {
    itemTipo: ItemTipo;
    cantidad: number;
    precio_unitario: number;
    item_id: string;
    nombre: string;
    adiciones: Adicion[];
    foto: string;
    acompanantes: Producto[];
}

export interface CreatePedidoDto {
    numeroPedido: string;
    fecha: string;
    total: number;
    estado: EstadoPedido;
    usuario: string;
    direccion: string;
    comentario: string;
    items: PedidoItemDto[];
}

interface PedidoContextType {
    pedido: CreatePedidoDto | null;
    setPedido: (pedido: CreatePedidoDto) => void;
    clearPedido: () => void;
    addItem: (item: PedidoItemDto) => void;
    removeItem: (item_id: string) => void;
}

const PedidoContext = createContext<PedidoContextType | undefined>(undefined);

export const PedidoProvider = ({ children }: { children: any }) => {
    const [pedido, setPedidoState] = useState<CreatePedidoDto | null>(null);

    const setPedido = (nuevoPedido: CreatePedidoDto) => {
        setPedidoState(nuevoPedido);
    };

    const clearPedido = () => {
        setPedidoState(null);
    };

    const addItem = (item: PedidoItemDto) => {
        if (!pedido) return;

        const updatedItems = [...pedido.items, item];
        const newTotal = updatedItems.reduce((sum, i) => sum + i.precio_unitario * i.cantidad, 0);

        setPedidoState({
            ...pedido,
            items: updatedItems,
            total: newTotal,
        });
    };

    const removeItem = (item_id: string) => {
        if (!pedido) return;

        const updatedItems = pedido.items.filter((item) => item.item_id !== item_id);
        const newTotal = updatedItems.reduce((sum, i) => sum + i.precio_unitario * i.cantidad, 0);

        setPedidoState({
            ...pedido,
            items: updatedItems,
            total: newTotal,
        });
    };

    return (
        <PedidoContext.Provider value={{ pedido, setPedido, clearPedido, addItem, removeItem }}>
            {children}
        </PedidoContext.Provider>
    );
};

export const usePedido = () => {
    const context = useContext(PedidoContext);
    if (!context) {
        throw new Error("usePedido debe usarse dentro de un PedidoProvider");
    }
    return context;
};
