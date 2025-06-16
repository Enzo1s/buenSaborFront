import { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useParams } from 'react-router'
import { Promocion } from '../../../interfaces/Promocion'
import { getPromocionById } from '../../../Api/PromocionAPI'

const PromocionDetails = () => {

    const { id } = useParams()

    const [promocion, setPromocion] = useState<Promocion | null>(null)

    const getPromocion = async () => {
        if (id) {
            const { data } = await getPromocionById(id)
            setPromocion(data)
        }
    }

    useEffect(() => {
        getPromocion()
    }, [])

    if (!promocion) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No se encontró información de la promoción.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}> 
      <Card elevation={6}> 
        <CardContent>
          <Typography variant='h4' component='h1' gutterBottom align='center'
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 3
            }}
          >
            {promocion.denominacion}
          </Typography>

          <Divider sx={{ mb: 3 }} /> 

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            {promocion.fechaDesde && (
              <Chip
                label={`Desde: ${format(new Date(promocion.fechaDesde), 'dd/MM/yyyy', { locale: es })}`}
                color="info"
                variant="outlined"
                sx={{ fontSize: '0.9rem', p: 1 }}
              />
            )}
            {promocion.fechaHasta && (
              <Chip
                label={`Hasta: ${format(new Date(promocion.fechaHasta), 'dd/MM/yyyy', { locale: es })}`}
                color="warning"
                variant="outlined"
                sx={{ fontSize: '0.9rem', p: 1 }}
              />
            )}
          </Box>

          <Typography variant='h5' component='p' align='center' sx={{ mb: 4, color: 'success.dark', fontWeight: 'bold' }}>
            Descuento: {promocion.descuento.toFixed(2)} %
          </Typography>

          {promocion.promocionDetalle && promocion.promocionDetalle.length > 0 && (
            <>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
                Artículos incluidos en la promoción:
              </Typography>
              <Grid container spacing={1}> 
                {promocion.promocionDetalle.map((detalle, index) => (
                  <Grid size={12} key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {detalle.articuloManufacturado?.denominacion || detalle.articuloInsumo?.denominacion || 'Artículo desconocido'}
                      </Typography>
                      <Chip label={`Cantidad: ${detalle.cantidad.toString()}`} size="small" color="primary" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {(!promocion.promocionDetalle || promocion.promocionDetalle.length === 0) && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
              No hay artículos detallados para esta promoción.
            </Typography>
          )}

        </CardContent>
      </Card>
    </Box>
  )
}

export default PromocionDetails