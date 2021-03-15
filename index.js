const express = require('express');
const conectarDB = require('./config/db');
const cors = require ('cors')

//Crear el servidor 
const app = express();

//Conectar a la base de datos
conectarDB()

//Habilitar cors
app.use(cors())

//Habilitar express.json
app.use(express.json({extends: true}));

//puerto de la App
const PORT = process.env.PORT || 4000;

//importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tarea', require('./routes/tarea'));

//Arrabcar la app
app.listen(PORT, () =>{
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
})
