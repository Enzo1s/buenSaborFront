import { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  Divider,
  Paper,
  Button
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate, useParams } from 'react-router'
import { Promocion } from '../../../interfaces/Promocion'
import { getPromocionById } from '../../../Api/PromocionAPI'
import { useCartContext } from '../../../Context/cartContext'
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado';
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo';

const PromocionDetails = () => {

  const { id } = useParams()
  const { addItemToCart, addPromocionToCart, setShouldOpenCart } = useCartContext();
  const navigate = useNavigate();
  const [promocion, setPromocion] = useState<Promocion | null>(null)

  const getPromocion = async () => {
    if (id) {
      const { data } = await getPromocionById(id)
      setPromocion(data)
    }
  }

  const handleAddPromocionToCart = () => {
    if (promocion) {
      addPromocionToCart(promocion);
      setShouldOpenCart(true);
      navigate("/");
    }
  }

  const getDiscountedPrice = () => {
    if (!promocion) return 0;
    const total = promocion.promocionDetalle?.reduce((sum, detalle) => {
      const price = detalle.articuloManufacturado?.precioVenta || detalle.articuloInsumo?.precioVenta || 0 as number;
      return sum + (price as number * (detalle.cantidad as number || 0));
    }, 0) || 0;
    const discount = promocion.descuento || 0;
    return total - (total * (discount as number / 100));
  }
  
  const getTotalPrice = () => {
    if (!promocion) return 0;
    return promocion.promocionDetalle?.reduce((sum, detalle) => {
      const price = detalle.articuloManufacturado?.precioVenta || detalle.articuloInsumo?.precioVenta || 0 as number;
      return sum + (price as number * (detalle.cantidad as number || 0));
    }, 0) || 0;
  }

  const getProfitMargin = () => {
    if (!promocion) return 0;
    const totalCost = promocion.promocionDetalle?.reduce((sum, detalle) => {
      const cost = detalle.articuloManufacturado?.precioCosto || detalle.articuloInsumo?.precioCompra || 0 as number;
      return sum + (cost as number * (detalle.cantidad as number || 0));
    }, 0) || 0;
    const discountedPrice = getDiscountedPrice();
    return discountedPrice - totalCost;
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
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 800,
        mx: 'auto',
        color: '#e0e0e0',
      }}
    >
      <Card
        elevation={10}
        sx={{
          width: '100%',
          borderRadius: '16px',
          backgroundColor: 'rgba(25, 25, 25, 0.95)',
          boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <CardContent sx={{ p: 0 }}> 
          <Typography
            variant='h4'
            component='h1'
            align='center'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#90CAF9',
              mb: 3,
              textShadow: '2px 2px 5px rgba(0,0,0,0.8)',
            }}
          >
            Detalles de Promoción: {promocion.denominacion}
          </Typography>

          <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
            {promocion.fechaDesde && (
              <Chip
                label={`Desde: ${format(new Date(promocion.fechaDesde), 'dd/MM/yyyy', { locale: es })}`}
                variant="filled"
                sx={{
                  fontSize: '1rem',
                  p: 2,
                  backgroundColor: '#2196F3',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                }}
                component={Paper}
                elevation={3}
              />
            )}
            {promocion.fechaHasta && (
              <Chip
                label={`Hasta: ${format(new Date(promocion.fechaHasta), 'dd/MM/yyyy', { locale: es })}`}
                variant="filled"
                sx={{
                  fontSize: '1rem',
                  p: 2,
                  backgroundColor: '#FFC107',
                  color: '#333333',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                }}
                component={Paper}
                elevation={3}
              />
            )}
          </Box>
          <Typography
            variant='h5'
            component='p'
            align='center'
            sx={{
              mb: 4,
              color: '#69F0AE',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            Precio total sin descuento: ${getTotalPrice().toFixed(2)}
          </Typography>

          <Typography
            variant='h5'
            component='p'
            align='center'
            sx={{
              mb: 4,
              color: '#69F0AE',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            Descuento: {promocion.descuento.toFixed(2)} %
          </Typography>
          <Typography
            variant='h5'
            component='p'
            align='center'
            sx={{
              mb: 4,
              color: '#69F0AE',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            Precio total con descuento: ${getDiscountedPrice().toFixed(2)}
          </Typography>

          <Typography
            variant='h5'
            component='p'
            align='center'
            sx={{
              mb: 4,
              color: '#69F0AE',
              fontWeight: 'bold',
              fontSize: { xs: '1.5rem', sm: '1.75rem' },
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            Margen de utilidad: ${getProfitMargin().toFixed(2)}
          </Typography>
          <Typography
            variant='subtitle1'
            component='p'
            align='center'
            sx={{
              mb: 4,
              color: '#ffffffff',
              textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            * El margen de utilidad se calcula tomando el costo de los productos y restandolo al precio total con descuento.
          </Typography>

          {promocion.promocionDetalle && promocion.promocionDetalle.length > 0 && (
            <>
              <Divider sx={{ mb: 3, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{
                  mb: 2,
                  color: '#f0f0f0',
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}
              >
                Artículos incluidos en la promoción:
              </Typography>
              <Grid container spacing={2}>
                {promocion.promocionDetalle.map((detalle, index) => (
                  <Grid size={{xs:12, sm:6, md:4}} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        p: 2,
                        backgroundColor: 'rgba(40, 40, 40, 0.8)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0px 4px 15px rgba(0,0,0,0.4)',
                        }
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'medium',
                          color: '#e0e0e0',
                          mb: 1,
                        }}
                      >
                        {detalle.articuloManufacturado?.denominacion || detalle.articuloInsumo?.denominacion || 'Artículo desconocido'}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'medium',
                          color: '#e0e0e0',
                          mb: 1,
                        }}
                      >
                       Valor: ${detalle.articuloManufacturado?.precioVenta?.toFixed(2) || detalle.articuloInsumo?.precioVenta?.toFixed(2) }
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 'medium',
                          color: '#e0e0e0',
                          mb: 1,
                        }}
                      >
                        Subtotal: ${detalle.articuloManufacturado ? 
                        ((detalle.articuloManufacturado.precioVenta as number) * (detalle.cantidad as number)).toFixed(2) : 
                        ((detalle.articuloInsumo?.precioVenta as number) * (detalle.cantidad as number)).toFixed(2)}
                      </Typography>
                      <Chip
                        label={`Cantidad: ${detalle.cantidad.toString()}`}
                        size="medium"
                        color="primary"
                        sx={{
                          backgroundColor: '#90CAF9',
                          color: '#1A2027',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {(!promocion.promocionDetalle || promocion.promocionDetalle.length === 0) && (
            <Typography variant="body1" align="center" sx={{ mt: 3, color: '#b0b0b0', fontStyle: 'italic' }}>
              No hay artículos detallados para esta promoción.
            </Typography>
          )}

          <Divider sx={{ mt: 3, mb: 3, bgcolor: 'rgba(255, 255, 255, 0.12)' }} />

          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAddPromocionToCart}
              sx={{
                backgroundColor: '#4CAF50',
                color: '#ffffff',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#388E3C',
                },
              }}
            >
              Agregar Promoción al Carrito
            </Button>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

export default PromocionDetails