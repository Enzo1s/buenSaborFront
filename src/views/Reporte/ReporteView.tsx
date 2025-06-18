import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { PedidoVenta } from "../../interfaces/PedidoVenta";
import { gePedidoVenta } from "../../Api/PedidoVentaApi";
import { Grid } from "@mui/material";

const ReporteView = () => {

    const [pedidosVenta, setPedidosVenta] = useState([["", 0]]);
    const [grafo2, setgrafo2] = useState([["", 0]])

    useEffect(() => {
        const fetchPedidosVenta = async () => {
            try {
                const { data } = await gePedidoVenta();
                const preparacion = data.filter((pedido: PedidoVenta) => pedido.estado === "PREPARACION");
                const pendiente = data.filter((pedido: PedidoVenta) => pedido.estado === "PENDIENTE");
                const cancelado = data.filter((pedido: PedidoVenta) => pedido.estado === "CANCELADO");
                const rechazado = data.filter((pedido: PedidoVenta) => pedido.estado === "RECHAZADO");
                const entregado = data.filter((pedido: PedidoVenta) => pedido.estado === "ENTREGADO");
                setPedidosVenta([["Estado", "Cantidad"], [
                    "Preparacion",
                    preparacion ? preparacion.length : 0
                ],
                ["Pendiente",
                    pendiente ? pendiente.length : 0]
                    ,
                ["Cancelado",
                    cancelado ? cancelado.length : 0]
                    ,
                ["Rechazado",
                    rechazado ? rechazado.length : 0]
                    ,
                ["Entregado",
                    entregado ? entregado.length : 0]
                ]);

                const pagoEfectivo = data.filter((pedido: PedidoVenta) => pedido.formaPago === "EFECTIVO");
                const pagoMercado = data.filter((pedido: PedidoVenta) => pedido.formaPago === "MERCADOPAGO");
                setgrafo2([["Forma de pago", "Cantidad",{ role: "style" }], [
                    "Efectivo",
                    pagoEfectivo ? pagoEfectivo.length : 0,
                    "color:rgb(73, 161, 0)"
                ],
                ["MercadoPago",
                    pagoMercado ? pagoMercado.length : 0,
                    "color:rgb(40, 113, 182)"]
                ])
            } catch (error) {
                console.error("Error al obtener los pedidos de venta:", error);
            }
        }
        fetchPedidosVenta()
    }, [])

    const data = [
  ["Element", "Density", { role: "style" }],
  ["Copper", 8.94, "#b87333"], // RGB value
  ["Silver", 10.49, "silver"], // English color name
  ["Gold", 19.3, "gold"],
  ["Platinum", 21.45, "color: #e5e4e2"], // CSS-style declaration
];

    const options = {
        title: "Pedidos Venta por estado",
    };
    return (
        <>
        {pedidosVenta && 
        <Grid container spacing={2} >
            <Grid size={6} sx={{ margin: 'auto', padding: 2 }} justifyContent={"center"}  display={"flex"} >
        <Chart
            chartType="PieChart"
            data={pedidosVenta}
            options={options}
            width={"100%"}
            height={"400px"}
            />
            </Grid>
            <Grid size={6} sx={{ margin: 'auto', padding: 2 }} justifyContent={"center"}  display={"flex"} >
            <Chart chartType="ColumnChart" width="100%" height="400px" data={grafo2} />
            </Grid>
        </Grid>
            }
            </>
    );
}

export default ReporteView