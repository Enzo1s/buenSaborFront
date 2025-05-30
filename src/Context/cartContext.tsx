import { createContext, useContext, useState } from "react";
import { ArticuloInsumo } from "../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../interfaces/ArticuloManufacturado";
import { PedidoVenta } from "../interfaces/PedidoVenta";
import { Promocion } from "../interfaces/Promocion";
import { Estado } from "../enums/Estado";
import { TipoEnvio } from "../enums/TipoEnvio";
import { FormaPago } from "../enums/FormaPago";

interface CartContextType {
    pedidoVenta: PedidoVenta | null;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    addItemToCart: (itemInsumo: ArticuloInsumo | null, itemManufacturado: ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number) => void;
    removeItemFromCart: (itemId: string) => void;
    clearCart: () => void;
}

const CartContextType = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const addItemToCart = (itemInsumo: ArticuloInsumo | null, itemManufacturado:ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number) => {
        if (pedidoVenta) {
            const existingItem = pedidoVenta.pedidoVentaDetalle.find((detalle) => detalle.articuloManufacturado?.id === itemManufacturado?.id || detalle.articuloInsumo?.id === itemInsumo?.id);
            if (existingItem) {
                const newDetails = pedidoVenta?.pedidoVentaDetalle?.map((detalle) => {
                if (detalle.articuloManufacturado?.id === itemManufacturado?.id || detalle.articuloInsumo?.id === itemInsumo?.id) {
                    return {
                        ...detalle,
                        cantidad: detalle.cantidad + cantidad,
                        subTotal: detalle.articuloInsumo ? (detalle.articuloInsumo.precioVenta as number) * (detalle.cantidad + cantidad) : (detalle.articuloManufacturado?.precioVenta as number) * (detalle.cantidad + cantidad)
                    };
                }
                return detalle;
            });
             setPedidoVenta({
                    ...pedidoVenta,
                    pedidoVentaDetalle: newDetails
                });
            } else {
                setPedidoVenta({
                    ...pedidoVenta,
                    pedidoVentaDetalle: [
                        ...pedidoVenta.pedidoVentaDetalle,
                        { id: null,
                            cantidad,
                            subTotal: (itemInsumo?.precioVenta as number) * cantidad || (itemManufacturado?.precioVenta as number) * cantidad || 0,
                            articuloManufacturado: itemManufacturado,
                            articuloInsumo: itemInsumo,
                            promocion: promocion && [promocion] }
                    ]
                });
            }
        } else {
            setPedidoVenta({
                id: null,
                horaEstimadaFinalizacion: new Date(),
                subtotal: 0,
                descuento: 0,
                gastosEnvio: 0,
                total: 0,
                totalCosto: 0,
                estado: Estado.PENDIENTE,
                tipoEnvio: TipoEnvio.DELIVERY,
                formaPago: FormaPago.EFECTIVO,
                empleado: null,
                sucursal: null,
                cliente: null,
                factura: null,
                pedidoVentaDetalle: [
                    { id: null,
                            cantidad,
                            subTotal: (itemInsumo?.precioVenta as number) * cantidad || (itemManufacturado?.precioVenta as number) * cantidad || 0,
                            articuloManufacturado: itemManufacturado,
                            articuloInsumo: itemInsumo,
                            promocion: promocion && [promocion] }
                ],
                fechaPedido: new Date()
            });
        }
    };

    const removeItemFromCart = (itemId: string) => {
        if (pedidoVenta) {
            setPedidoVenta({
                ...pedidoVenta,
                pedidoVentaDetalle: pedidoVenta.pedidoVentaDetalle.filter((detalle) => detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId)
            });
        }
    };

    const clearCart = () => {
        setPedidoVenta(null);
    };

    const contextValue: CartContextType = {
        pedidoVenta,
        loading,
        setLoading,
        addItemToCart,
        removeItemFromCart,
        clearCart
    };
    return (
        <CartContextType.Provider value={contextValue}>
            {children}
        </CartContextType.Provider>
    );
}

export const useCartContext = () => {
    const context = useContext(CartContextType);
    if (!context) {
        throw new Error("useCartContext must be used within a CartProvider");
    }
    return context;
}