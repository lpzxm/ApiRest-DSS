import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';


//controlador para registrar (post) nuevos usuarios al sistema
export async function register(req, res) {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const user = await prisma.user.create({ data: { email, password: hashedPassword } });
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ error: 'El correo ya existe, intenta con otro' });
    }
};

//controlador para logear (post) usuario al sistema
export async function login(req, res) {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
};