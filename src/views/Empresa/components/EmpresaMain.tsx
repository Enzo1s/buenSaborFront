import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Empresa } from '../../../interfaces/Empresa'
import { getEmpresas } from '../../../Api/EmpresaAPI'

const EmpresaMain = () => {
    
        const navigate = useNavigate()

    const [companies, setCompanies] = useState<Empresa[] | null>([])

    const getCompanies = async () => {
        const { data } = await getEmpresas()
        setCompanies(data)
    }

    useEffect(() => {
      getCompanies()
    }, [])
    
  return (
    <Grid container>
        <Button variant='contained'  color='primary' onClick={() => navigate('/empresa/crear')}>Crear Empresa</Button>
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
                    <TableRow key={index}>
                        <TableCell>{company.nombre}</TableCell>
                        <TableCell>{company.razonSocial}</TableCell>
                        <TableCell>{company.cuil.toString()}</TableCell>
                        <TableCell>
                            <Button variant='contained' color='primary' onClick={() => navigate(`/empresa/editar/${company.id}`)}>Editar</Button>
                        </TableCell>
                    </TableRow>
)}
                </TableBody>
                </Table>}
    </Grid>
  )
}

export default EmpresaMain