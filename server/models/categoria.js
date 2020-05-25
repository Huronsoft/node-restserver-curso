const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Schema = mongoose.Schema;


let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        //    unique: true,
        required: [true, 'El descripcion es necesario']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }

});

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} categoria debe ser unica' });

module.exports = mongoose.model('Categoria', categoriaSchema);