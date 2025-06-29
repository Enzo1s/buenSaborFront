import { addMinutes } from "date-fns";
import { Estado } from "../../../enums/Estado";
import { FormaPago } from "../../../enums/FormaPago";
import { TipoEnvio } from "../../../enums/TipoEnvio";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../../../interfaces/ArticuloManufacturado";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import { Promocion } from "../../../interfaces/Promocion";

const aplicaPromocion = (promocion: Promocion, insumo: ArticuloInsumo | null, manufacturado: ArticuloManufacturado | null) => {
    const tienePromo = promocion.promocionDetalle?.some(detalle => {
        if (detalle.articuloInsumo?.id && insumo?.id)
            return detalle.articuloInsumo?.id === insumo?.id
        else
            return detalle.articuloManufacturado?.id === manufacturado?.id
    })
    return tienePromo ? promocion : null
}

const promoInsumo = (promocion: Promocion, insumo: ArticuloInsumo | null) => {
    const tienePromo = promocion.promocionDetalle?.some(detalle => {
        if (detalle.articuloInsumo?.id && insumo?.id)
            return detalle.articuloInsumo?.id === insumo?.id
    })
    return tienePromo ? promocion : null
}

const promoManufacturado = (promocion: Promocion, manufacturado: ArticuloManufacturado | null) => {
    const tienePromo = promocion.promocionDetalle?.some(detalle => {
        if (detalle.articuloManufacturado?.id && manufacturado?.id)
            return detalle.articuloManufacturado?.id === manufacturado?.id

    })
    return tienePromo ? promocion : null
}

