import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { PedidoVenta } from "../../interfaces/PedidoVenta";
import { gePedidoVenta } from "../../Api/PedidoVentaApi";
import { FormaPago } from "../../enums/FormaPago";

const ReporteView = () => {
    const [graficoEstado, setGraficoEstado] = useState<(string | number)[][]>([
      ["Estado", "Cantidad"],
    ]);
    const [graficoFormaPago, setGraficoFormaPago] = useState<
      (string | number | object)[][]
    >([["Forma de pago", "Cantidad", { role: "style" }]]);
    const [graficoPorProducto, setGraficoPorProducto] = useState<
      (string | number)[][]
    >([["Producto", "Cantidad"]]);
    const [graficoPorEmpleado, setGraficoPorEmpleado] = useState<
      (string | number)[][]
    >([["Empleado", "Cantidad"]]);
    

  useEffect(() => {
    const fetchPedidosVenta = async () => {
      try {
        const { data } = await gePedidoVenta();

        const estados = [
          "PREPARACION",
          "PENDIENTE",
          "CANCELADO",
          "RECHAZADO",
          "ENTREGADO",
        ];
        const estadoData = [["Estado", "Cantidad"]];
        estados.forEach((estado) => {
          const cantidad = data.filter(
            (pedido : PedidoVenta) => pedido.estado === estado
          ).length;
          estadoData.push([estado, cantidad]);
        });
        setGraficoEstado(estadoData);

        const pagoEfectivo = data.filter(
          (pedido : PedidoVenta) => pedido.formaPago === FormaPago.EFECTIVO
        );
        const pagoMercado = data.filter(
          (pedido : PedidoVenta) => pedido.formaPago === FormaPago.MERCADOPAGO
        );
        setGraficoFormaPago([
          ["Forma de pago", "Cantidad", { role: "style" }],
          ["Efectivo", pagoEfectivo.length, "color:rgb(73, 161, 0)"],
          ["MercadoPago", pagoMercado.length, "color:rgb(40, 113, 182)"],
        ]);

        const productoMap = new Map<string, number>();
        data.forEach((pedido : PedidoVenta) => {
          pedido.pedidoVentaDetalle?.forEach((detalle) => {
            const nombre =
              detalle.articuloManufacturado?.denominacion ?? "Desconocido";
            const cantidad = detalle.cantidad ?? 0;
            productoMap.set(nombre, (productoMap.get(nombre) ?? 0) + cantidad);
          });
        });
        const productoData = [["Producto", "Cantidad"]];
        productoMap.forEach((cantidad, nombre) => {
          productoData.push([nombre, cantidad]);
        });
        setGraficoPorProducto(productoData);

        const empleadoMap = new Map<string, number>();
        data.forEach((pedido : PedidoVenta) => {
          const nombre = pedido.empleado?.nombre ?? "Sin asignar";
          empleadoMap.set(nombre, (empleadoMap.get(nombre) ?? 0) + 1);
        });
        const empleadoData = [["Empleado", "Cantidad"]];
        empleadoMap.forEach((cantidad, nombre) => {
          empleadoData.push([nombre, cantidad]);
        });
        setGraficoPorEmpleado(empleadoData);
      } catch (error) {
        console.error("Error al obtener los pedidos de venta:", error);
      }
    };

    fetchPedidosVenta();
  }, []);

  const optionsEstado = {
    title: "Pedidos por estado",
    pieHole: 0.4,
  };

  const optionsFormaPago = {
    title: "Ventas por forma de pago",
    legend: "none",
    hAxis: { title: "Forma de pago" },
    vAxis: { title: "Cantidad" },
  };

  const optionsProducto = {
    title: "Ventas por producto",
    legend: "none",
    hAxis: { title: "Cantidad vendida" },
    vAxis: { title: "Producto" },
  };

  const optionsEmpleado = {
    title: "Ventas por empleado",
    legend: "none",
    hAxis: { title: "Empleado" },
    vAxis: { title: "Cantidad de pedidos" },
  };

  const gridContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    padding: "16px",
    justifyContent: "flex-start",
  };

  const chartItemStyle: React.CSSProperties = {
    flex: "1 1 calc(49% - 16px)",
    minWidth: "400px",
    maxWidth: "100%",
  };

  return (
    <div style={gridContainerStyle}>
      <div style={chartItemStyle}>
        <Chart
          chartType="PieChart"
          data={graficoEstado}
          options={optionsEstado}
          width="100%"
          height="500px"
        />
      </div>
      <div style={chartItemStyle}>
        <Chart
          chartType="ColumnChart"
          data={graficoFormaPago}
          options={optionsFormaPago}
          width="100%"
          height="500px"
        />
      </div>
      <div style={chartItemStyle}>
        <Chart
          chartType="BarChart"
          data={graficoPorProducto}
          options={optionsProducto}
          width="100%"
          height="500px"
        />
      </div>
      <div style={chartItemStyle}>
        <Chart
          chartType="BarChart"
          data={graficoPorEmpleado}
          options={optionsEmpleado}
          width="100%"
          height="500px"
        />
      </div>
    </div>
  );
};

export default ReporteView;
