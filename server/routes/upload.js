const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const app = express();
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningun archivo'

                }



            });
    }
    // Validar tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Las tipos permitids son ' + tiposValidos.join(', '),
                    tipo: tipo
                }
            });
    }



    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1].toLocaleLowerCase('tr');

    // Extensiones permitidas 
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpge'];


    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                    ext: extension
                }
            });
    }

    let nombreArh = archivo.name.toLocaleLowerCase('tr');


    //cambiar nombre del archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // Aqui imagen cargada 
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);

        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            if (err) {
                borrarArchivo(nombreArchivo, 'productos');
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'productos no existe'
                    }
                });
            }
        }

        //  console.log(productoBD.img);

        borrarArchivo(productoBD.img, 'productos');


        productoBD.img = nombreArchivo;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    })
}

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, UsuarioBD) => {

        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!UsuarioBD) {
            if (err) {
                borrarArchivo(nombreArchivo, 'usuarios');
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Usuario no existe'
                    }
                });
            }
        }

        borrarArchivo(UsuarioBD.img, 'usuarios');


        UsuarioBD.img = nombreArchivo;

        UsuarioBD.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    })
}

function borrarArchivo(nombreImgen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImgen}`);

    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg)
    }
}


module.exports = app;