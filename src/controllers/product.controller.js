import prisma from "../config/db.js";

//controlador para obtener todos los productos
export async function getAllProducts(req, res) {
    const products = await prisma.product.findMany();
    res.json(products);
};

//controlador para obtener un producto por id
export async function getProductById(req, res) {
    const product = await prisma.product.findUnique({ where: { id: Number(req.params.id) } });
    product ? res.json(product) : res.status(404).json({ error: 'Product not found' });
};

//controlador para crear un nuevo producto
export async function createProduct(req, res) {
    const { name, description, price } = req.body;
    const product = await prisma.product.create({ data: { name, description, price } });
    res.status(201).json(product);
};

//controlador para actualizar un producto segun el id
export async function updateProduct(req, res) {
    const { name, description, price } = req.body;
    try {
        const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: { name, description, price } });
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Product not found' });
    }
};

//controlador para eliminar un producto segun el id
export async function deleteProduct(req, res) {
    try {
        await prisma.product.delete({ where: { id: Number(req.params.id) } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(404).json({ error: 'Product not found' });
    }
};