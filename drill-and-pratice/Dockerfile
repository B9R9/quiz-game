FROM denoland/deno:2.0.5

EXPOSE 7777

WORKDIR /app

COPY deps.js .

RUN deno cache deps.js

COPY . .

CMD [ "deno", "run", "--allow-net","--allow-write","--allow-read","--allow-env", "--watch", "--unstable", "run-locally.js" ]