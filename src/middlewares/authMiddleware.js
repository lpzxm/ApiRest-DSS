import jwt from 'jsonwebtoken';

//funcion para manejar mediante un middleware el token de autenticacion del usuario mediante jwt
export function authToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Acceso denegado' });
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token invalido' });
    }
}