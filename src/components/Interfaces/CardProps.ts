export interface CardProps {
    itemCard: {
        id: string | null,
        imagen: string | null,
        titulo: string | null,
        precioCompra: Number | null,
        precioVenta: Number | null,
        esParaElaborar: Boolean | null,
        unidadMedida: String | null,
        cantidad: Number | null,
    }
}