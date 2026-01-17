import { addMinutes } from "date-fns";
import { Estado } from "../../../enums/Estado";
import { FormaPago } from "../../../enums/FormaPago";
import { TipoEnvio } from "../../../enums/TipoEnvio";
import { ArticuloInsumo } from "../../../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../../../interfaces/ArticuloManufacturado";
import { PedidoVenta } from "../../../interfaces/PedidoVenta";
import { Promocion } from "../../../interfaces/Promocion";

const checkIfAllPromotionItemsPresent = (promocion: Promocion, pedidoVenta: PedidoVenta | null) => {
    if (!pedidoVenta || !pedidoVenta.pedidoVentaDetalle) {
        return false;
    }

    if (!isPromotionActive(promocion)) {
        return false;
    }

    return promocion.promocionDetalle?.every(detalle => {
        const requiredQuantity = detalle.cantidad || 1;
        const itemInCart = pedidoVenta.pedidoVentaDetalle?.find(detallePedido => {
            if (detalle.articuloInsumo) {
                return detallePedido.articuloInsumo?.id === detalle.articuloInsumo.id;
            } else if (detalle.articuloManufacturado) {
                return detallePedido.articuloManufacturado?.id === detalle.articuloManufacturado.id;
            }
            return false;
        });

        return itemInCart && (itemInCart.cantidad >= requiredQuantity);
    }) || false;
}

const isPromotionActive = (promocion: Promocion) => {
    const currentDate = new Date();
    const fechaDesde = new Date(promocion.fechaDesde);
    const fechaHasta = new Date(promocion.fechaHasta);
    return currentDate >= fechaDesde && currentDate <= fechaHasta;
}

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

    const discountAmount = totalValueOfSets * (promocion.descuento as number) / 100;

    return discountAmount;
};

const applyBestPromotion = (pedidoVenta: PedidoVenta) => {
    if (!pedidoVenta || !pedidoVenta.pedidoVentaDetalle) {
        return { descuento: 0, total: pedidoVenta?.total || 0, promocionAplicada: null };
    }

    const detalles = pedidoVenta.pedidoVentaDetalle;

    const allPromociones = detalles.flatMap(det => det.promocion || []).filter(Boolean) || [];

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

    for (const promo of uniquePromociones) {
        const availableSets = calculateAvailablePromotionSets(promo, detalles);

        if (availableSets > 0) {
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
    if (pedidoVenta && pedidoVenta.pedidoVentaDetalle) {
        // Find the index of the first item matching the ID to decrease its quantity by 1
        const itemIndex = pedidoVenta.pedidoVentaDetalle.findIndex((detalle) => {
            if (detalle.articuloManufacturado) {
                return detalle.articuloManufacturado.id === itemId
            } else {
                return detalle.articuloInsumo?.id === itemId
            }
        });

        if (itemIndex === -1) {
            // Item not found in the pedido
            return pedidoVenta;
        }

        // Get the item to be modified
        const itemToRemove = pedidoVenta.pedidoVentaDetalle[itemIndex];

        // Create a copy of the details array
        let updatedPedidoVentaDetalle = [...pedidoVenta.pedidoVentaDetalle];

        // Decrease quantity by 1
        if (itemToRemove.cantidad > 1) {
            // If quantity is greater than 1, just decrease the quantity
            const updatedItem = {
                ...itemToRemove,
                cantidad: itemToRemove.cantidad - 1,
                subTotal: itemToRemove.articuloInsumo
                    ? (itemToRemove.articuloInsumo.precioVenta as number) * (itemToRemove.cantidad - 1)
                    : (itemToRemove.articuloManufacturado!.precioVenta as number) * (itemToRemove.cantidad - 1)
            };

            updatedPedidoVentaDetalle[itemIndex] = updatedItem;
        } else {
            // If quantity is 1, remove the entire item detail
            updatedPedidoVentaDetalle.splice(itemIndex, 1);
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

        // Recalculate time estimation if needed - only if we removed an item and it was the last of its kind
        let horaEstimadaFinalizacion = pedidoVenta.horaEstimadaFinalizacion;
        if (itemToRemove.articuloManufacturado && itemToRemove.cantidad === 1) {
            // Only adjust time if the item was completely removed (not just quantity reduced)
            horaEstimadaFinalizacion = addMinutes(pedidoVenta.horaEstimadaFinalizacion, -(itemToRemove.articuloManufacturado.tiempoEstimado as number));
        }

        // Handle edge case where no items remain - still allow deletion of last item
        if (updatedPedidoVentaDetalle.length === 0) {
            return {
                ...pedidoVenta,
                subtotal: 0,
                descuento: 0,
                total: 0,
                totalCosto: 0,
                pedidoVentaDetalle: []
            };
        }

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
