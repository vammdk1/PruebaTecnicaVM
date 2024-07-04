// Importar elementos necesarios
const express = require('express');
const fs = require('fs');
// Crear una instancia de la aplicación Express
const app = express();
// Configurar la aplicación para que pueda recibir JSON
app.use(express.json());
// Escuchar en puerto 
const port = 8080;
//fecha para ordenar logs
const date = new Date();

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('Hola Mundo');
})

// Recibir texto de nota
app.post('/save', (req, res) => {
    console.log(date.toISOString() + " Solicitud de guardar nota recibida");
    const { text } = req.body;
    console.log(text);
    res.send('Nota recibida');
    //almacenar nota
    fs.writeFile('nota.txt', text, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(date.toISOString() + " Nota guardada");
    });
});

// Leer texto de nota
app.get('/read', (req, res) => {
    console.log(date.toISOString() + " Solicitud de leer nota recibida");
    fs.readFile('nota.txt', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.send('Error al leer nota');
        } else {
            console.log(data);
            res.send(data);
        }
    });
});

//Eliminar nota
app.delete('/delete', (req, res) => {
    console.log(date.toISOString() + " Solicitud de eliminar notas recibida");
    fs.unlink('nota.txt', (err) => {
        if (err) {s
            console.log(err);
            res.send('Error al eliminar nota');
        } else {
            console.log(date.toISOString() + " Nota eliminada");
            res.send('Nota eliminada');
        }
    });
});

app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
});
