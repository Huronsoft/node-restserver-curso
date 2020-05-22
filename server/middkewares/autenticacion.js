const jwt = require('jsonwebtoken');

//======================================
// Verificar Token
//======================================

let verificatoken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }

            });
        }

        req.usuario = decoded.usuario;
        next();

    });
};

//======================================
// Verificar Admin_Role
//======================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Usuario no tiene permisos para ejecutar esta funcion'
            }

        })
    }
};


module.exports = {
    verificatoken,
    verificaAdmin_Role
}