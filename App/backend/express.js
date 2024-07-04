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

// Ruta principal
app.get('/status', (req, res) => {
    console.log(date.toISOString() + " Conexión recibida");
    res.send(200);
    wLog(date.toISOString() + " Conexión recibida");
});

// Recibir texto de nota
app.post('/save', (req, res) => {
    console.log(date.toISOString() + " Solicitud de guardar nota recibida");
    const { text } = req.body;
    console.log(text);
    res.send('Nota recibida');
    //almacenar nota
    fs.writeFile('Archivos\\notas\\nota.txt', text, (err) => {
        if (err) {
            console.log(err);
            wLog(date.toISOString() + " Error al guardar nota:" + err);
        }
        console.log(date.toISOString() + " Nota guardada");
        wLog(date.toISOString() + " Nota guardada");
    });
});

// Leer texto de nota
app.get('/read', (req, res) => {
    console.log(date.toISOString() + " Solicitud de leer nota recibida");
    fs.readFile('Archivos\\notas\\nota.txt', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            res.send('Error al leer nota');
            wLog(date.toISOString() + " Error al leer nota:" + err);
        } else {
            console.log(data);
            wLog(date.toISOString() + " Nota leída:" + data);
            res.send(data);
            wLog(date.toISOString() + " Nota enviada:" + data);
        }
    });
});

//Eliminar nota
app.delete('/delete', (req, res) => {
    console.log(date.toISOString() + " Solicitud de eliminar notas recibida");
    fs.unlink('Archivos\\notas\\nota.txt', (err) => {
        if (err) {
            console.log(err);
            res.send('Error al eliminar nota');
            wLog(date.toISOString() + " Error al eliminar nota:" + err);
        } else {
            console.log(" Nota eliminada");
            wLog(date.toISOString() + " Nota eliminada");
            res.send('Nota eliminada');
            wLog(date.toISOString() + " Nota eliminada enviada");
        }
    });
});

//log
function wLog(texto) {
    //si no existe el fichero log.txt, se crea
    if(!fs.existsSync('Archivos\\Log\\log.txt')){
        fs.writeFile('Archivos\\Log\\log.txt', '', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    //escribir en el fichero log.txt
    fs.appendFile('Archivos\\Log\\log.txt', texto + '\n', (err) => {
        if (err) {
            console.log(err);
        }
    });
}


// Iniciar la aplicación en el puerto
app.listen(port, () => {
    console.log(`La aplicación está corriendo en http://localhost:${port}`);
    wLog(date.toISOString() + " Aplicación iniciada en http://localhost:" + port);
});
