const express = require('express');
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const prisma = new PrismaClient();

const SECRET_TOKEN = "token_super_secreto";
const verificarToken = (req, res, next) => {
   const token = req.header("Authorization");

   if (!token) return res.status(401).json({ mensaje: "Acceso denegado" });

   try {
      const verificar = jwt.verify(token.split(" ")[1], SECRET_TOKEN);
      req.usuario = verificar;
      next();
   } catch (error) {
      res.status(400).json({ mensaje: "Token invalido" });
   }
}

app.use(express.json());

app.listen(PORT, () => {
   console.log("Servidor escuchando en el puerto:", PORT);
});


//crear un usuario sin token
app.post("/usuarios", async (req, res) => {
   const { nombre, email, password } = req.body;

   const userExist = await prisma.usuario.findUnique({ where: { email } });
   if (userExist) return res.status(400).json({ mensaje: "El usuario ya existe en el sistema" });

   const hashedPassword = await bcrypt.hash(password, 10);

   const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hashedPassword },
   });
   res.json({ mensaje: "Usuario registrado", usuario });
});

app.post("/login", async(req, res) => {
   const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(400).json({ mensaje: "Credenciales inválidas" });
    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(400).json({ mensaje: "Credenciales inválidas" });

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_TOKEN, {
        expiresIn: "1h",
    });

    res.json({ mensaje: "Inicio de sesión exitoso", token });
})


//traer usuarios con token ya validado
app.get("/usuarios", verificarToken, async (req, res) => {
   const usuarios = await prisma.usuario.findMany();
   res.json(usuarios);
});



app.get("/usuarios/:id", verificarToken, async (req, res) => {
   const usuario = await prisma.usuario.findUnique({
      where: { id: parseInt(req.params.id) },
   });
   res.json(usuario);
});

app.put("/usuarios/:id", verificarToken, async (req, res) => {
   const { nombre, email } = req.body;
   const usuario = await prisma.usuario.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, email },
   });

   res.json(usuario);
});

app.delete("/usuarios/:id", async (req, res) => {
   await prisma.usuario.delete({
      where: { id: parseInt(req.params.id) }
   });

   res.json({ mensaje: "Usuario eliminado" });
})