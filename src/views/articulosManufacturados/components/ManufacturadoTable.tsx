import { Grid, Typography } from '@mui/material'
import CardObject from '../../../components/CardObject'
import { useEffect, useState } from 'react'
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado'
import { getAllArticuloManufacturado } from '../../../Api/ArticuloManufacturadoAPI'
import { CardProps } from '../../../components/Interfaces/CardProps'

const ManufacturadoTable = () => {
  const [aManufacturados, setAManufacturados] = useState<CardProps[]>([])
  useEffect(() => {
    const getArticulos = async () => {
      const { data } = await getAllArticuloManufacturado();
      const cardProps: CardProps[] = data.map((articulo: ArticuloManufacturado) => ({
        id: articulo.id,
        imagen: articulo.pathImagen[0],
        titulo: articulo.denominacion,
        precioCompra: articulo.precioCosto,
        precioVenta: articulo.precioVenta,
        esParaElaborar: false,
        cantidad: 0, 
        unidadMedida: ''
      }))
      console.log(cardProps)
      setAManufacturados(cardProps);
    }
    getArticulos();

  }, [])
  
  return (
    <Grid>
        <Typography variant="h1">Listado articulo Manufacturado</Typography>
        <Grid container spacing={2}>
              {aManufacturados && aManufacturados.map((itemCard: CardProps) => 
            <Grid sx={{ xs: 3, sm: 6, md: 4 }}  key={itemCard.itemCard.id}>
                <CardObject itemCard={itemCard.itemCard} />
            </Grid>
              )}
          </Grid>
    </Grid>
  )
}

export default ManufacturadoTable