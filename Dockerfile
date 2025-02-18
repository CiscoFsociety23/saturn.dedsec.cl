FROM node:slim

WORKDIR /saturn.dedsec.cl
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./tsconfig.build.json .
COPY ./nest-cli.json .
COPY ./src .
RUN npm install
RUN npm run build
EXPOSE 2300

CMD ["npm", "run", "start:prod"]
