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
//directorio de archivos
const dirNotas = 'Archivos\\Notas';

// Ruta principal
app.get('/status', (req, res) => {
    console.log(date.toISOString() + " Conexión recibida");
    res.send(200);
    wLog(date.toISOString() + " Conexión recibida");
});

// Recibir texto de nota
app.post('/save', (req, res) => {
    console.log(date.toISOString() + " Solicitud de guardar nota recibida");
    const { nota } = req.body;
    console.log(nota);
    const {num} = req.body;
    console.log(num);

    res.send('Nota recibida');
    wLog(date.toISOString() + " Nota recibida enviada");
    //almacenar nota
    fs.writeFile(`${dirNotas}\\nota${num}.txt`, nota, (err) => {
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
    console.log(date.toISOString() + " Solicitud de leer notas recibida");

    fs.readdir(dirNotas, (err, archivos) => {
        if (err) {
            console.log(err);
            res.send('Error al leer directorio');
            wLog(date.toISOString() + " Error al leer directorio:" + err);
            return;
        } 

        // filtro de elementos txt
        const archivosTXT = archivos.filter(archivo => archivo.endsWith('.txt'));
        // procesar datos
        const datosProcesados = archivosTXT.map(archivo => {
            return new Promise((resolve, reject) => {
                fs.readFile(`${dirNotas}\\${archivo}`, 'utf-8', (err, datos) => {
                    if (err) {
                        reject(err);
                        console.log(err);
                    } else {
                        resolve({nombre: archivo.replace('.txt',''), datos});
                        console.log(" Nota leída");
                        wLog(date.toISOString() + " Nota leída");
                        }
                    }
                );}
            );}
        );

        Promise.all(datosProcesados).then(notas => {
            res.json(notas);
            console.log(notas)
            wLog(date.toISOString() + " Notas leídas enviadas");
        })
        .catch(err => {
            console.log(err);
            res.send('Error al leer notas');
            wLog(date.toISOString() + " Error al leer notas:" + err);
        });
    });
});

//Eliminar nota
app.delete('/delete', (req, res) => {
    console.log(date.toISOString() + " Solicitud de eliminar notas recibida");
    fs.readdir(dirNotas, (err, archivos) => {
        if (err) {
            console.log(err);
            res.send('Error al acceder al directorio de notas');
            wLog(date.toISOString() + " Error al acceder al directorio de notas:" + err);
        } else {
            archivos.forEach(element => {
                fs.unlink(`${dirNotas}\\${element}`, (err) => {
                    if (err) {
                        console.log(err);
                        wLog(date.toISOString() + " Error al eliminar nota:" + err);
                    } else {
                        console.log(" Nota eliminada");
                        wLog(date.toISOString() + `Nota ${element} elimina`);
                    }
                });                
            });
            res.send('Nota eliminada');
            wLog(date.toISOString() + " Notas eliminadas notificadas");
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
