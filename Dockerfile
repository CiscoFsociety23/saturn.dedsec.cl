FROM node:slim
WORKDIR /saturn.dedsec.cl
RUN apt-get update && apt-get install -y procps openssl
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./nest-cli.json .
COPY ./src .
COPY ./.env .
COPY ./prisma .
RUN npm install
RUN npx prisma generate
EXPOSE 2300
CMD ["npm", "run", "start:prod"]
