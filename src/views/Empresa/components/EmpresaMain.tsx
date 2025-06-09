import { Button, Grid, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Empresa } from '../../../interfaces/Empresa'
import { deleteEmpresa, getEmpresas } from '../../../Api/EmpresaAPI'
import Modal from '../../../components/Modal';

const EmpresaMain = () => {

    const navigate = useNavigate()

    const [companies, setCompanies] = useState<Empresa[] | null>([])
    const [openDelete, setOpenDelete] = useState<{ open: boolean, id: String | null }>({ open: false, id: null })

    const getCompanies = async () => {
        const { data } = await getEmpresas()
        setCompanies(data)
    }

    const handleDelete = async (id: String) => {
        try {
            await deleteEmpresa(id);
            setOpenDelete({ open: false, id: null })
        } catch (error) {
            console.error("Error eliminando empresa:", error);
        }
    }

    useEffect(() => {
        getCompanies()
    }, [])

    return (
        <Grid container>
            <Button variant='contained' color='primary' onClick={() => navigate('/empresa/crear')}>Crear Empresa</Button>
            {companies &&
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Razon Social</TableCell>
                            <TableCell>CUIT</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {companies.map((company, index) =>
                            <>
                                <TableRow key={index}>
                                    <TableCell>{company.nombre}</TableCell>
                                    <TableCell>{company.razonSocial}</TableCell>
                                    <TableCell>{company.cuil.toString()}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => navigate(`/empresa/ver/${company.id}`)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="secondary" onClick={() => navigate(`/empresa/editar/${company.id}`)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => setOpenDelete({ open: true, id: company?.id })}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            </>
                        )}
                    </TableBody>
                </Table>}
            <Modal open={openDelete.open} onClose={() => setOpenDelete({ open: false, id: null })} title="Crear Categoria">
                <Grid container spacing={2} sx={{ padding: 2 }}>
                    <Grid size={12}>
                        <Typography variant="h5">¿Desea eliminar la empresa?</Typography>
                        <Typography variant="body1">Se perderan todos los datos asociados a la empresa como sucursales, clientes, empleados y usuarios</Typography>
                    </Grid>
                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="contained" color="error" onClick={() => handleDelete(openDelete.id ?? "")}>Eliminar</Button>
                    </Grid>
                </Grid>
            </Modal>
        </Grid>
    )
}

export default EmpresaMain