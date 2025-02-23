import { PrismaClient } from "@prisma/client";
//Importar el cliente de prisma y crear una instancia para manejarlo como un objeto dentro de la API
const prisma = new PrismaClient();
export default prisma;
