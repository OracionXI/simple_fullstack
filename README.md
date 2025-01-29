# Docker Documentation 🐳

<br>

## ✔ Next Js for the Frontend (Client):

<br>

### 1️⃣ Build and Push the Image to Docker Hub :

Build the image and push it to the Docker Hub in an existing empty repository.

```sh
docker build -t oracionxi/nextjs_client:v1 .
docker push oracionxi/nextjs_client:v1
```

<br>

### 2️⃣ Analyze the Number of Layers :

To inspect the number of layers,

##

```sh
docker history oracionxi/nextjs_client:v1
```

<br>

General Overview:

- Total Layers: 20
- Base Image: node:18-alpine
- Estimated total size : 190MB

<br>
And from the history, the key layers and observations:

| **Layer**                      | **Size** | **Purpose**                              |
| ------------------------------ | -------- | ---------------------------------------- |
| `CMD ["node", "server.js"]`    | `0B`     | Entrypoint for the app execution         |
| `EXPOSE 3000/tcp`              | `0B`     | Opens port 3000 for the application      |
| `USER nextjs`                  | `0B`     | Runs app as a non-root user for security |
| `COPY /app/.next/static`       | `482kB`  | Copies Next.js static files              |
| `COPY /app/.next/standalone`   | `63.4MB` | Copies Next.js standalone output         |
| `COPY /app/public`             | `29.2kB` | Copies public assets                     |
| `RUN adduser nextjs`           | `3.25kB` | Creates a non-root user                  |
| `RUN addgroup nodejs`          | `1.07kB` | Creates a system group                   |
| `ENV NODE_ENV=production`      | `0B`     | Sets environment variables               |
| `apk add libc6-compat`         | `5.37MB` | Installs required system dependencies    |
| `RUN apk add --virtual`        | `114MB`  | Installs Node.js dependencies            |
| `ADD alpine-minirootfs.tar.gz` | `7.83MB` | Base Alpine OS layer                     |

<br>

### 3️⃣ Review the image size :

To check the image size,

```sh
docker images
```

| **Repository**          | **Tag** | **Image ID** | **Size** |
| ----------------------- | ------- | ------------ | -------- |
| oracionxi/nextjs_client | v1      | 57c9973baf23 | 191MB    |

or, we can use the docker inspect command to see the details of the image.

```sh
docker inspect 57c9973baf23
```

<br><br>

## ✔ Express Js for the Backend (Server):

<br>

### 1️⃣ Build and Push the Image to Docker Hub :

Build the image and push it to the Docker Hub in an existing empty repository.

```sh
docker build -t oracionxi/express_prisma_server:v1 .
docker push oracionxi/express_prisma_server:v1
```

<br>

### 2️⃣ Analyze the Number of Layers :

To inspect the number of layers,

##

```sh
docker history oracionxi/express_prisma_server:v1
```

<br>

General Overview:

- Total Layers: 12
- Base Image: node:alpine
- Estimated total size : 148MB

<br>
And from the history, the key layers and observations:

| **Layer**                             | **Size** | **Purpose**                           |
| ------------------------------------- | -------- | ------------------------------------- |
| `CMD ["node", "index.js"]`            | `0B`     | Entrypoint for the app execution      |
| `EXPOSE 8800/tcp`                     | `0B`     | Opens port 8800 for the application   |
| `COPY /app .`                         | `89.3MB` | Copies the app's files into the image |
| `WORKDIR /app`                        | `0B`     | Sets the working directory            |
| `RUN apk add --no-cache --virtual`    | `5.37MB` | Installs required system dependencies |
| `RUN addgroup -g 1000 node`           | `148MB`  | Adds a group and user for security    |
| `ENTRYPOINT ["docker-entrypoint.sh"]` | `0B`     | Set entry point to custom script      |
| `COPY docker-entrypoint.sh`           | `388B`   | Copies the entry point script         |

<br>

### 3️⃣ Review the image size :

To check the image size,

```sh
docker images
```

| **Repository**                  | **Tag** | **Image ID** | **Size** |
| ------------------------------- | ------- | ------------ | -------- |
| oracionxi/express_prisma_server | v1      | dd0d60f06240 | 250MB    |

or, we can use the docker inspect command to see the details of the image.

```sh
docker inspect dd0d60f06240
```

<br>

## ✔ Docker Compose:

<br>

### 1️⃣ Service configuration:

- Server (Backend): Runs the Express server with Prisma.
- Client (Frontend): Runs the Next.js frontend application.
- Database (DB): Runs on postgresql

### 2️⃣ Service Dependencies:

- Frontend depends on Backend (depends_on ensures the backend starts first).
- Backend depends on Database (depends_on ensures DB is up before backend).

### 3️⃣ Health Checks and Resource Limits:

- Health checks are set for both Frontend and Backend services to verify if they are running as expected.
- Memory and CPU resource limits are defined for both services to ensure efficient resource usage.

<br>

Finally, all the services included in the docker-compose.yaml file to up the containers with the commands below,

```sh
docker compose up -d
```

<br>

👉 AND AFTER RUNNING THE CONTAINERS, KINDLY EXECUTE THE "run.sh" TO MIGRATE THE SCHEME IN THE DATABASE. THANK YOU!
