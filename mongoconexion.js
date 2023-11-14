const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const confirmar = async () => {
    try {
        const db = await mongoose.connect('mongodb+srv://almacenjpb:kvlb5DA90aUAbDiS@cluster0.lptnine.mongodb.net/almacen', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true, // Asegúrate de incluir esta opción si es necesaria para tu configuración de MongoDB Atlas
        });
        console.log("--------------------- CONECTADO -----------------------")
        console.log("connected to ", db.connection.name)
    } catch (error) {
        console.log(" ---------------------- ERROR ---------------------- ")
        console.error(error)
    }
};

module.exports = {confirmar}