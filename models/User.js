const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    role: { type: String, enum: ['cliente', 'admin'], default: 'cliente' },
    createdAt: { type: Date, default: Date.now }
});

// pré-save hook para criptografar a senha antes de salvar
userSchema.pre('save', async function(next) {
    if (!this.isModified('senha')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
})

// Método para comparar senhas
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.senha);
};

module.exports = mongoose.model('User', userSchema);  // Exporta o modelo de usuário