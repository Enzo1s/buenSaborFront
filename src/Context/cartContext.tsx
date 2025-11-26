import { createContext, useContext, useEffect, useState } from "react";
import { ArticuloInsumo } from "../interfaces/ArticuloInsumo";
import { ArticuloManufacturado } from "../interfaces/ArticuloManufacturado";
import { PedidoVenta } from "../interfaces/PedidoVenta";
import { Promocion } from "../interfaces/Promocion";
import { Estado } from "../enums/Estado";
import { TipoEnvio } from "../enums/TipoEnvio";
import { addMinutes } from "date-fns";

interface CartContextType {
    pedidoVenta: PedidoVenta | null;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    shouldOpenCart: boolean;
    setShouldOpenCart: (shouldOpen: boolean) => void;
    addItemToCart: (itemInsumo: ArticuloInsumo | null, itemManufacturado: ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number) => void;
    addPromocionToCart: (promocion: Promocion) => void;
    removeItemFromCart: (itemId: string) => void;
    clearCart: () => void;
    recalculatePromotion: (pedido: PedidoVenta) => { descuento: number; total: number; promocionAplicada: Promocion | null };
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

    // Check if the promotion is active
    const isPromoActive = isPromotionActive(promocion);
    if (!isPromoActive) {
        return null;
    }

    // Check if all items of the promotion are present in the required quantities
    if (!pedidoVenta.pedidoVentaDetalle) {
        return null;
    }

