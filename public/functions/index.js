// functions/index.js
require('dotenv').config();
const functions   = require('firebase-functions');
const mercadopago = require('mercadopago');

mercadopago.configure({ access_token: process.env.MERCADOPAGO_ACCESS_TOKEN });
const frontendHost = "https://7ff7-2800-810-552-34c-81ea-d902-74fc-f36e.ngrok-free.app";

exports.createPreferenceHttp = functions.https.onRequest(async (req, res) => {
  // 🔥 Agregar CORS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // Manejar preflight
  if (req.method === "OPTIONS") return res.status(204).send('');

  if (req.method !== 'POST') return res.status(405).send('Only POST');
  
  const { total, paymentType } = req.body;
  if (typeof total !== 'number') return res.status(400).send('`total` must be number');

  const preference = {
    items: [{ title: "Compra FrancisColor", quantity: 1, currency_id: "ARS", unit_price: total }],
    payment_methods: paymentType !== 'mercadopago' ? {
      excluded_payment_types: [{ id: paymentType === 'credit-card' ? 'debit_card' : 'credit_card' }]
    } : {},
    back_urls: {
      success: `${frontendHost}/screens/proceso/completarcompra.html?success=true`,
      failure: `${frontendHost}/screens/proceso/cart.html`,
      pending: `${frontendHost}/screens/proceso/cart.html`
    },
    auto_return: "approved"
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).send("Error interno al crear la preferencia de pago.");
  }
});
