import { Button, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react'

interface PagoModalProps {
    pedidoVenta: any,
    handleSubmit: () => void
}

const PagoModal = (props: PagoModalProps) => {

    const { handleSubmit, pedidoVenta } = props;

    const [vuelto, setVuelto] = useState(0)

    return (

        <Grid sx={{ margin: '20px' }} size={12}>
            <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: '20px' }}>Monto a combrar: ${pedidoVenta.total.toFixed(2)}</Typography>
            <TextField
                sx={{ marginBottom: '20px' }}
                fullWidth
                id="pago"
                name="pago"
                label="Pago"
                type="number"
                onChange={(e) => setVuelto(Number(e.target.value) - pedidoVenta.total)}
            />
            <Typography variant='h5' sx={{ textAlign: 'center', marginBottom: '20px' }}>Vuelto: ${vuelto.toFixed(2)}</Typography>
            <Button type='button' variant='contained' color='success' onClick={() => handleSubmit()}>Aceptar</Button>
        </Grid>
    )
}

export default PagoModal