    return checkAllPromotionItemsPresent(promocion, pedidoVenta.pedidoVentaDetalle) ? promocion : null;
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

// Function to check if all items in a promotion are present in the required quantities
const checkAllPromotionItemsPresent = (promocion: Promocion, detalles: any[] | null) => {
    if (!detalles) {
        return false;
    }

    // Check if the promotion is active
    if (!isPromotionActive(promocion)) {
        return false;
    }

    // Check if at least one complete set is available
    return calculateAvailablePromotionSets(promocion, detalles) > 0;
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

// Function to check all possible promotions from the system and apply the best one
const applyBestPromotion = (pedidoVenta: PedidoVenta, promocionesCache?: Promocion[]) => {
    if (!pedidoVenta || !pedidoVenta.pedidoVentaDetalle) {
        return { descuento: 0, total: pedidoVenta?.total || 0, promocionAplicada: null };
    }

    const detalles = pedidoVenta.pedidoVentaDetalle;

    // Get all system promotions that could potentially apply
    // Use the provided cache if available, otherwise use the context's active promotions
    const allPotentialPromociones: Promocion[] = promocionesCache || activePromociones || [];

    // Add any promotions already attached to items in the cart
    const existingPromociones = detalles.flatMap(det => det.promocion || []).filter(Boolean) || [];
    const seenIds = new Set();
    const combinedPromociones: Promocion[] = [];

    // Add unique existing promotions first
    existingPromociones.forEach(promo => {
        if (!seenIds.has(promo.id)) {
            seenIds.add(promo.id);
            combinedPromociones.push(promo);
        }
    });

    // Add active system promotions not already included
    allPotentialPromociones.forEach(promo => {
        if (!seenIds.has(promo.id)) {
            seenIds.add(promo.id);
            combinedPromociones.push(promo);
        }
    });

    let maxDiscount = 0;
    let bestPromotion: Promocion | null = null;

    // Check each potential promotion to see how many complete sets are available
    for (const promo of combinedPromociones) {
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

const CartContextType = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
    const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [activePromociones, setActivePromociones] = useState<Promocion[]>([]);
    const [shouldOpenCart, setShouldOpenCartState] = useState<boolean>(false);

    useEffect(() => {
        const pedidos = localStorage.getItem("pedidoVenta");
        setPedidoVenta(pedidos ? JSON.parse(pedidos) : null);
    }, [])

    useEffect(() => {
        if (pedidoVenta) {
            localStorage.setItem("pedidoVenta", JSON.stringify(pedidoVenta));
        } else {
            localStorage.removeItem("pedidoVenta");
        }
    }, [pedidoVenta])

    // Load active promotions on context initialization
    useEffect(() => {
        const fetchActivePromociones = async () => {
            try {
                // Import here to avoid circular dependencies
                const { getPromocionesActivas } = await import("../Api/PromocionAPI");
                const response = await getPromocionesActivas();
                setActivePromociones(response.data);
            } catch (error) {
                console.error("Error fetching active promotions:", error);
                // Fallback: use any promotions that might already be in the cart
            }
        };

        fetchActivePromociones();
    }, []);

    const setShouldOpenCart = (shouldOpen: boolean) => {
        setShouldOpenCartState(shouldOpen);
    };

    const recalculatePromotion = (pedido: PedidoVenta) => {
        return applyBestPromotion(pedido, activePromociones);
    };
    

    const addItemToCart = (itemInsumo: ArticuloInsumo | null, itemManufacturado: ArticuloManufacturado | null, promocion: Promocion | null, cantidad: number) => {
        // First, verify that the promotion is active if one is provided
        const promocionValida = promocion && isPromotionActive(promocion) ? promocion : null;

        if (pedidoVenta) {
            // Check if the item already exists in the cart
            const existingItem = pedidoVenta.pedidoVentaDetalle?.find((detalle) => {
                if (itemManufacturado) {
                    return detalle.articuloManufacturado?.id === itemManufacturado.id;
                } else {
                    return detalle.articuloInsumo?.id === itemInsumo?.id;
                }
            });

            let updatedDetails;

            if (existingItem) {
                // Update the existing item's quantity and subtotal
                updatedDetails = pedidoVenta.pedidoVentaDetalle?.map(detalle => {
                    if ((itemManufacturado && detalle.articuloManufacturado?.id === itemManufacturado.id) ||
                        (itemInsumo && detalle.articuloInsumo?.id === itemInsumo?.id)) {
                        return {
                            ...detalle,
                            cantidad: detalle.cantidad + cantidad,
                            subTotal: itemInsumo
                                ? ((detalle.articuloInsumo!.precioVenta as number) || 0) * (detalle.cantidad + cantidad)
                                : ((detalle.articuloManufacturado!.precioVenta as number) || 0) * (detalle.cantidad + cantidad)
                        };
                    }
                    return detalle;
                }) || [];
            } else {
                // Add new item to the cart
                let newItem = {
                    id: null,
                    cantidad,
                    subTotal: itemInsumo
                        ? ((itemInsumo.precioVenta as number) || 0) * cantidad
                        : ((itemManufacturado!.precioVenta as number) || 0) * cantidad,
                    articuloManufacturado: itemManufacturado || null,
                    articuloInsumo: itemInsumo || null,
                    promocion: promocionValida ? [promocionValida] : null // Initially assign promotion to this item
                };

                // Check if this item could be part of a promotion that's not yet in the cart
                if (!promocionValida) {
                    const applicablePromos = activePromociones.filter(promo =>
                        isPromotionActive(promo) &&
                        promo.promocionDetalle?.some(detalle =>
                            (detalle.articuloInsumo?.id === itemInsumo?.id) ||
                            (detalle.articuloManufacturado?.id === itemManufacturado?.id)
                        )
                    );

                    if (applicablePromos.length > 0) {
                        // Add the detected promotions to this item
                        newItem = {
                            ...newItem,
                            promocion: applicablePromos
                        };
                    }
                }

                updatedDetails = [...pedidoVenta.pedidoVentaDetalle || [], newItem];
            }

            // Calculate subtotal
            const subTotal = updatedDetails.reduce((sum, detalle) => {
                return sum + (detalle.subTotal as number);
            }, 0);

            // Calculate total cost
            const totalCosto = updatedDetails.reduce((sum, detalle) => {
                const itemCost = detalle.articuloInsumo
                    ? ((detalle.articuloInsumo.precioCompra as number) || 0) * (detalle.cantidad as number)
                    : detalle.articuloManufacturado
                        ? ((detalle.articuloManufacturado.precioCosto as number) || 0) * (detalle.cantidad as number)
                        : 0;
                return sum + itemCost;
            }, 0);

            // Apply the best possible promotion
            const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion({
                ...pedidoVenta,
                subtotal: subTotal,
                totalCosto: totalCosto,
                pedidoVentaDetalle: updatedDetails
            }, activePromociones);

            // Update the pedido
            setPedidoVenta({
                ...pedidoVenta,
                subtotal: subTotal,
                descuento: nuevoDescuento,
                total: nuevoTotal,
                totalCosto: totalCosto,
                pedidoVentaDetalle: updatedDetails
            });
        } else {
            // Creating a new pedido
            const subTotal = itemInsumo
                ? ((itemInsumo.precioVenta as number) || 0) * cantidad
                : ((itemManufacturado!.precioVenta as number) || 0) * cantidad;

            const itemCost = itemInsumo
                ? ((itemInsumo.precioCompra as number) || 0) * cantidad
                : ((itemManufacturado!.precioCosto as number) || 0) * cantidad;

            let newItemDetalle = {
                id: null,
                cantidad,
                subTotal: subTotal,
                articuloManufacturado: itemManufacturado || null,
                articuloInsumo: itemInsumo || null,
                promocion: promocionValida ? [promocionValida] : null
            };

            // Check if this item could be part of a promotion that's not yet in the cart
            if (!promocionValida) {
                const applicablePromos = activePromociones.filter(promo =>
                    isPromotionActive(promo) &&
                    promo.promocionDetalle?.some(detalle =>
                        (detalle.articuloInsumo?.id === itemInsumo?.id) ||
                        (detalle.articuloManufacturado?.id === itemManufacturado?.id)
                    )
                );

                if (applicablePromos.length > 0) {
                    // Add the detected promotions to this item
                    newItemDetalle = {
                        ...newItemDetalle,
                        promocion: applicablePromos
                    };
                }
            }

            const pedidoInicial = {
                id: null,
                horaEstimadaFinalizacion: new Date(),
                subtotal: subTotal,
                descuento: 0, // Initially no discount for single item
                gastosEnvio: 0,
                total: subTotal, // Initially no discount
                totalCosto: itemCost,
                estado: Estado.PENDIENTE.toUpperCase(),
                tipoEnvio: TipoEnvio.DELIVERY.toUpperCase(),
                formaPago: "",
                empleado: null,
                sucursal: null,
                cliente: null,
                factura: null,
                pedidoVentaDetalle: [newItemDetalle],
                fechaPedido: new Date(),
                alta: null,
                baja: null,
                modificacion: null
            };

            // Even for a single item, check if any promotion can be applied
            const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion(pedidoInicial, activePromociones);

            setPedidoVenta({
                ...pedidoInicial,
                descuento: nuevoDescuento,
                total: nuevoTotal
            });
        }
    };

    const addPromocionToCart = (promocion: Promocion) => {
        if (!promocion || !promocion.promocionDetalle || promocion.promocionDetalle.length === 0) {
            return;
        }

        // Check if the promotion is currently active
        if (!isPromotionActive(promocion)) {
            // Optionally show a message to the user that the promotion is not active
            console.log("Promotion is not active");
            return;
        }

        if (pedidoVenta) {
            // Add all items in the promotion to the current pedido
            let updatedDetails = [...pedidoVenta.pedidoVentaDetalle || []];

            promocion.promocionDetalle.forEach(detalle => {
                const existingItem = updatedDetails.find((detallePedido) => {
                    if (detalle.articuloManufacturado) {
                        return detallePedido.articuloManufacturado?.id === detalle.articuloManufacturado.id;
                    } else if (detalle.articuloInsumo) {
                        return detallePedido.articuloInsumo?.id === detalle.articuloInsumo.id;
                    }
                    return false;
                });

                if (existingItem) {
                    // If item already exists, update quantity
                    updatedDetails = updatedDetails.map(detallePedido => {
                        if ((detalle.articuloManufacturado && detallePedido.articuloManufacturado?.id === detalle.articuloManufacturado.id) ||
                            (detalle.articuloInsumo && detallePedido.articuloInsumo?.id === detalle.articuloInsumo.id)) {
                            // Add promotion to existing promotions array if not already included
                            const allPromociones = detallePedido.promocion ? [...detallePedido.promocion, promocion] : [promocion];
                            // Remove duplicates
                            const uniquePromociones = allPromociones.filter((promo, index, self) =>
                                index === self.findIndex(p => p.id === promo.id)
                            );

                            return {
                                ...detallePedido,
                                cantidad: detallePedido.cantidad + (detalle.cantidad || 1),
                                subTotal: detallePedido.articuloInsumo
                                    ? ((detallePedido.articuloInsumo.precioVenta as number) || 0) * (detallePedido.cantidad + (detalle.cantidad || 1))
                                    : ((detallePedido.articuloManufacturado!.precioVenta as number) || 0) * (detallePedido.cantidad + (detalle.cantidad || 1)),
                                promocion: uniquePromociones
                            };
                        }
                        return detallePedido;
                    });
                } else {
                    // Add new item to the cart
                    const newItem = {
                        id: null,
                        cantidad: detalle.cantidad || 1,
                        subTotal: detalle.articuloInsumo
                            ? ((detalle.articuloInsumo.precioVenta as number) || 0) * (detalle.cantidad || 1)
                            : ((detalle.articuloManufacturado!.precioVenta as number) || 0) * (detalle.cantidad || 1),
                        articuloManufacturado: detalle.articuloManufacturado || null,
                        articuloInsumo: detalle.articuloInsumo || null,
                        promocion: [promocion] // Assign the promotion to this item
                    };
                    updatedDetails.push(newItem);
                }
            });

            // Calculate subtotal
            const subTotal = updatedDetails.reduce((sum, detalle) => {
                return sum + (detalle.subTotal as number);
            }, 0);

            // Calculate total cost
            const totalCosto = updatedDetails.reduce((sum, detalle) => {
                const itemCost = detalle.articuloInsumo
                    ? ((detalle.articuloInsumo.precioCompra as number) || 0) * (detalle.cantidad as number)
                    : detalle.articuloManufacturado
                        ? ((detalle.articuloManufacturado.precioCosto as number) || 0) * (detalle.cantidad as number)
                        : 0;
                return sum + itemCost;
            }, 0);

            // Apply the best possible promotion
            const { descuento: nuevoDescuento, total: nuevoTotal, promocionAplicada } = applyBestPromotion({
                ...pedidoVenta,
                subtotal: subTotal,
                totalCosto: totalCosto,
                pedidoVentaDetalle: updatedDetails
            }, activePromociones);

            // Update the pedido
            setPedidoVenta({
                ...pedidoVenta,
                subtotal: subTotal,
                descuento: nuevoDescuento,
                total: nuevoTotal,
                totalCosto: totalCosto,
                pedidoVentaDetalle: updatedDetails
            });
        } else {
            // Create a new pedido with all items in the promotion
            const newDetalleItems = promocion.promocionDetalle.map(detalle => {
                // Check if the item belongs to other active promotions as well
                const otherPromos = activePromociones.filter(p =>
                    p.id !== promocion.id && // Don't include the same promotion again
                    isPromotionActive(p) &&
                    p.promocionDetalle?.some(d =>
                        (d.articuloInsumo?.id === detalle.articuloInsumo?.id) ||
                        (d.articuloManufacturado?.id === detalle.articuloManufacturado?.id)
                    )
                );

                // Combine the main promotion with other applicable promotions
                const allPromos = [promocion, ...otherPromos];

                return {
                    id: null,
                    cantidad: detalle.cantidad || 1,
                    subTotal: detalle.articuloInsumo
                        ? ((detalle.articuloInsumo.precioVenta as number) || 0) * (detalle.cantidad || 1)
                        : ((detalle.articuloManufacturado!.precioVenta as number) || 0) * (detalle.cantidad || 1),
                    articuloManufacturado: detalle.articuloManufacturado || null,
                    articuloInsumo: detalle.articuloInsumo || null,
                    promocion: allPromos // Assign all applicable promotions to this item
                };
            });

            // Calculate subtotal
            const subTotal = newDetalleItems.reduce((sum, detalle) => {
                return sum + (detalle.subTotal as number);
            }, 0);

            // Calculate total cost
            const totalCosto = newDetalleItems.reduce((sum, detalle) => {
                const itemCost = detalle.articuloInsumo
                    ? ((detalle.articuloInsumo.precioCompra as number) || 0) * (detalle.cantidad as number)
                    : detalle.articuloManufacturado
                        ? ((detalle.articuloManufacturado.precioCosto as number) || 0) * (detalle.cantidad as number)
                        : 0;
                return sum + itemCost;
            }, 0);

            const nuevoPedido: PedidoVenta = {
                id: null,
                horaEstimadaFinalizacion: new Date(),
                subtotal: subTotal,
                descuento: 0, // Initially no discount for single items
                gastosEnvio: 0,
                total: subTotal, // Initially no discount
                totalCosto: totalCosto,
                estado: Estado.PENDIENTE.toUpperCase(),
                tipoEnvio: TipoEnvio.DELIVERY.toUpperCase(),
                formaPago: "",
                empleado: null,
                sucursal: null,
                cliente: null,
                factura: null,
                pedidoVentaDetalle: newDetalleItems,
                fechaPedido: new Date(),
                alta: null,
                baja: null,
                modificacion: null
            };

            // Apply the best possible promotion
            const { descuento: nuevoDescuento, total: nuevoTotal, promocionAplicada } = applyBestPromotion(nuevoPedido, activePromociones);

            setPedidoVenta({
                ...nuevoPedido,
                descuento: nuevoDescuento,
                total: nuevoTotal
            });
        }
    };

    const removeItemFromCart = (itemId: string) => {
        if (pedidoVenta && pedidoVenta.pedidoVentaDetalle) {
            const item = pedidoVenta.pedidoVentaDetalle?.find((detalle) => {
                if (detalle.articuloManufacturado) {
                    return detalle.articuloManufacturado.id === itemId
                }
                else
                    return detalle.articuloInsumo?.id === itemId
            });

            if (!item) return; // If no item found, do nothing

            const remainingDetails = pedidoVenta.pedidoVentaDetalle?.filter((detalle) =>
                detalle.articuloManufacturado?.id !== itemId && detalle.articuloInsumo?.id !== itemId
            ) || null;

            if (remainingDetails && remainingDetails.length === 0) {
                // If no items left, reset the cart
                setPedidoVenta(null);
                localStorage.removeItem("pedidoVenta");
                return;
            }

            // Calculate values for the remaining items
            const subtotal = remainingDetails?.reduce((sum, detalle) => {
                return sum + (detalle.subTotal as number);
            }, 0) || 0;

            const totalCosto = remainingDetails?.reduce((sum, detalle) => {
                const itemCost = detalle.articuloInsumo
                    ? ((detalle.articuloInsumo.precioCompra as number) || 0) * (detalle.cantidad as number)
                    : detalle.articuloManufacturado
                        ? ((detalle.articuloManufacturado.precioCosto as number) || 0) * (detalle.cantidad as number)
                        : 0;
                return sum + itemCost;
            }, 0) || 0;

            const horaEstimadaFinalizacion = item.articuloManufacturado
                ? addMinutes(pedidoVenta.horaEstimadaFinalizacion, -item.articuloManufacturado.tiempoEstimado as number)
                : pedidoVenta.horaEstimadaFinalizacion;

            // Create updated pedido to calculate promotions
            const updatedPedido = {
                ...pedidoVenta,
                subtotal: subtotal,
                totalCosto: totalCosto,
                horaEstimadaFinalizacion: horaEstimadaFinalizacion,
                pedidoVentaDetalle: remainingDetails
            };

            // Apply best promotion to the updated pedido
            const { descuento: nuevoDescuento, total: nuevoTotal } = applyBestPromotion(updatedPedido, activePromociones);

            setPedidoVenta({
                ...pedidoVenta,
                subtotal: subtotal,
                descuento: nuevoDescuento,
                total: nuevoTotal,
                totalCosto: totalCosto,
                horaEstimadaFinalizacion: horaEstimadaFinalizacion,
                pedidoVentaDetalle: remainingDetails
            });
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
        shouldOpenCart,
        setShouldOpenCart,
        addItemToCart,
        addPromocionToCart,
        removeItemFromCart,
        clearCart,
        recalculatePromotion
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