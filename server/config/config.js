// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// =================================
//    Entorno
// =================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =================================
//    Entorno
// =================================

let urlDb;

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = 'mongodb+srv://hurons:C0gJPXZuUvuUalfS@cluster0-hzdvu.mongodb.net/cafe';
}

process.env.URLDB = urlDb;