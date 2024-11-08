FROM denoland/deno:alpine-1.42.2

EXPOSE 7777

WORKDIR /app

COPY deps.js .

RUN deno cache deps.js

COPY . .

CMD [ "deno", "run", "--allow-net","--allow-read","--allow-env", "--watch", "--unstable", "run-locally.js" ]