const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificatoken, verificaTokenImagen } = require('../middkewares/autenticacion')



app.get('/imagen/:tipo/:img', verificaTokenImagen, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);

    } else {
        let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noImagePath);
    }
});

module.exports = app;