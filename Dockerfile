FROM node:slim

WORKDIR /saturn.dedsec.cl
RUN apt-get update && apt-get install -y procps openssl
COPY ./package.json /saturn.dedsec.cl/
COPY ./dist/ /saturn.dedsec.cl/dist/
COPY ./prisma/schema.prisma /saturn.dedsec.cl/prisma/schema.prisma
COPY ./.env /saturn.dedsec.cl/.env
RUN npm install
RUN npx prisma generate --no-engine
RUN npx prisma db pull
EXPOSE 2300

CMD ["npm", "run", "start:prod"]
