import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react'
import { PedidoVenta } from '../../../interfaces/PedidoVenta'
import { useNavigate } from 'react-router';
import { gePedidoVenta, getPedidoVentaByEmpleadoId, updateStatusPedidoVenta } from '../../../Api/PedidoVentaApi';
import { format } from 'date-fns';
import Modal from '../../../components/Modal';
import { Estado } from '../../../enums/Estado';

interface PedidoVentaTableProps {
  idEmpleado: string | null;
}

const PedidoVentaTable = (props: PedidoVentaTableProps) => {

  const { idEmpleado } = props

  const [pedidosVenta, setPedidosVenta] = useState<PedidoVenta[] | null>([])
  const [loading, setLoading] = useState(false)
  const [viewFormStatus, setViewFormStatus] = useState(false)
  const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null)

  const navigate = useNavigate()

  const listadoPedidosVenta = async () => {
    setLoading(true)
    if (idEmpleado) {
      const { data } = await getPedidoVentaByEmpleadoId(idEmpleado)
      setPedidosVenta(data)
      setLoading(false)
    } else {
      const { data } = await gePedidoVenta()
      setPedidosVenta(data)
      setLoading(false)
    }
  }

  useEffect(() => {
    listadoPedidosVenta()
  }, [])


  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Listado de Pedidos de venta
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => idEmpleado ? navigate(`/pedido-venta/crear/${idEmpleado}`) : navigate('/pedido-venta/crear')}
        >
          Crear Pedido
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Cargando pedidos venta...</Typography>
        </Box>
      ) : pedidosVenta && pedidosVenta.length > 0 ? (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: '8px' }}>
          <Table aria-label="tabla de pedidos venta">
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cliente</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo de envio</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Subtotal</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Descuento</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Costo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Forma de pago</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Fecha del Pedido</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '150px' }} align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pedidosVenta.map((pedido) => (
                <TableRow
                  key={pedido?.id?.toString() || `temp-${pedido.fechaPedido?.toString()}`}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
                >
                  <TableCell>{pedido.cliente?.nombre}</TableCell>
                  <TableCell>
                    {pedido.estado}
                  </TableCell>
                  <TableCell>
                    {pedido.tipoEnvio}
                  </TableCell>
                  <TableCell>
                    {pedido.subtotal}
                  </TableCell>
                  <TableCell>
                    {pedido.descuento}
                  </TableCell>
                  <TableCell>
                    {pedido.total}
                  </TableCell>
                  <TableCell>
                    {pedido.totalCosto}
                  </TableCell>
                  <TableCell>
                    {pedido.formaPago}
                  </TableCell>
                  <TableCell>
                    {pedido.fechaPedido ? format(pedido.fechaPedido, 'dd/MM/yyyy') : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => pedido.id && navigate(`/pedido-venta/ver/${pedido.id}`)}
                      disabled={!pedido.id}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => {setViewFormStatus(true); setPedidoVenta(pedido)}}
                      disabled={!pedido.id}
                    >
                      Estado
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary">
            No hay pedidos venta registradas. ¡Crea la primera!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => idEmpleado ? navigate(`/pedido-venta/crear/${idEmpleado}`) : navigate('/pedido-venta/crear')}
            sx={{ mt: 3 }}
          >
            Añadir Nuevo Pedido
          </Button>
        </Paper>
      )}

      {pedidoVenta && <Modal open={viewFormStatus} onClose={() => setViewFormStatus(false)} title="Estado actual del pedido">
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid size={12} sx={{ marginBottom: 2 }}>
            <Autocomplete
              fullWidth
              id="estado"
              value={pedidoVenta?.estado as Estado || null}
              options={Object.values(Estado)}
              onChange={(_, newValue) => {
                if (newValue) {
                  const key = Object.keys(Estado).find(k => Estado[k as keyof typeof Estado] === newValue);
                  const newPedido: PedidoVenta = { ...pedidoVenta, estado: key?.toString() as Estado }
                  setPedidoVenta(newPedido)
                }
              }}
              getOptionLabel={(option: Estado) => option.toString()}
              renderInput={(params) => <TextField {...params} label="Estado" />}
            />
            <Button variant="contained" color="primary" onClick={async () => {
              if (pedidoVenta && pedidoVenta.id) {
                try {
                  const { data } = await updateStatusPedidoVenta(pedidoVenta.id, pedidoVenta.estado)
                  setViewFormStatus(false)
                  setPedidoVenta(null)
                  setPedidosVenta((pedidosVenta ?? []).map((pedido) => pedido.id === data.id ? data : pedido));
                  alert("Estado del pedido actualizado con exito");
                } catch (error) {
                  alert("Error al actualizar el estado del pedido, falla en el servidor")
                }
              }
            }}>Actualizar</Button>
          </Grid>
        </Grid>
      </Modal>}
    </Box>
  );
}

export default PedidoVentaTable