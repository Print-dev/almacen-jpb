const {Schema, model} = require('mongoose')

const producto = new Schema({
    fecha: {   // AUTOMATICO
        type: String,
        required: true
    },
    fechaActualizacion: {   // AUTOMATICO
        type: String,
        required: true
    },
    horaCreacion: {
        type: String,
        required: true
    },
    horaActualizacion: {
        type: String,
        required: true
    },
    codigo: {   //AUTOMATICO
        type: Number,
        required: true
    },
    descripcion: {  
        type: String,
        required: true,
        trim: true
        //unique: true
    },
    unidadDeMedida: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    almacen: {  // AUTOMATICO 1 
        type: String,
        required: true
    },    
    stockInicial: {
        type: Number,
        required: true
    },
    stockTotal: {
        type: Number,
        required: true
    },
    entrada: {
        type: Number,
        required: true
    },
    salida: {  //AUTOMATICO 0
        type: Number,
        required: true
    },
    observacion: {
        type: String,
        required: true
    },
    costoInicial: {
        type: Number,
        required: true
    },
    costoUnidad: {
        type: Number,
        required: true
    },
    costoTotal: {
        type: Number,
        required: true
    },
    registradoPor: {
        ref: 'usuarios',
        type: Schema.Types.ObjectId 
    }
})

const productosModel = model("productos", producto)

module.exports = {productosModel}