export const addItemToCart = (itemInsumo: ArticuloInsumo | null, itemManufacturado: ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number, pedidoVenta: PedidoVenta | null) => {
    const promocionInsumo = promocion ? promoInsumo(promocion, itemInsumo) : null
    const promocionManufacturado = promocion ? promoManufacturado(promocion, itemManufacturado) : null
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
                    const promoAplicada = promocion && aplicaPromocion(promocion, itemInsumo, itemManufacturado)
                    return {
                        ...detalle,
                        promocion: promoAplicada ? [promoAplicada] : null,
                        cantidad: detalle.cantidad + cantidad,
                        subTotal: detalle.articuloInsumo ? (detalle.articuloInsumo.precioVenta as number) * (detalle.cantidad + cantidad) : (detalle.articuloManufacturado?.precioVenta as number) * (detalle.cantidad + cantidad)
                    };
                }
                return detalle;
            });
            if (itemInsumo) {
                const subTotal = pedidoVenta.subtotal + (itemInsumo?.precioVenta as number) * cantidad
                const total = promocionInsumo ? subTotal - pedidoVenta.descuento - ((itemInsumo?.precioVenta as number) * cantidad * (promocionInsumo.descuento as number) / 100) : subTotal - pedidoVenta.descuento
                const totalCosto = pedidoVenta.totalCosto + (itemInsumo?.precioCompra as number) * cantidad
                return {
                    ...pedidoVenta,
                    total,
                    subtotal: subTotal,
                    totalCosto,
                    descuento: promocionInsumo ? pedidoVenta.descuento + ((itemInsumo?.precioVenta as number) * cantidad * (promocionInsumo.descuento as number) / 100) : pedidoVenta.descuento + 0,
                    pedidoVentaDetalle: newDetails || []
                };
            } else {
                const subTotal = pedidoVenta.subtotal + (itemManufacturado?.precioVenta as number) * cantidad
                const total = promocionManufacturado ? subTotal - pedidoVenta.descuento - ((itemManufacturado?.precioVenta as number) * cantidad * (promocionManufacturado.descuento as number) / 100) : subTotal - pedidoVenta.descuento
                const totalCosto = pedidoVenta.totalCosto + (itemManufacturado?.precioCosto as number) * cantidad
                return {
                    ...pedidoVenta,
                    horaEstimadaFinalizacion: pedidoVenta.horaEstimadaFinalizacion && addMinutes(pedidoVenta.horaEstimadaFinalizacion, itemManufacturado?.tiempoEstimado as number),
                    total,
                    subtotal: subTotal,
                    totalCosto,
                    descuento: promocionManufacturado ? pedidoVenta.descuento + ((itemManufacturado?.precioVenta as number) * cantidad * (promocionManufacturado.descuento as number) / 100) : pedidoVenta.descuento + 0,
                    pedidoVentaDetalle: newDetails || []
                };
            }
        } else {
            if (itemInsumo) {
                const subTotal = pedidoVenta.subtotal + (itemInsumo?.precioVenta as number) * cantidad
                const total = promocionInsumo ? subTotal - pedidoVenta.descuento - ((itemInsumo?.precioVenta as number) * cantidad * (promocionInsumo.descuento as number) / 100) : subTotal - pedidoVenta.descuento
                return {
                    ...pedidoVenta,
                    descuento: promocionInsumo ? pedidoVenta.descuento + ((itemInsumo?.precioVenta as number) * cantidad * (promocionInsumo.descuento as number) / 100) : pedidoVenta.descuento + 0,
                    total,
                    subtotal: subTotal,
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
                const subTotal = pedidoVenta.subtotal + (itemManufacturado?.precioVenta as number) * cantidad
                const total = promocionManufacturado ? subTotal - pedidoVenta.descuento - ((itemManufacturado?.precioVenta as number) * cantidad * (promocionManufacturado.descuento as number) / 100) : subTotal - pedidoVenta.descuento
                return {
                    ...pedidoVenta,
                    horaEstimadaFinalizacion: pedidoVenta.horaEstimadaFinalizacion && addMinutes(pedidoVenta.horaEstimadaFinalizacion, itemManufacturado?.tiempoEstimado as number),
                    total,
                    descuento: promocionManufacturado ? pedidoVenta.descuento + ((itemManufacturado?.precioVenta as number) * cantidad * (promocionManufacturado.descuento as number) / 100) : pedidoVenta.descuento + 0,
                    subtotal: subTotal,
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
        const totalInsumo = promocionInsumo && itemInsumo ? (itemInsumo?.precioVenta as number) * cantidad - (itemInsumo?.precioVenta as number) * cantidad * (promocionInsumo.descuento as number) / 100 : itemInsumo ? (itemInsumo?.precioVenta as number) * cantidad : null
        const totalManufacturado = promocionManufacturado && itemManufacturado ? (itemManufacturado?.precioVenta as number) * cantidad - (itemManufacturado?.precioVenta as number) * cantidad * (promocionManufacturado.descuento as number) / 100 : itemManufacturado ? (itemManufacturado?.precioVenta as number) * cantidad : null
        const total = totalInsumo || totalManufacturado
        return {
            id: null,
            horaEstimadaFinalizacion: new Date(),
            subtotal: (itemInsumo?.precioVenta as number) * cantidad || (itemManufacturado?.precioVenta as number) * cantidad || 0,
            descuento: promocionInsumo ? (itemInsumo?.precioVenta as number) * cantidad * (promocionInsumo.descuento as number) / 100 : promocionManufacturado ? (itemManufacturado?.precioVenta as number) * cantidad * (promocionManufacturado.descuento as number) / 100 : 0,
            gastosEnvio: 0,
            total: total || 0,
            totalCosto: (itemInsumo?.precioCompra as number) * cantidad || (itemManufacturado?.precioCosto as number) * cantidad || 0,
            estado: Estado.PENDIENTE.toUpperCase(),
            tipoEnvio: null,
            formaPago: null,
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
        const promocion = item?.promocion?.find(promo => promo.promocionDetalle?.some(detalle => detalle.articuloInsumo?.id === itemId || detalle.articuloManufacturado?.id === itemId))
        if (promocion) {
            const horaEstimadaFinalizacion = pedidoVenta.horaEstimadaFinalizacion && item?.articuloManufacturado ?
            addMinutes(pedidoVenta.horaEstimadaFinalizacion, item?.articuloManufacturado?.tiempoEstimado as number) : pedidoVenta.horaEstimadaFinalizacion;
            const total = pedidoVenta.total - ((item?.subTotal as number) -(item?.subTotal as number) * (promocion.descuento as number) / 100)
            const descuento = (item?.subTotal as number) * (promocion.descuento as number) / 100

            const costoInsumo =  item?.articuloInsumo ? (item?.articuloInsumo?.precioCompra as number) * item?.cantidad : null
            const costoManufacturado = item?.articuloManufacturado ? (item.articuloManufacturado.precioCosto as number) * item?.cantidad : null
            const totalCosto = costoInsumo || costoManufacturado || 0
            return {
            ...pedidoVenta,
            total,
            totalCosto,
            descuento: pedidoVenta.descuento - descuento,
            subtotal: total,
            horaEstimadaFinalizacion,
            pedidoVentaDetalle: pedidoVenta.pedidoVentaDetalle?.filter((detalle) => detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId) || null
        };
        }
        
        const total = pedidoVenta.total - (item?.subTotal as number)
        const totalCosto = pedidoVenta.totalCosto - (item?.articuloInsumo ? (item.articuloInsumo.precioCompra as number)* item.cantidad : (item?.articuloManufacturado?.precioCosto as number)* (item?.cantidad as number))
        const subtotal = pedidoVenta.subtotal - (item?.subTotal as number)
        const horaEstimadaFinalizacion = pedidoVenta.horaEstimadaFinalizacion && item?.articuloManufacturado ?
            addMinutes(pedidoVenta.horaEstimadaFinalizacion, item?.articuloManufacturado?.tiempoEstimado as number) : pedidoVenta.horaEstimadaFinalizacion;
        return {
            ...pedidoVenta,
            total,
            totalCosto,
            subtotal,
            horaEstimadaFinalizacion,
            pedidoVentaDetalle: pedidoVenta.pedidoVentaDetalle?.filter((detalle) => detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId) || null
        };
    }
    return null
};
