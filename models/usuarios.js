const {Schema, model} = require('mongoose')
const bcrypt = require('bcrypt')

const usuario = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    correo: {
        type: String,
        required: true,
        unique: true
    },
    contrasena: {
        type: String,
        required: true,
        unique: true
    },
    productos_ingresados: [
        {
            ref: "productos",
            type: Schema.Types.ObjectId
        }
    ],
    productos_alterados: [
        {
            ref: "reporte_productos",
            type: Schema.Types.ObjectId
        }
    ]
})

usuario.statics.encriptarContraseña = async (contraseña) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(contraseña, salt)
}  

usuario.statics.compararContraseña = async (contraseña, contraseñaNueva) => {
    return await bcrypt.compare(contraseña, contraseñaNueva)
}


const usuariosModel = model('usuarios', usuario)

module.exports = {usuariosModel}