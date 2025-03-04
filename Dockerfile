FROM node:slim

WORKDIR /saturn.dedsec.cl
RUN apt-get update && apt-get install -y procps openssl
COPY ./package.json /saturn.dedsec.cl/
COPY ./dist /saturn.dedsec.cl/
RUN npm install
EXPOSE 2300

CMD ["npm", "run", "start:prod"]
