// functions/index.js

const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configura MercadoPago con el token del .env
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const preferenceClient = new mercadopago.Preference(mp);

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

    const response = await preferenceClient.create({ body: preference });
    res.json({ id: response.id });
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
