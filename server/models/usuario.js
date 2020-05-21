const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let Shema = mongoose.Schema;


let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};


let usuarioSchema = new Shema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'la contraseña  es obligatoria']
    },
    img: {
        type: String,
        required: [false, 'Imagen opcional']
    }, //no es obligatoria

    role: {
        type: String,
        required: [true, 'Rol obligatorio'],
        default: 'USER_ROLE',
        enum: rolesValidos
    }, // default :'USER_ROLE'
    estado: {
        type: Boolean,
        default: true
    }, //Boolean
    google: {
        type: Boolean,
        default: false
    }, //Boolean

});


usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);