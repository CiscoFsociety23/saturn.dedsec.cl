FROM node:slim

RUN apt-get update && apt-get install -y procps openssl
COPY ./package.json /package.json
COPY ./nest-cli.json /nest-cli.json
COPY ./dist/ /dist/
COPY ./prisma /
RUN npm install
RUN npx prisma generate
EXPOSE 2300

CMD ["npm", "run", "start:prod"]
