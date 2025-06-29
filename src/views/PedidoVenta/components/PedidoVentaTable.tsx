import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Grid,
    TextField,
    Autocomplete,
    Modal, // Ensure Modal is imported if it's a custom component or from MUI
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from 'react'
import { PedidoVenta } from '../../../interfaces/PedidoVenta'
import { useNavigate } from 'react-router';
import { gePedidoVenta, getPedidoVentaByEmpleadoId, updateStatusPedidoVenta } from '../../../Api/PedidoVentaApi';
import { format } from 'date-fns';
import { Estado } from '../../../enums/Estado';
import axios from 'axios';

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

    const getPdf = async (id: string) => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/reportes/pdf?id=${id}`,
          {
            responseType: "blob",
            withCredentials: true,
          }
        );
        
        const contentDisposition = response.headers["content-disposition"];
        let filename = "reporte.pdf";

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }
        
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar el PDF:", error);
      }
    };
      
      
      

    useEffect(() => {
        listadoPedidosVenta()
    }, [])

    const getEstadoColor = (estado: Estado | null) => {
        switch (estado) {
            case Estado.PENDIENTE: return '#FFC107';
            case Estado.PREPARACION: return '#FF9800';
            case Estado.RECHAZADO: return '#4CAF50';
            case Estado.ENTREGADO: return '#66BB6A';
            case Estado.CANCELADO: return '#EF5350';
            default: return '#B0B0B0';
        }
    };

    return (
        <Box sx={{ p: 3, color: '#e0e0e0' }}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" component="h1" sx={{ color: '#f0f0f0', textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                    Listado de Pedidos de Venta
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => idEmpleado ? navigate(`/pedido-venta/crear/${idEmpleado}`) : navigate('/pedido-venta/crear')}
                    sx={{
                        backgroundColor: '#4CAF50', // Verde vibrante
                        '&:hover': {
                            backgroundColor: '#388E3C', // Verde más oscuro al pasar el ratón
                        },
                        color: '#ffffff',
                        px: 3,
                        py: 1.2,
                        borderRadius: '8px',
                    }}
                >
                    Crear Pedido
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress sx={{ color: '#90CAF9' }} />
                    <Typography variant="h6" sx={{ ml: 2, mt: 2, color: '#b0b0b0' }}>Cargando pedidos de venta...</Typography>
                </Box>
            ) : pedidosVenta && pedidosVenta.length > 0 ? (
                <TableContainer
                    component={Paper}
                    elevation={6}
                    sx={{
                        borderRadius: '12px',
                        backgroundColor: 'rgba(30, 30, 30, 0.9)',
                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <Table aria-label="tabla de pedidos venta">
                        <TableHead sx={{ backgroundColor: 'rgba(50, 50, 50, 0.9)' }}>
                            <TableRow>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Cliente</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Estado</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Tipo de Envío</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Subtotal</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Descuento</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Total</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Costo Total</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Forma de Pago</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', borderBottom: '1px solid #444' }}>Fecha del Pedido</TableCell>
                                <TableCell sx={{ color: '#f0f0f0', fontWeight: 'bold', width: '180px' }} align="center">Acciones</TableCell> {/* Ancho ajustado */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pedidosVenta.map((pedido) => (
                                <TableRow
                                    key={pedido?.id?.toString() || `temp-${pedido.fechaPedido?.toString()}`}
                                    sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(40, 40, 40, 0.8)' },
                                        '&:nth-of-type(even)': { backgroundColor: 'rgba(35, 35, 35, 0.8)' },
                                        '&:hover': { backgroundColor: 'rgba(60, 60, 60, 0.9) !important' },
                                        transition: 'background-color 0.3s ease',
                                    }}
                                >
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        {pedido.cliente?.nombre} {pedido.cliente?.apellido || ''}
                                    </TableCell>
                                    <TableCell sx={{ color: getEstadoColor(pedido?.estado as Estado), fontWeight: 'bold', borderBottom: '1px solid #333' }}>
                                        {pedido.estado || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        {pedido.tipoEnvio || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        ${pedido.subtotal?.toFixed(2) || '0.00'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        ${pedido.descuento?.toFixed(2) || '0.00'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        ${pedido.total?.toFixed(2) || '0.00'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        ${pedido.totalCosto?.toFixed(2) || '0.00'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        {pedido.formaPago || 'N/A'}
                                    </TableCell>
                                    <TableCell sx={{ color: '#e0e0e0', borderBottom: '1px solid #333' }}>
                                        {pedido.fechaPedido ? format(pedido.fechaPedido, 'dd/MM/yyyy HH:mm') : 'N/A'} {/* Incluye la hora */}
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderBottom: '1px solid #333' }}>
                                        <IconButton
                                            aria-label="ver"
                                            onClick={() => pedido.id && navigate(`/pedido-venta/ver/${pedido.id}`)}
                                            disabled={!pedido.id}
                                            sx={{ color: '#90CAF9', '&:hover': { backgroundColor: 'rgba(144, 202, 249, 0.1)' } }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="cambiar estado"
                                            onClick={() => { setViewFormStatus(true); setPedidoVenta(pedido); }}
                                            disabled={!pedido.id}
                                            sx={{ color: '#FFC107', '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' } }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label="cambiar estado"
                                            onClick={() => { getPdf(pedido?.id as string); }}
                                            disabled={!pedido.id}
                                            sx={{ color: 'rgb(255, 15, 7)', '&:hover': { backgroundColor: 'rgba(255, 15, 7, 0.1)' } }}
                                        >
                                            <PictureAsPdfIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(30, 30, 30, 0.9)',
                        color: '#e0e0e0',
                        boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Typography variant="h5" sx={{ color: '#f0f0f0', mb: 2 }}>
                        No hay pedidos de venta registrados. ¡Crea el primero!
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => idEmpleado ? navigate(`/pedido-venta/crear/${idEmpleado}`) : navigate('/pedido-venta/crear')}
                        sx={{
                            mt: 3,
                            backgroundColor: '#FFA726',
                            '&:hover': {
                                backgroundColor: '#FB8C00',
                            },
                            color: '#ffffff',
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px',
                        }}
                    >
                        Añadir Nuevo Pedido
                    </Button>
                </Paper>
            )}

            {/* Modal para actualizar el estado del pedido */}
            <Modal
                open={viewFormStatus}
                onClose={() => setViewFormStatus(false)}
                aria-labelledby="update-status-modal-title"
                aria-describedby="update-status-modal-description"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    elevation={10}
                    sx={{
                        p: 4,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(40, 40, 40, 0.95)',
                        color: '#e0e0e0',
                        boxShadow: '0px 12px 30px rgba(0, 0, 0, 0.6)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        maxWidth: '450px',
                        width: '90%',
                    }}
                >
                    <Typography variant="h5" id="update-status-modal-title" gutterBottom sx={{ color: '#f0f0f0', mb: 3 }}>
                        Estado actual del pedido
                    </Typography>
                    {pedidoVenta && (
                        <Grid container spacing={2}>
                            <Grid size={12} sx={{ mb: 2 }}>
                                <Autocomplete
                                    fullWidth
                                    id="estado-update"
                                    value={pedidoVenta?.estado as Estado}
                                    options={Object.values(Estado)}
                                    onChange={(_, newValue) => {
                                        if (newValue) {
                                            const newPedido: PedidoVenta = { ...pedidoVenta, estado: newValue };
                                            setPedidoVenta(newPedido);
                                        }
                                    }}
                                    getOptionLabel={(option: Estado) => option.toString()}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Nuevo Estado"
                                            variant="outlined"
                                            InputLabelProps={{ style: { color: '#b0b0b0' } }}
                                            InputProps={{
                                                ...params.InputProps,
                                                style: { color: '#ffffff' },
                                                sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' } }
                                            }}
                                            sx={{ '& .MuiFormHelperText-root': { color: '#ffb0b0' } }}
                                        />
                                    )}
                                    sx={{
                                        '& .MuiAutocomplete-inputRoot': { color: '#ffffff' },
                                        '& .MuiAutocomplete-clearIndicator': { color: '#b0b0b0' },
                                        '& .MuiAutocomplete-popupIndicator': { color: '#b0b0b0' },
                                    }}
                                    PaperComponent={({ children }) => (
                                        <Paper sx={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', color: '#e0e0e0' }}>
                                            {children}
                                        </Paper>
                                    )}
                                />
                            </Grid>
                            <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setViewFormStatus(false)}
                                    sx={{
                                        borderColor: '#90CAF9',
                                        color: '#90CAF9',
                                        '&:hover': {
                                            backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                            borderColor: '#90CAF9',
                                        },
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={async () => {
                                        if (pedidoVenta && pedidoVenta.id && pedidoVenta.estado) {
                                            try {
                                                const { data } = await updateStatusPedidoVenta(pedidoVenta.id, pedidoVenta.estado.toUpperCase().replace('Ó', 'O'));
                                                setViewFormStatus(false);
                                                setPedidoVenta(null);
                                                setPedidosVenta((prevPedidos) =>
                                                    (prevPedidos || []).map((pedido) =>
                                                        pedido.id === data.id ? data : pedido
                                                    )
                                                );
                                                alert("Estado del pedido actualizado con éxito");
                                            } catch (error) {
                                                alert("Error al actualizar el estado del pedido, falla en el servidor");
                                                console.error("Error updating order status:", error);
                                            }
                                        }
                                    }}
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        '&:hover': {
                                            backgroundColor: '#388E3C',
                                        },
                                        color: '#ffffff',
                                    }}
                                >
                                    Actualizar
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Modal>
        </Box>
    );
}

export default PedidoVentaTable