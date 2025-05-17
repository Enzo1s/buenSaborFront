import { Card, CardContent, Grid, Typography } from '@mui/material'
import { CardProps } from './Interfaces/CardProps';

const CardObject = (CardProps: CardProps) => {
    const { itemCard } = CardProps;
    return (
        <Card sx={{ maxWidth: 500 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6 }}>
                        <img src={`${itemCard.imagen}`} alt="" style={{ width: '100%' }} />
                    </Grid>

                    <Grid size={{ xs: 6 }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {itemCard.titulo}
                        </Typography>
                        <Typography variant="body2" >
                            ${itemCard.precioCompra?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" >
                            ${itemCard.precioVenta?.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" >
                            Es para elaborar: {itemCard.esParaElaborar ? "Si" : "No"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {itemCard.unidadMedida || (itemCard.cantidad)?.toString()}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card >
    )
}

export default CardObject