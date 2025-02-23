npx prisma generate
npx prisma migrate dev --name init
docker build -t mi-api-express .
docker run -p 3000:3000 -d mi-api-express
