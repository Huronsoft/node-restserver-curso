const express = require('express');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

const _ = require('underscore');
const { verificatoken, verificaAdmin_Role } = require('../middkewares/autenticacion')
const app = express();



app.get('/categoria', verificatoken, (req, res) => {
    //todas las categorias

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });
});

app.get('/categoria/:id', verificatoken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID  no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB

        });

    });

});


app.post('/categoria', [verificatoken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});


app.put('/categoria/:id', [verificatoken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    console.log(descCategoria);
    console.log(id);


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });





    });
});

app.delete('/categoria/:id', [verificatoken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    Categoria.findOneAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    })
});

module.exports = app;