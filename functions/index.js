const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Configurar MercadoPago con token desde .env
const mp = new mercadopago.MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preferenceClient = new mercadopago.Preference(mp);

// Ruta vieja
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
        success: 'https://francislaboratoriofotografico.onrender.com/success.html',
        failure: 'https://francislaboratoriofotografico.onrender.com/failure.html',
        pending: 'https://francislaboratoriofotografico.onrender.com/pending.html',
      },
      auto_return: 'approved',
    };

    const response = await preferenceClient.create({ body: preference });
    res.json({ id: response.id });
  } catch (error) {
    console.error('Error en /create_preference:', error);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

// Ruta nueva para Render
app.post('/createPreferenceHttp', async (req, res) => {
  try {
    const { total, paymentType } = req.body;

    const preference = {
      items: [
        {
          title: 'Compra en Francis Color',
          unit_price: Number(total),
          quantity: 1,
        },
      ],
      back_urls: {
        success: 'https://francislaboratoriofotografico.onrender.com/completarcompra.html?success=true',
        failure: 'https://francislaboratoriofotografico.onrender.com/completarcompra.html?success=false',
      },
      auto_return: 'approved',
    };

    const response = await preferenceClient.create({ body: preference });
    res.json({ init_point: response.init_point });
  } catch (err) {
    console.error('Error en /createPreferenceHttp:', err);
    res.status(500).json({ error: 'Error al crear preferencia' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express corriendo en puerto ${PORT}`);
});
