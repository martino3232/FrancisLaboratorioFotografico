// functions/index.js

const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configura MercadoPago con el token del .env
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// Ruta para crear preferencia de pago
app.post('/create_preference', async (req, res) => {
  try {
    const { title, unit_price, quantity } = req.body;

    const preference = {
      items: [
        {
          title,
          unit_price: Number(unit_price),
          quantity: Number(quantity),
        },
      ],
      back_urls: {
        success: 'https://francisfotografia.onrender.com/success.html',
        failure: 'https://francisfotografia.onrender.com/failure.html',
        pending: 'https://francisfotografia.onrender.com/pending.html',
      },
      auto_return: 'approved',
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error('Error creando preferencia:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
