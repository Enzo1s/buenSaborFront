import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Empresa } from '../../../interfaces/Empresa'
import { getByIdEmpresa } from '../../../Api/EmpresaAPI'
import { Grid, Typography } from '@mui/material'

const EmpresaDetails = () => {

    const {id} = useParams()

    const [empresa, setEmpresa] = useState<Empresa | null>(null)

    const getCompany = async () => {
      if(id) {
        const { data } = await getByIdEmpresa(id)
        setEmpresa(data)
      }
    }

    useEffect(() => {
        getCompany()
    }, [])
    

  return (
    <Grid container spacing={2}>
        <Grid size={12}>
            <Typography variant='h3'>{empresa?.nombre}</Typography>
        </Grid>
        <Grid size={12}>
            <Typography variant='h3'>{empresa?.razonSocial}</Typography>
        </Grid>
        <Grid size={12}>
            <Typography variant='h3'>{empresa?.cuil.toString()}</Typography>
        </Grid>
        {empresa?.sucursalEmpresa && empresa.sucursalEmpresa.map((sucursal, index) => (
            <Grid key={index} size={12}>
                <Typography variant='h3'>{sucursal.nombre}</Typography>
                <Typography variant='h3'>{`Domicilio: ${sucursal.domicilio.calle}- ${sucursal.domicilio.numero} - ${sucursal.domicilio.localidad.nombre} - ${sucursal.domicilio.localidad.provincia?.nombre} - ${sucursal.domicilio.localidad.provincia?.pais?.nombre}`}</Typography>
            </Grid>
        ))}
        
        </Grid>
  )
}

export default EmpresaDetails