FROM node:8-alpine

WORKDIR /usr/src/app

# Set time zone to EST
RUN apk add --no-cache tzdata
RUN cp /usr/share/zoneinfo/America/New_York /etc/localtime

COPY package.json yarn.lock init.sh ./

RUN yarn install

COPY . .

RUN echo '30 7 * * 3,4 cd /usr/src/app && yarn alert' > /etc/crontabs/root

CMD ["./init.sh"]
