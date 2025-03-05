FROM node:slim
WORKDIR /saturn.dedsec.cl
RUN apt-get update && apt-get install -y procps openssl
COPY ./package.json .
COPY ./dist .
COPY ./.env .
COPY ./prisma .
RUN npm install
RUN npx prisma generate
EXPOSE 2300
CMD ["npm", "run", "start:prod"]
