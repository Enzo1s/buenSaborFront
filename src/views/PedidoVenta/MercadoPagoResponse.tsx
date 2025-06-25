import { useEffect } from "react";
import { useNavigate} from "react-router";
import { MercadoPagoResponse as PaymentResponse } from "../../interfaces/MercadoPagoResponse";
import { useCartContext } from "../../Context/cartContext";
import { proccesPay } from "../../Api/DatosMPAPI";

const MercadoPagoResponse = () => {
  const navigate = useNavigate();
  const {clearCart} = useCartContext();

  useEffect(() => 
  {
    const params = new URLSearchParams(window.location.search);

    const response: PaymentResponse = {
      collection_id: params.get("collection_id") || "",
      collection_status: params.get("collection_status") || "",
      payment_id: params.get("payment_id") || "",
      status: params.get("status") || "",
      external_reference: params.get("external_reference"),
      payment_type: params.get("payment_type") || "",
      merchant_order_id: params.get("merchant_order_id") || "",
      preference_id: params.get("preference_id") || "",
      site_id: params.get("site_id") || "",
      processing_mode: params.get("processing_mode") || "",
      merchant_account_id: params.get("merchant_account_id"),
    };
    
    // console.log("Respuesta de Mercado Pago recibida:", response);

    // let mensaje = "";
    
    // switch (response.status) {
    //   case "approved":
    //     mensaje = "Pago exitoso";
        
    //     clearCart();
    //     break;
    //   case "pending":
    //     mensaje = "Pago pendiente";
    //     break;
    //   case "rejected":
    //     mensaje = "Pago rechazado";
    //     break;
    //   default:
    //     mensaje = "Error en el pago";
    //     break;
    // }

    if (response.status === "approved") clearCart();
    
    proccesPay(response);
    navigate("/");
  }, []);

  return null;
};

export default MercadoPagoResponse;
