const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
})
//Cifrado de contraseñas
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};
//Retornar contraseña sin cifrar
UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);