const express = require('express');
const app = express();

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/escuela");

app.get('/', (req, res) => {
  res.send('Hola, Mundo!!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto: ${PORT}`);
});