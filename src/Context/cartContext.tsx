import { createContext, useContext, useEffect, useState } from "react";
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

    useEffect(() => {
      const pedidos = localStorage.getItem("pedidoVenta");
      setPedidoVenta(pedidos ? JSON.parse(pedidos) : null);
    }, [])
    

    const addItemToCart = (itemInsumo: ArticuloInsumo | null, itemManufacturado: ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number) => {
        if (pedidoVenta) {
            const existingItem = pedidoVenta?.pedidoVentaDetalle?.find((detalle) => {
                if(itemManufacturado) {
                    return detalle.articuloManufacturado?.id === itemManufacturado?.id
                }
                 else 
                    return detalle.articuloInsumo?.id === itemInsumo?.id
                });
            if (existingItem) {
                const newDetails = pedidoVenta?.pedidoVentaDetalle?.map((detalle) => {
                    if ((itemManufacturado && detalle.articuloManufacturado?.id === itemManufacturado?.id) || (itemInsumo && detalle.articuloInsumo?.id === itemInsumo?.id)) {
                        return {
                            ...detalle,
                            cantidad: detalle.cantidad + cantidad,
                            subTotal: detalle.articuloInsumo ? (detalle.articuloInsumo.precioVenta as number) * (detalle.cantidad + cantidad) : (detalle.articuloManufacturado?.precioVenta as number) * (detalle.cantidad + cantidad)
                        };
                    }
                    return detalle;
                });
                if(itemInsumo) {
                    const total = pedidoVenta.total + (itemInsumo?.precioVenta as number) * cantidad
                    const totalCosto = pedidoVenta.totalCosto + (itemInsumo?.precioCompra as number) * cantidad 
                    setPedidoVenta({
                        ...pedidoVenta,
                        total,
                    totalCosto,
                        pedidoVentaDetalle: newDetails || []
                    });
                } else {
                    const total = pedidoVenta.total + (itemManufacturado?.precioVenta as number) * cantidad
                    const totalCosto = pedidoVenta.totalCosto + (itemManufacturado?.precioCosto as number) * cantidad 
                    setPedidoVenta({
                        ...pedidoVenta,
                        total,
                    totalCosto,
                        pedidoVentaDetalle: newDetails ||[]
                    });
                }
            } else {
                if(itemInsumo) {
                    setPedidoVenta({
                        ...pedidoVenta,

                        total: pedidoVenta.total + (itemInsumo?.precioVenta as number) * cantidad || pedidoVenta.total,
                        totalCosto: pedidoVenta.totalCosto + (itemInsumo?.precioCompra as number) * cantidad || pedidoVenta.totalCosto,
                        pedidoVentaDetalle: [
                            ...pedidoVenta?.pedidoVentaDetalle || [],
                            {
                                id: null,
                                cantidad,
                                subTotal: (itemInsumo?.precioVenta as number) * cantidad || 0,
                                articuloManufacturado: null,
                                articuloInsumo: itemInsumo,
                                promocion: promocion && [promocion]
                            }
                        ]
                    })
                } else {

                    setPedidoVenta({
                        ...pedidoVenta,
                        total: pedidoVenta.total + (itemManufacturado?.precioVenta as number) * cantidad,
                    totalCosto: pedidoVenta.totalCosto + (itemManufacturado?.precioCosto as number) * cantidad,
                        pedidoVentaDetalle: [
                            ...pedidoVenta.pedidoVentaDetalle || [],
                            {
                                id: null,
                                cantidad,
                                subTotal: (itemManufacturado?.precioVenta as number) * cantidad || 0,
                                articuloManufacturado: itemManufacturado,
                                articuloInsumo: itemInsumo,
                                promocion: promocion && [promocion]
                            }
                        ]
                    });
                }
            }
        } else {
            setPedidoVenta({
                id: null,
                horaEstimadaFinalizacion: new Date(),
                subtotal: 0,
                descuento: 0,
                gastosEnvio: 0,
                total: (itemInsumo?.precioVenta as number) * cantidad || (itemManufacturado?.precioVenta as number) * cantidad || 0,
                totalCosto: (itemInsumo?.precioCompra as number) * cantidad || (itemManufacturado?.precioCosto as number) * cantidad || 0,
                estado: Estado.PENDIENTE.toUpperCase(),
                tipoEnvio: TipoEnvio.DELIVERY.toUpperCase(),
                formaPago: FormaPago.EFECTIVO.toUpperCase(),
                empleado: null,
                sucursal: null,
                cliente: null,
                factura: null,
                pedidoVentaDetalle: [
                    {
                        id: null,
                        cantidad,
                        subTotal: (itemInsumo?.precioVenta as number) * cantidad || (itemManufacturado?.precioVenta as number) * cantidad || 0,
                        articuloManufacturado: itemManufacturado,
                        articuloInsumo: itemInsumo,
                        promocion: promocion && [promocion]
                    }
                ],
                fechaPedido: new Date(),
                alta: null,
                baja: null,
                modificacion: null
            });
        }
        localStorage.setItem("pedidoVenta", JSON.stringify(pedidoVenta));
    };

    const removeItemFromCart = (itemId: string) => {
        if (pedidoVenta) {
            const item = pedidoVenta.pedidoVentaDetalle?.find((detalle) => {
                if(detalle.articuloManufacturado) {
                    return detalle.articuloManufacturado.id === itemId
                }
                 else 
                    return detalle.articuloInsumo?.id === itemId
                });
                const total = pedidoVenta.total - (item?.subTotal as number)
                const totalCosto = pedidoVenta.totalCosto - (item?.subTotal as number)
            setPedidoVenta({
                ...pedidoVenta,
                total,
                totalCosto,
                subtotal: total,
                pedidoVentaDetalle: pedidoVenta.pedidoVentaDetalle?.filter((detalle) => detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId) || null
            });
            localStorage.setItem("pedidoVenta", JSON.stringify(pedidoVenta));
        }
    };

    const clearCart = () => {
        setPedidoVenta(null);
        localStorage.removeItem("pedidoVenta");
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