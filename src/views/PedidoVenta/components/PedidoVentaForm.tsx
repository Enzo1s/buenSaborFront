import { Autocomplete, Box, Button, Grid, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { PedidoVenta } from '../../../interfaces/PedidoVenta'
import { createPedidoVenta, getPedidoVentaById } from '../../../Api/PedidoVentaApi'
import { Empleado } from '../../../interfaces/Empleado';
import { getByIdEmpleado } from '../../../Api/EmpleadoAPI';
import CardArticulos from './CardArticulos';
import { ArticuloInsumo } from '../../../interfaces/ArticuloInsumo';
import { ArticuloManufacturado } from '../../../interfaces/ArticuloManufacturado';
import { addItemToCart } from '../utils/addAndRemove';
import { Estado } from '../../../enums/Estado';
import { TipoEnvio } from '../../../enums/TipoEnvio';
import { FormaPago } from '../../../enums/FormaPago';
import { getAllArticuloManufacturado } from '../../../Api/ArticuloManufacturadoAPI';
import { getListArticuloInsumo } from '../../../Api/ArticuloInsumo';
import { format } from 'date-fns';
import Modal from '../../../components/Modal';
import { createPreference } from '../../../Api/DatosMPAPI';
import MercadoPago from '../../../components/MercadoPago';
import { getSucursales } from '../../../Api/SucursalAPI';
import { SucursalEmpresa } from '../../../interfaces/SucursalEmpresa';
import PagoModal from './PagoModal';
import { useAuth } from '../../../Context/authContext';
import { Promocion } from '../../../interfaces/Promocion';
import { getPromociones } from '../../../Api/PromocionAPI';

interface CardArticulosProps {
    imagen: string,
    titulo: string,
    descripcion: string,
    articuloManufacturado?: ArticuloManufacturado,
    articuloInsumo?: ArticuloInsumo
}

const PedidoVentaForm = () => {

    const { id, idEmpleado } = useParams();
    const [pedidoVenta, setPedidoVenta] = useState<PedidoVenta | null>(null)
    const [openModal, setOpenModal] = useState(false)
    const [empleado, setEmpleado] = useState<Empleado | null>(null)
    const [viewForm, setViewForm] = useState(false)
    const [idPreference, setIdPreference] = useState(null)
    const [sucursales, setSucursales] = useState<SucursalEmpresa[]>([])
    const [viewFormBuy, setViewFormBuy] = useState(false)
    const [promociones, setpromociones] = useState<Promocion[]>([])

    const { empleado: user } = useAuth()

    const [listCard, setListCard] = useState<CardArticulosProps[]>([])

    const getManufacturados = async () => {
        const { data: manufacturados } = await getAllArticuloManufacturado()
        const cardProps: CardArticulosProps[] = manufacturados.map((articulo: ArticuloManufacturado) => ({
            imagen: articulo.pathImagen[0],
            titulo: articulo.denominacion,
            descripcion: `$${articulo.precioVenta} tiempo estimado: ${articulo.tiempoEstimado} minutos ${articulo.descripcion}`,
            articuloManufacturado: articulo
        }))
        const { data } = await getListArticuloInsumo()
        const insumos = data.filter((insumo: ArticuloInsumo) => insumo.esParaElaborar === false)
        const insumosCardProps: CardArticulosProps[] = insumos.map((articulo: ArticuloInsumo) => ({
            imagen: articulo.pathImagen[0],
            titulo: articulo.denominacion,
            descripcion: `$${articulo.precioVenta} Tipo de producto: ${articulo.categoriaArticulo.map((categoria) => categoria.denominacion).join(", ")}`,
            articuloInsumo: articulo
        }))
        setListCard([...listCard, ...cardProps, ...insumosCardProps])
    }

    const getPedidoVenta = async () => {
        if (id) {
            const { data } = await getPedidoVentaById(id)
            setPedidoVenta(data)
        } else {
            setPedidoVenta({
                id: null,
                horaEstimadaFinalizacion: new Date(),
                subtotal: 0,
                descuento: 0,
                gastosEnvio: 0,
                total: 0,
                totalCosto: 0,
                estado: Estado.PENDIENTE.toUpperCase(),
                tipoEnvio: TipoEnvio.TAKEAWAY.toUpperCase(),
                formaPago: FormaPago.EFECTIVO.toUpperCase(),
                empleado: empleado || null,
                sucursal: null,
                cliente: null,
                factura: null,
                pedidoVentaDetalle: null,
                fechaPedido: new Date(),
                alta: null,
                baja: null,
                modificacion: null
            })
        }
    }

    const getEmpleado = async () => {
        if (idEmpleado) {
            const { data } = await getByIdEmpleado(idEmpleado)
            setEmpleado(data)
        } else {
            setEmpleado(user)
        }
    }

    const listadoPromociones = async () => {
        const { data } = await getPromociones()
        setpromociones(data)
        console.log("promociones por fechas",data)
    }

    const validacion = () => {
        if (pedidoVenta) {
            if (!pedidoVenta.sucursal) {
                alert("Debe seleccionar una sucursal")
                return
            }
            if (pedidoVenta.pedidoVentaDetalle?.length === 0) {
                alert("Debe agregar al menos un articulo")
                return
            }
            setPedidoVenta({
                ...pedidoVenta,
                formaPago: FormaPago.EFECTIVO.toUpperCase()
            })
            setViewFormBuy(true)
            setOpenModal(false)
        }
    }

    const buy = async () => {
        try {
            validacion()
            if (pedidoVenta) {
                const { data } = await createPedidoVenta(pedidoVenta)
                const response = await createPreference(data.id)
                setIdPreference(response.data.idPreference)
                setViewForm(true)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const agregarArticulo = (insumo: ArticuloInsumo | null, manufacturado: ArticuloManufacturado | null) => {
        const newPedido = addItemToCart(insumo, manufacturado, null, 1, pedidoVenta)
        setPedidoVenta(newPedido)
    }

    const handleSubmit = async () => {
        if (pedidoVenta) {
            try {
                const { data } = await createPedidoVenta({ ...pedidoVenta, empleado: empleado || null })
                setPedidoVenta(data)
                setViewFormBuy(false)
                setOpenModal(false)
                alert("Compra realizada con exito");
                getPedidoVenta()
            } catch (error) {
                alert("Error al realizar la compra, falla en el servidor")
            }
        }
    }

    const listadoSucursales = async () => {
        const { data } = await getSucursales()
        setSucursales(data)
    }

    useEffect(() => {
        getPedidoVenta()
        listadoPromociones()
        getManufacturados()
        listadoSucursales()
        getEmpleado()
    }, [])


    return (
        <Grid container spacing={2} alignContent={"center"} justifyContent={"center"} >
            <Grid size={12} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Typography variant='h4' >Nuevo Pedido</Typography>
            </Grid>
            <Grid container size={8} spacing={2}>
                {listCard && listCard.map((card, index) =>
                    <Grid size={3} onClick={() => agregarArticulo(card.articuloInsumo || null, card.articuloManufacturado || null)}>
                        <CardArticulos key={index} imagen={card.imagen} titulo={card.titulo} descripcion={card.descripcion} />
                    </Grid>
                )}
            </Grid>
            <Grid container size={4} spacing={2}>
                <Grid size={12}>
                    <Grid container spacing={2}>
                        <Grid size={11}>
                            <Autocomplete
                                fullWidth
                                id="sucursal"
                                value={pedidoVenta?.sucursal || null}
                                options={sucursales}
                                onChange={(_, newValue) => {
                                    const sucursal = newValue as SucursalEmpresa || null
                                    if (sucursal) {
                                        setPedidoVenta({
                                            ...pedidoVenta,
                                            sucursal
                                        } as PedidoVenta)
                                    }
                                }}
                                getOptionLabel={(option: SucursalEmpresa) => option.nombre as string}
                                renderInput={(params) => <TextField {...params} label="Sucursal" />}
                            />
                        </Grid>
                        <Grid size={5} sx={{ marginBottom: 2 }}>
                            <Autocomplete
                                fullWidth
                                id="rol"
                                value={TipoEnvio[pedidoVenta?.tipoEnvio as unknown as keyof typeof TipoEnvio] || pedidoVenta?.tipoEnvio}
                                options={Object.values(TipoEnvio)}
                                onChange={(_, newValue) => {
                                    const tipoEnvio = Object.keys(TipoEnvio).find(k => TipoEnvio[k as keyof typeof TipoEnvio] === newValue);
                                    if (tipoEnvio) {
                                        setPedidoVenta({
                                            ...pedidoVenta,
                                            tipoEnvio
                                        } as PedidoVenta)
                                    }
                                }}
                                getOptionLabel={(option: TipoEnvio) => option}
                                renderInput={(params) => <TextField {...params} label="Tipo de Envío" />}
                            />
                        </Grid>
                        <Grid size={12} sx={{ marginBottom: 2 }}>
                            <Typography variant='h5'>Hora finalizacion: {pedidoVenta && pedidoVenta.horaEstimadaFinalizacion ? format(pedidoVenta?.horaEstimadaFinalizacion, 'HH:mm') : format(new Date(), 'HH:mm')}</Typography>
                        </Grid>
                        <Grid size={23} sx={{ marginBottom: 2, borderBottom: 1 }}>
                            {pedidoVenta && pedidoVenta.pedidoVentaDetalle && pedidoVenta.pedidoVentaDetalle.map((detalle, index) =>
                                <Box key={index} display={"flex"} justifyContent={"space-between"}>
                                    <Typography variant='h5'>Articulo: {detalle.articuloInsumo ? detalle.articuloInsumo.denominacion : detalle?.articuloManufacturado?.denominacion}</Typography>
                                    <Typography variant='h5'>Cantidad: {detalle.cantidad}</Typography>
                                    <Typography variant='h5'>Precio: ${detalle.articuloInsumo ? detalle.articuloInsumo.precioVenta.toFixed(2) : detalle?.articuloManufacturado?.precioVenta.toFixed(2)}</Typography>
                                </Box>
                            )}
                        </Grid>
                        <Grid size={12} sx={{ marginBottom: 2 }} display={"flex"} justifyContent={"space-between"}>
                            <Typography variant='h5'>Subtotal: </Typography>
                            <Typography variant='h5'> ${pedidoVenta ? pedidoVenta.subtotal.toFixed(2) : 0}</Typography>
                        </Grid>
                        <Grid size={12} sx={{ marginBottom: 2 }} display={"flex"} justifyContent={"space-between"}>
                            <Typography variant='h5'>Descuento: </Typography>
                            <Typography variant='h5'> ${pedidoVenta ? pedidoVenta.descuento.toFixed(2) : 0}</Typography>
                        </Grid>
                        <Grid size={12} sx={{ marginBottom: 2 }} display={"flex"} justifyContent={"space-between"}>
                            <Typography variant='h5'>Total: </Typography>
                            <Typography variant='h5'> ${pedidoVenta ? pedidoVenta.total.toFixed(2) : 0}</Typography>
                        </Grid>
                    </Grid>
                    <Button type='button' variant='contained' color='success' onClick={() => setOpenModal(true)}>Guardar</Button>
                </Grid>
            </Grid>
            <Modal open={openModal} onClose={() => setOpenModal(false)} title={"Elija la forma de pago"} >
                <Grid display={"flex"} justifyContent={"space-between"} sx={{ margin: '10px', width: '30rem' }} size={12}>
                    <Button type='button' variant='contained' color='primary' onClick={buy}>Mercado Pago</Button>
                    <Button type='button' variant='contained' color='success' onClick={validacion}>Efectivo</Button>
                </Grid>
            </Modal>
            <Modal open={viewForm} onClose={() => setViewForm(false)} title="Método de pago">
                {idPreference && pedidoVenta && <Grid sx={{ marginTop: '10px' }} size={12}>
                    <MercadoPago idPreference={idPreference} monto={pedidoVenta?.total || 10} pedidoVenta={pedidoVenta} />
                </Grid>
                }
            </Modal>
            {viewFormBuy &&
                <Modal open={viewFormBuy} onClose={() => setViewFormBuy(false)} title="Método de pago">
                    <PagoModal pedidoVenta={pedidoVenta} handleSubmit={handleSubmit} />
                </Modal>}
        </Grid>
    )
}

export default PedidoVentaForm