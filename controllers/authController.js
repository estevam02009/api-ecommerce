const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar Token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.SECRET_KEY, {
        expiresIn: '1h' // Token vence em 1 hora
    });
};

// Registrar Usuário
exports.regsiterUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        const user = await User.create({ name, email, password, role });

        res.status(201).json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor ao registrar usuário. Por favor tente mais tarde.' });
    }
};

// Login de usuário
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        const isMatch = await user.matchPassword(senha);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou senha inválidos.' });
        }

        res.json({
            _id: user._id,
            nome: user.nome,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Erro no servidor ao fazer Login." })
    }
}