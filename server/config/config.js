// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;



// =================================
//    Entorno
// =================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =================================
//    SEED Autenticacion
// =================================
process.env.SEED = process.env.SEED || 'es-este-es-el-sedd-desarrollo-huron';

// =================================
//    Vencimiento del token
// =================================
//60 segundos
//60 minutos
//24 horas
//30 dias 
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =================================
//    Entorno
// =================================

let urlDb;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_UR;
}

process.env.URLDB = urlDb;

// =================================
//    Google ClientID
// =================================
process.env.Client_ID = process.env.Client_ID || '537366463709-r611uhcbup5lirav1l9uvr1d5ppnos1o.apps.googleusercontent.com';