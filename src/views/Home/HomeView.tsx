import { useEffect, useState } from "react"
import { ArticuloManufacturado } from "../../interfaces/ArticuloManufacturado"
import { ArticuloInsumo } from "../../interfaces/ArticuloInsumo"
import { getAllArticuloManufacturado } from "../../Api/ArticuloManufacturadoAPI"
import { getListArticuloInsumo } from "../../Api/ArticuloInsumo"
import { CardProps } from "../../components/Interfaces/CardProps"
import { Grid } from "@mui/material"
import CardObject from "../../components/CardObject"


const HomeView = () => {

    const [listCard, setListCard] = useState<CardProps[]>([])

    useEffect(() => {
        const getManufacturados = async () => {
            const { data: manufacturados } = await getAllArticuloManufacturado()
            const cardProps: CardProps[] = manufacturados.map((articulo: ArticuloManufacturado) => ({
                itemCard: {
                    id: articulo.id,
                    imagen: articulo.pathImagen[0],
                    titulo: articulo.denominacion,
                    precioVenta: articulo.precioVenta,
                    esInsumo: false
                }
            }))
            const { data } = await getListArticuloInsumo()
            const insumos = data.filter((insumo: ArticuloInsumo) => insumo.esParaElaborar === false)
            console.log("insumos", insumos)
            const insumosCardProps: CardProps[] = insumos.map((articulo: ArticuloInsumo) => ({
                itemCard: {
                    id: articulo.id,
                    imagen: articulo.pathImagen[0],
                    titulo: articulo.denominacion,
                    precioVenta: articulo.precioVenta,
                    esInsumo: true
                }
            }))
            setListCard([...listCard, ...cardProps, ...insumosCardProps])
        }
        getManufacturados()
    }, [])


    return (
        <Grid display={"flex"} spacing={2} alignContent={"center"} justifyContent="center" sx={{ padding: 2, borderRadius: 2, flexWrap: 'wrap' }}>
            {listCard && listCard.map((itemCard: CardProps) => (
                <Grid size={3} key={itemCard.itemCard.id} margin={2} >
                    <CardObject itemCard={itemCard.itemCard} />
                </Grid>
            ))}
        </Grid>
    )
}

export default HomeView