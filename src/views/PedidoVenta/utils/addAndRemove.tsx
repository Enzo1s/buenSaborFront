import { addMinutes } from "date-fns";
import { Estado } from "../../../enums/Estado";
import { FormaPago } from "../../../enums/FormaPago";
import { TipoEnvio } from "../../../enums/TipoEnvio";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../../../interfaces/ArticuloManufacturado";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import { Promocion } from "../../../interfaces/Promocion";

// This function checks if all items of a specific promotion are present in the required quantities
const checkIfAllPromotionItemsPresent = (promocion: Promocion, pedidoVenta: PedidoVenta | null) => {
    if (!pedidoVenta || !pedidoVenta.pedidoVentaDetalle) {
        return false;
    }

    // Check if the promotion is active
    if (!isPromotionActive(promocion)) {
        return false;
    }

    // Check if all items in the promotion are present in the required quantities
    return promocion.promocionDetalle?.every(detalle => {
        const requiredQuantity = detalle.cantidad || 1; // Default to 1 if no cantidad specified
        const itemInCart = pedidoVenta.pedidoVentaDetalle?.find(detallePedido => {
            if (detalle.articuloInsumo) {
                return detallePedido.articuloInsumo?.id === detalle.articuloInsumo.id;
            } else if (detalle.articuloManufacturado) {
                return detallePedido.articuloManufacturado?.id === detalle.articuloManufacturado.id;
            }
            return false;
        });

        // Check if the item exists in the cart and has enough quantity
        return itemInCart && (itemInCart.cantidad >= requiredQuantity);
    }) || false;
}

// This function checks if a promotion is currently valid (within date range)
const isPromotionActive = (promocion: Promocion) => {
    const currentDate = new Date();
    const fechaDesde = new Date(promocion.fechaDesde);
    const fechaHasta = new Date(promocion.fechaHasta);
    return currentDate >= fechaDesde && currentDate <= fechaHasta;
}

// This function finds which promotions apply to the current pedido
const findApplicablePromotions = (promocion: Promocion | null, pedidoVenta: PedidoVenta | null) => {
    if (!promocion || !pedidoVenta) {
        return null;
    }

    // Check if the promotion is active and all required items are present
    const isPromoActive = isPromotionActive(promocion);
    const allItemsPresent = checkIfAllPromotionItemsPresent(promocion, pedidoVenta);
    return isPromoActive && allItemsPresent ? promocion : null;
}

// Function to calculate how many complete sets of a promotion can be made from items in the cart
const calculateAvailablePromotionSets = (promocion: Promocion, detalles: any[] | null) => {
    if (!detalles || !promocion.promocionDetalle) {
        return 0;
    }

    // Check if the promotion is active
    if (!isPromotionActive(promocion)) {
        return 0;
    }

    // For each required item in the promotion, calculate how many sets we can make
    const setsPerItem = promocion.promocionDetalle.map(detalle => {
        const requiredQuantityPerSet = detalle.cantidad || 1; // Default to 1 if no cantidad specified
        const itemInCart = detalles.find(detallePedido => {
            if (detalle.articuloInsumo) {
                return detallePedido.articuloInsumo?.id === detalle.articuloInsumo.id;
            } else if (detalle.articuloManufacturado) {
                return detallePedido.articuloManufacturado?.id === detalle.articuloManufacturado.id;
            }
            return false;
        });

        // If we don't have the required item at all, we can make 0 complete sets
        if (!itemInCart) {
            return 0;
        }

        // Calculate how many sets we can make based on this item
        // For example, if promotion requires 2 items of 'X' per set, and we have 5 in cart, we can make 5/2 = 2 complete sets from this item
        return Math.floor(itemInCart.cantidad / requiredQuantityPerSet);
    });

    // The total number of complete sets is determined by the minimum of all items
    // Because we need all items to make a complete set
    return setsPerItem.length > 0 ? Math.min(...setsPerItem) : 0;
}

// Function to calculate the discount for a specific number of promotion sets
const calculatePromotionDiscount = (promocion: Promocion, detalles: any[], availableSets: number) => {
    if (availableSets <= 0) {
        return 0;
    }

    // Calculate the value of items that are part of the complete sets
    let totalValueOfSets = 0;
    for (const detallePromo of promocion.promocionDetalle || []) {
        const detalleInCart = detalles.find(detalle => {
            if (detallePromo.articuloInsumo) {
                return detalle.articuloInsumo?.id === detallePromo.articuloInsumo.id;
            } else if (detallePromo.articuloManufacturado) {
                return detalle.articuloManufacturado?.id === detallePromo.articuloManufacturado.id;
            }
            return false;
        });

        if (detalleInCart) {
            // Only count the items that are part of complete sets
            const requiredQtyPerSet = detallePromo.cantidad || 1;
            const itemsUsedInSets = requiredQtyPerSet * availableSets;

            // Make sure we don't count more items than we actually have
            const itemsToCount = Math.min(itemsUsedInSets, detalleInCart.cantidad);

            const unitPrice = detalleInCart.subTotal / detalleInCart.cantidad;
            totalValueOfSets += unitPrice * itemsToCount;
        }
    }

    // Calculate the discount amount based on the value of items in complete sets
    const discountAmount = totalValueOfSets * (promocion.descuento as number) / 100;

    return discountAmount;
};

