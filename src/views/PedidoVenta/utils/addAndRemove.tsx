import { addMinutes } from "date-fns";
import { Estado } from "../../../enums/Estado";
import { FormaPago } from "../../../enums/FormaPago";
import { TipoEnvio } from "../../../enums/TipoEnvio";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../../../interfaces/ArticuloManufacturado";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import { Promocion } from "../../../interfaces/Promocion";


export const addItemToCart = (itemInsumo: ArticuloInsumo | null, itemManufacturado: ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number, pedidoVenta: PedidoVenta | null) => {
    if (pedidoVenta) {
        const existingItem = pedidoVenta?.pedidoVentaDetalle?.find((detalle) => {
            if (itemManufacturado) {
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
            if (itemInsumo) {
                const total = pedidoVenta.total + (itemInsumo?.precioVenta as number) * cantidad
                const totalCosto = pedidoVenta.totalCosto + (itemInsumo?.precioCompra as number) * cantidad
                return {
                    ...pedidoVenta,
                    total,
                    subTotal: total,
                    totalCosto,
                    pedidoVentaDetalle: newDetails || []
                };
            } else {
                const total = pedidoVenta.total + (itemManufacturado?.precioVenta as number) * cantidad
                const totalCosto = pedidoVenta.totalCosto + (itemManufacturado?.precioCosto as number) * cantidad
                return {
                    ...pedidoVenta,
                    horaEstimadaFinalizacion: pedidoVenta.horaEstimadaFinalizacion && addMinutes(pedidoVenta.horaEstimadaFinalizacion, itemManufacturado?.tiempoEstimado as number),
                    total,
                    subTotal: total,
                    totalCosto,
                    pedidoVentaDetalle: newDetails || []
                };
            }
        } else {
            if (itemInsumo) {
                return {
                    ...pedidoVenta,

                    total: pedidoVenta.total + (itemInsumo?.precioVenta as number) * cantidad || pedidoVenta.total,
                    subTotal: pedidoVenta.total + (itemInsumo?.precioVenta as number) * cantidad || pedidoVenta.total,
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
                }
            } else {

                return {
                    ...pedidoVenta,
                    horaEstimadaFinalizacion: pedidoVenta.horaEstimadaFinalizacion && addMinutes(pedidoVenta.horaEstimadaFinalizacion, itemManufacturado?.tiempoEstimado as number),
                    total: pedidoVenta.total + (itemManufacturado?.precioVenta as number) * cantidad,
                    subtotal: pedidoVenta.total + (itemManufacturado?.precioVenta as number) * cantidad,
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
                };
            }
        }
    } else {
        return {
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
        };
    }
};

export const removeItemFromCart = (itemId: string, pedidoVenta: PedidoVenta | null) => {
    if (pedidoVenta) {
        const item = pedidoVenta.pedidoVentaDetalle?.find((detalle) => {
            if (detalle.articuloManufacturado) {
                return detalle.articuloManufacturado.id === itemId
            }
            else
                return detalle.articuloInsumo?.id === itemId
        });
        const total = pedidoVenta.total - (item?.subTotal as number)
        const totalCosto = pedidoVenta.totalCosto - (item?.subTotal as number)
        const horaEstimadaFinalizacion = pedidoVenta.horaEstimadaFinalizacion && item?.articuloManufacturado ?
        addMinutes(pedidoVenta.horaEstimadaFinalizacion, item?.articuloManufacturado?.tiempoEstimado as number): pedidoVenta.horaEstimadaFinalizacion;
        return {
            ...pedidoVenta,
            total,
            totalCosto,
            subtotal: total,
            horaEstimadaFinalizacion,
            pedidoVentaDetalle: pedidoVenta.pedidoVentaDetalle?.filter((detalle) => detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId) || null
        };
    }
};
