/**
 * upload_productos.js
 *
 * Lee productos_con_descripciones.xlsx y sube:
 *  - cada fila a la colección "productos", usando el campo `sku` como ID de documento.
 *
 * Pasos previos:
 *  1. Instalar dependencias:
 *       npm install firebase-admin xlsx
 *  2. Colocar en la misma carpeta:
 *       - productos_con_descripciones.xlsx
 *       - firebase-admin.json   (tu clave de servicio Firebase)
 *  3. Ejecutar:
 *       node upload_productos.js
 */

const admin = require("firebase-admin");
const XLSX  = require("xlsx");
const path  = require("path");

// Inicializar Firebase Admin
const serviceAccount = require(path.join(__dirname, "firebase-admin.json"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Leer hoja de Excel
function readSheet(excelFile) {
  const wb = XLSX.readFile(path.join(__dirname, excelFile));
  const wsName = wb.SheetNames[0];
  const ws     = wb.Sheets[wsName];
  return XLSX.utils.sheet_to_json(ws, { defval: null });
}

// Subir productos (ID = sku)
async function uploadProductos() {
  const rows = readSheet("productos_con_descripciones_sobrescritas.xlsx");
  const batch = db.batch();
  const colRef = db.collection("productos");

  rows.forEach(row => {
    const docRef = colRef.doc(row.sku.toString());
    batch.set(docRef, {
      nombre:      row.nombre,
      tipo:        row.tipo,
      precio:      Number(row.precio),
      estado:      row.estado,
      urlImagen:   row.urlImagen,
      categoria:   row.categoria,
      descripcion: row.descripcion
    });
  });

  await batch.commit();
  console.log("✅ Productos subidos a Firestore");
}

// Ejecutar
(async () => {
  try {
    await uploadProductos();
    console.log("🎉 Productos cargados con éxito.");
  } catch (err) {
    console.error("❌ Error al subir productos:", err);
  }
})();
