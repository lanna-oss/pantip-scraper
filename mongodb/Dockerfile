
FROM alpine:3.7

RUN apk add --no-cache mongodb

VOLUME ["/data/db"]
ADD ./mongod.conf /etc

EXPOSE 27017
EXPOSE 28017

CMD [ "mongod","--config", "/etc/mongod.conf" ,"--bind_ip", "0.0.0.0" ]

