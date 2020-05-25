const express = require('express');
const { verificatoken } = require('../middkewares/autenticacion')
const Producto = require('../models/producto');

const app = express();




app.get('/producto', verificatoken, (req, res) => {
    //todas las categorias

    Producto.find({ disponible: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });

        });
});

app.get('/producto/:id', verificatoken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'PRODUCTO  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB

        });

    });

});

//===========================================
// Buscar productos
//============================================

app.get('/producto/buscar/:termino', verificatoken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // expresiones regulares es como %like la 'i' es para que sea insencible a las mayusculas o min


    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });









})


app.post('/producto', verificatoken, (req, res) => {

    let body = req.body;

    let precioUni = Number(body.precioUni);

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});


app.put('/producto/:id', verificatoken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no encontrado'
                }
            });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = Number(body.precioUni);
        productoDB.categoria = body.categoria;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;


        productoDB.save((err, produtoGuartdado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: produtoGuartdado
            });

        });

    });

});

app.delete('/producto/:id', verificatoken, (req, res) => {

    let id = req.params.id;

    let DeleteProducto = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, DeleteProducto, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});
module.exports = app;