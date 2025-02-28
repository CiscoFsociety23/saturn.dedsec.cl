FROM node:slim

WORKDIR /saturn.dedsec.cl
RUN apt-get update && apt-get install -y procps openssl
COPY ./prisma /saturn.dedsec.cl/
COPY ./package.json /saturn.dedsec.cl/
COPY ./tsconfig.json /saturn.dedsec.cl/
COPY ./tsconfig.build.json /saturn.dedsec.cl/
COPY ./nest-cli.json /saturn.dedsec.cl/
COPY .env /saturn.dedsec.cl/
COPY ./src /saturn.dedsec.cl/
RUN npm install
RUN npm run build
EXPOSE 2300

CMD ["npm", "run", "start:prod"]
