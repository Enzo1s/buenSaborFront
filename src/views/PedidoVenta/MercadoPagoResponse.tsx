import { useEffect } from "react";
import { useNavigate } from "react-router";
import { MercadoPagoResponse as PaymentResponse } from "../../interfaces/MercadoPagoResponse";
import { useCartContext } from "../../Context/cartContext";
import { proccesPay } from "../../Api/DatosMPAPI";

const MercadoPagoResponse = () => {
  const navigate = useNavigate();
  const { clearCart } = useCartContext();

  useEffect(() => {
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

    if (response.status === "approved") clearCart();
    if(response.external_reference)
      proccesPay(response);

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(
        { pagoTerminado: true, status: response.status },
        window.origin
      );
    }

    setTimeout(() => {
      window.close();
    }, 500);
    
    navigate("/");
  }, [navigate, clearCart]);

  return null;
};

export default MercadoPagoResponse;
