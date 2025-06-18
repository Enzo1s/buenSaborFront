import { useEffect, useState } from 'react'
import { Box, Grid, Paper, Typography } from '@mui/material';
import { useParams } from 'react-router';
import { Empleado } from '../../../interfaces/Empleado'
import { getByIdEmpleado } from '../../../Api/EmpleadoAPI';
import PedidoVentaTable from '../../PedidoVenta/components/PedidoVentaTable';

const EmpleadoDetails = () => {

    const { id } = useParams();
    const [empleado, setEmpleado] = useState<Empleado | null>(null)

    const getEmpleado = async () => {
        if (id) {
            const { data } = await getByIdEmpleado(id)
            setEmpleado(data)
        }
    }

    useEffect(() => {
        getEmpleado()
    }, [])


    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Grid container spacing={3}>
                <Grid size={12}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: '10px' }}>
                        <Grid size={12}>
                            <Typography variant='h3'>Detalle Empleado</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant='h5'>Nombre y Apellido: {empleado?.nombre} {empleado?.apellido}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant='h5'>Correo: {empleado?.email}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant='h5'>Telefono: {empleado?.telefono}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant='h5'>Cargo: {empleado?.perfil}</Typography>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            {empleado?.id && <PedidoVentaTable idEmpleado={empleado?.id} />}
        </Box>
    )
}

export default EmpleadoDetails