// Function to apply the best promotion based on current items in the cart
const applyBestPromotion = (pedidoVenta: PedidoVenta) => {
    if (!pedidoVenta || !pedidoVenta.pedidoVentaDetalle) {
        return { descuento: 0, total: pedidoVenta?.total || 0, promocionAplicada: null };
    }

    const detalles = pedidoVenta.pedidoVentaDetalle;

    // Get all unique promotions that are linked to any items in the cart
    const allPromociones = detalles.flatMap(det => det.promocion || []).filter(Boolean) || [];

    // Get unique promotions
    const uniquePromociones: Promocion[] = [];
    const seenIds = new Set();
    allPromociones.forEach(promo => {
        if (!seenIds.has(promo.id)) {
            seenIds.add(promo.id);
            uniquePromociones.push(promo);
        }
    });

    let maxDiscount = 0;
    let bestPromotion: Promocion | null = null;

    // Check each unique promotion to see how many complete sets are available
    for (const promo of uniquePromociones) {
        const availableSets = calculateAvailablePromotionSets(promo, detalles);

        if (availableSets > 0) {
            // Calculate the discount amount based on available complete sets
            const discountAmount = calculatePromotionDiscount(promo, detalles, availableSets);

            if (discountAmount > maxDiscount) {
                maxDiscount = discountAmount;
                bestPromotion = promo;
            }
        }
    }

    const total = detalles.reduce((sum, detalle) => {
        return sum + (detalle.subTotal as number);
    }, 0) - maxDiscount;

    return {
        descuento: maxDiscount,
        total: total,
        promocionAplicada: bestPromotion
    };
};

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
                    // Update the item quantity
                    const updatedDetalle = {
                        ...detalle,
                        cantidad: detalle.cantidad + cantidad,
                        subTotal: detalle.articuloInsumo ?
                        ((detalle.articuloInsumo.precioVenta as number) || 0) * (detalle.cantidad + cantidad) :
                        ((detalle.articuloManufacturado?.precioVenta as number) || 0) * (detalle.cantidad + cantidad)
                    };

                    // Update the pedido with the modified detail
                    const updatedPedidoVenta = {
                        ...pedidoVenta,
                        pedidoVentaDetalle: pedidoVenta.pedidoVentaDetalle?.map(d =>
                            d === detalle ? updatedDetalle : d
                        )
                    };

                    // Check if any promotion applies to the updated pedido
                    const promoAplicada = promocion && findApplicablePromotions(promocion, updatedPedidoVenta);

                    return {
                        ...updatedDetalle,
                        promocion: promoAplicada ? [promoAplicada] : null
                    };
                }
                return detalle;
            });

                // Calculate subtotal
                const subTotal = pedidoVenta.subtotal + (itemInsumo
                    ? ((itemInsumo?.precioVenta as number) || 0) * cantidad
                    : ((itemManufacturado?.precioVenta as number) || 0) * cantidad);

                // Apply the best possible promotion
                const updatedPedido = {
                    ...pedidoVenta,
                    pedidoVentaDetalle: newDetails || [],
                    subtotal: subTotal
                };

                const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion(updatedPedido);

                if (itemInsumo) {
                    const totalCosto = pedidoVenta.totalCosto + (itemInsumo?.precioCompra as number) * cantidad
                    return {
                        ...pedidoVenta,
                        total: nuevoTotal,
                        subtotal: subTotal,
                        totalCosto,
                        descuento: nuevoDescuento,
                        pedidoVentaDetalle: newDetails || []
                    };
                } else {
                    const totalCosto = pedidoVenta.totalCosto + (itemManufacturado?.precioCosto as number) * cantidad
                    return {
                        ...pedidoVenta,
                        horaEstimadaFinalizacion: pedidoVenta.horaEstimadaFinalizacion && addMinutes(pedidoVenta.horaEstimadaFinalizacion, itemManufacturado?.tiempoEstimado as number),
                        total: nuevoTotal,
                        subtotal: subTotal,
                        totalCosto,
                        descuento: nuevoDescuento,
                        pedidoVentaDetalle: newDetails || []
                    };
                }
        } else {
            const newDetalle = {
                id: null,
                cantidad,
                subTotal: itemInsumo
                    ? ((itemInsumo?.precioVenta as number) || 0) * cantidad
                    : ((itemManufacturado?.precioVenta as number) || 0) * cantidad,
                articuloManufacturado: itemManufacturado,
                articuloInsumo: itemInsumo,
                promocion: promocion ? [promocion] : null // Assign the promotion to this item
            };

            // Add the new item to the pedido
            const updatedPedidoVentaDetalle = [
                ...pedidoVenta?.pedidoVentaDetalle || [],
                newDetalle
            ];

            // Calculate subtotal
            const subTotal = pedidoVenta.subtotal + (itemInsumo
                ? ((itemInsumo?.precioVenta as number) || 0) * cantidad
                : ((itemManufacturado?.precioVenta as number) || 0) * cantidad);

            // Apply the best possible promotion to the updated pedido
            const updatedPedido = {
                ...pedidoVenta,
                pedidoVentaDetalle: updatedPedidoVentaDetalle,
                subtotal: subTotal
            };

            const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion(updatedPedido);

            if (itemInsumo) {
                return {
                    ...pedidoVenta,
                    descuento: nuevoDescuento,
                    total: nuevoTotal,
                    subtotal: subTotal,
                    totalCosto: pedidoVenta.totalCosto + (itemInsumo?.precioCompra as number) * cantidad || pedidoVenta.totalCosto,
                    pedidoVentaDetalle: [
                        ...pedidoVenta?.pedidoVentaDetalle || [],
                        newDetalle
                    ]
                }
            } else {
                return {
                    ...pedidoVenta,
                    horaEstimadaFinalizacion: pedidoVenta.horaEstimadaFinalizacion && addMinutes(pedidoVenta.horaEstimadaFinalizacion, itemManufacturado?.tiempoEstimado as number),
                    total: nuevoTotal,
                    descuento: nuevoDescuento,
                    subtotal: subTotal,
                    totalCosto: pedidoVenta.totalCosto + (itemManufacturado?.precioCosto as number) * cantidad,
                    pedidoVentaDetalle: [
                        ...pedidoVenta.pedidoVentaDetalle || [],
                        newDetalle
                    ]
                };
            }
        }
    } else {
        // For a single item, create the pedido with the item
        const subtotal = itemInsumo
            ? ((itemInsumo.precioVenta as number) || 0) * cantidad
            : ((itemManufacturado?.precioVenta as number) || 0) * cantidad;

        const initialPedido = {
            id: null,
            horaEstimadaFinalizacion: new Date(),
            subtotal: subtotal,
            descuento: 0, // Initially no discount
            gastosEnvio: 0,
            total: subtotal, // Initially no discount
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
                    subTotal: itemInsumo
                        ? ((itemInsumo.precioVenta as number) || 0) * cantidad
                        : ((itemManufacturado?.precioVenta as number) || 0) * cantidad,
                    articuloManufacturado: itemManufacturado,
                    articuloInsumo: itemInsumo,
                    promocion: promocion ? [promocion] : null // Assign the promotion to this item
                }
            ],
            fechaPedido: new Date(),
            alta: null,
            baja: null,
            modificacion: null
        };

        // Even for a single item, check if any promotion applies
        const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion(initialPedido);

        return {
            ...initialPedido,
            descuento: nuevoDescuento,
            total: nuevoTotal
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

        // Remove the item from the pedido
        const updatedPedidoVentaDetalle = pedidoVenta.pedidoVentaDetalle?.filter((detalle) =>
            detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId
        ) || null;

        if (!updatedPedidoVentaDetalle || updatedPedidoVentaDetalle.length === 0) {
            // If no items left, return null to indicate empty cart
            return null;
        }

        // Calculate values for the remaining items
        const subtotal = updatedPedidoVentaDetalle.reduce((sum, detalle) => {
            return sum + (detalle.subTotal as number);
        }, 0);

        const totalCosto = updatedPedidoVentaDetalle.reduce((sum, detalle) => {
            const itemCost = detalle.articuloInsumo
                ? (detalle.articuloInsumo.precioCompra as number) * (detalle.cantidad as number)
                : detalle.articuloManufacturado
                    ? (detalle.articuloManufacturado.precioCosto as number) * (detalle.cantidad as number)
                    : 0;
            return sum + itemCost;
        }, 0);

        // Create updated pedido to check for applicable promotions
        const updatedPedido: PedidoVenta = {
            ...pedidoVenta,
            subtotal: subtotal,
            totalCosto: totalCosto,
            pedidoVentaDetalle: updatedPedidoVentaDetalle
        };

        // Apply the best possible promotion to the updated pedido
        const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion(updatedPedido);

        // Recalculate time estimation if needed
        const horaEstimadaFinalizacion = item?.articuloManufacturado
            ? addMinutes(pedidoVenta.horaEstimadaFinalizacion, -(item.articuloManufacturado.tiempoEstimado as number))
            : pedidoVenta.horaEstimadaFinalizacion;

        return {
            ...pedidoVenta,
            subtotal: subtotal,
            descuento: nuevoDescuento,
            total: nuevoTotal,
            totalCosto: totalCosto,
            horaEstimadaFinalizacion: horaEstimadaFinalizacion,
            pedidoVentaDetalle: updatedPedidoVentaDetalle
        };
    }
    return null
};

// Export the applyBestPromotion function for use in other components
export { applyBestPromotion };
