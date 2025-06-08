
import { Payment } from '@mercadopago/sdk-react';
import { IPaymentBrickCustomization } from '@mercadopago/sdk-react/esm/bricks/payment/type';
import { PedidoVenta } from '../interfaces/PedidoVenta';
import { FacturaVenta } from '../interfaces/FacturaVenta';
import { FacturaVentaDetalle } from '../interfaces/FacturaVentaDetalle';
import { createFacturaVenta } from '../Api/FacturaVentaAPI';

interface MercadoPagoProps {
  idPreference: string;
  monto: number;
  pedidoVenta: PedidoVenta;
}

const MercadoPago = (props: MercadoPagoProps) => {
  const { idPreference, monto, pedidoVenta } = props


const initialization = {
 amount: monto,
 preferenceId: idPreference,
};
const customization:IPaymentBrickCustomization = {
 paymentMethods: {
   ticket: "all",
   creditCard: "all",
   prepaidCard: "all",
   debitCard: "all",
   mercadoPago: "all",
 },
};
const onSubmit = async (
 { selectedPaymentMethod, formData }: { selectedPaymentMethod: any; formData: any }
) => {
  console.log("selectedPaymentMethod" ,selectedPaymentMethod)
  console.log("formData" ,formData)
 // callback llamado al hacer clic en el botón enviar datos
 return new Promise<void>((resolve, reject) => {
   fetch("http://localhost:8080/api/datos-mercadopago/process_payment", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(formData),
   })
     .then((response) => response.json())
     .then(async (response) => {
      console.log(response)
      if(response.status === "approved"){
        const detalleFactura: FacturaVentaDetalle[] = []
        for(let i = 0; i < pedidoVenta.pedidoVentaDetalle.length; i++){
          detalleFactura.push({
            cantidad: pedidoVenta.pedidoVentaDetalle[i].cantidad,
            articuloInsumo: pedidoVenta.pedidoVentaDetalle[i].articuloInsumo,
            articuloManufacturado: pedidoVenta.pedidoVentaDetalle[i].articuloManufacturado,
            subTotal: pedidoVenta.pedidoVentaDetalle[i].subTotal,
            alta: null,
baja: null,
modificacion: null,
id:null
          })
        }
        const factura: FacturaVenta = {
          datosMP: response,
          descuento: pedidoVenta.descuento,
          gastosEnvio: pedidoVenta.gastosEnvio,
          id: null,
          alta: null,
          baja: null,
          modificacion: null,
          fechaFacturacion: new Date(),
          formaPago: 'MERCADOPAGO',
          numeroComprobante: new Date().getMilliseconds(),
          subTotal: pedidoVenta.subtotal,
          totalVenta: pedidoVenta.total,
          facturaVentaDetalle: detalleFactura
        }
        const {data } =await createFacturaVenta(factura)
        console.log(data)
      }
       resolve();
     })
     .catch((error) => {
       // manejar la respuesta de error al intentar crear el pago
       reject();
     });
 });
};
const onError = async (error: any) => {
 // callback llamado para todos los casos de error de Brick
 console.log(error);
};
const onReady = async () => {
 /*
   Callback llamado cuando el Brick está listo.
   Aquí puede ocultar cargamentos de su sitio, por ejemplo.
 */
};

return (
<Payment
   initialization={initialization}
   customization={customization}
   onSubmit={onSubmit}
   onReady={onReady}
   onError={onError}
/>

)

//   return (
// <Grid >
//   <Wallet initialization={{ preferenceId: idPreference, redirectMode: 'blank' }} customization={{
//         theme:'default',
//         customStyle: {
//             valuePropColor: 'white',
//             buttonHeight: '48px',
//             borderRadius: '6px',
//             verticalPadding: '8px',
//             horizontalPadding: '0px',
//             buttonBackground: 'blue',
//             hideValueProp: true,
//         }
//     }}
//     onReady={() => {console.log("onReady")}}
//   onError={() => {console.log("Error")}}
//   // onSubmit={() => console.log("submit")}
//   />
// </Grid>
//   );
};
export default MercadoPago