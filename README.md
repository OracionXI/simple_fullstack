# Simple PERN stack Deployment

<br>

## 🚀 Tools for deployment and automation:

#### i) [Docker](#docker)

#### ii) [GitHub Actions](#cicd)

#### iii) [Ansible](#ansible)

#### iv) [Cloudflare](#cdn)

<br>

<br>

## <h1 id="docker">Docker Documentation 🐳</h1>

### ✔ Next Js for the Frontend (Client):

##

<br>

#### 1️⃣ Build and Push the Image to Docker Hub :

Build the image and push it to the Docker Hub in an existing empty repository.

```sh
docker build -t oracionxi/nextjs_client:v1 .
docker push oracionxi/nextjs_client:v1
```

<br>

#### 2️⃣ Analyze the Number of Layers :

To inspect the number of layers, and the overview:

- Total Layers: 20
- Base Image: node:18-alpine
- Estimated total size : 190MB

##

```sh
docker history oracionxi/nextjs_client:v1
```

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

#### 3️⃣ Review the image size :

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

### ✔ Express Js for the Backend (Server):

##

<br>

#### 1️⃣ Build and Push the Image to Docker Hub :

Build the image and push it to the Docker Hub in an existing empty repository.

```sh
docker build -t oracionxi/express_prisma_server:v1 .
docker push oracionxi/express_prisma_server:v1
```

<br>

#### 2️⃣ Analyze the Number of Layers :

To inspect the number of layers, and the overview:

- Total Layers: 12
- Base Image: node:alpine
- Estimated total size : 148MB

##

```sh
docker history oracionxi/express_prisma_server:v1
```

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

#### 3️⃣ Review the image size :

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

### ✔ Docker Compose:

##

<br>

#### 1️⃣ Service configuration:

- Server (Backend): Runs the Express server with Prisma.
- Client (Frontend): Runs the Next.js frontend application.
- Database (DB): Runs on postgresql

#### 2️⃣ Service Dependencies:

- Frontend depends on Backend (depends_on ensures the backend starts first).
- Backend depends on Database (depends_on ensures DB is up before backend).

#### 3️⃣ Health Checks and Resource Limits:

- Health checks are set for both Frontend and Backend services to verify if they are running as expected.
- Memory and CPU resource limits are defined for both services to ensure efficient resource usage.

<br>

Finally, all the services included in the docker-compose.yaml file to up the containers with the commands below,

```sh
docker compose up -d
```

<br>

<br>

## <h1 id="cicd">CI/CD Pipelines Overview 🔧</h1>

<br>

### ✔ Code Tests Pipeline (`code-test.yml`)

##

This workflow is triggered on any push to a `feature/*` branch.

#### **Steps:**

1. **Checkout Code**: Retrieves the latest code.
2. **Setup Node.js**: Uses Node.js 18.
3. **Install Dependencies**:
   - Installs backend dependencies.
   - Generates Prisma client.
   - Installs Prettier for code formatting.
4. **Run Tests**: Executes backend tests (pipeline continues even if tests fail).
5. **Lint Check**: Runs Prettier to check code formatting.
6. **SonarCloud Scan**: Analyzes code quality using SonarQube.

---

<br>

### ✔ Docker Build Check Pipeline (`docker-test.yml`)

##

This workflow runs after the `Code Tests` workflow completes successfully.

#### **Steps:**

1. **Lint Dockerfile**: Uses Hadolint to check Dockerfile best practices.
2. **Dry Run Docker Build**:
   - Determines the build target based on the branch name.
   - Builds either the backend (`server`) or frontend (`client`).
3. **Security Scan**: Scans the built Docker image for vulnerabilities using Trivy.
4. **Create Pull Request**:
   - Automatically creates a PR to merge the feature branch into `development` if one does not exist.

---

<br>

### ✔ Docker Image Build & Release Pipeline (`release-ci.yml`)

##

This workflow is triggered on new version tags (`v*`).

#### **Steps:**

1. **Checkout Code**: Retrieves the latest code.
2. **Login to Docker Hub**: Authenticates using stored secrets.
3. **Build & Push Images**:
   - Builds Docker images for the backend and frontend.
   - Pushes the images to Docker Hub.
4. **Create Pull Request**:
   - Automatically creates a PR to merge `development` into `main` for a new release.
5. **Auto-Merge PR**: Attempts to automatically merge the PR.
6. **Run Ansible Deployment**: Deploys the new release using Ansible.

---

<br>

### 📌 **Notes:**

##

- Ensure required secrets (`SONAR_TOKEN`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `GIT_TOKEN`) are set up in GitHub Actions.
- Feature branches should follow the naming conventions (`feature/backend-*` or `feature/frontend-*`) for correct builds.
- Version tags should be formatted as `v*` (e.g., `v1.0.0`).

<br>

<br>

## <h1 id="ansible">Ansible Deployment Guide 🔑</h1>

<br>

This Ansible playbook automates the setup of an EC2 instance, installing necessary dependencies, transferring Docker Compose files, and deploying the application.

---

<br>

### Playbook: `playbook.yml`

#### **1. Install Nginx**

- Installs the `nginx` package.
- Enables and restarts the Nginx service.

👉 The remote server's nginx config file(`~/etc/nginx/sites-available/default`) is similar to the ./nginx.conf

#### **2. Install Node.js**

- Installs Node.js and npm using the package manager.

#### **3. Install Docker**

- Installs dependencies required for Docker.
- Adds Docker’s official GPG key.
- Retrieves the Ubuntu version codename.
- Adds the Docker repository.
- Installs Docker, CLI tools, and required plugins.
- Ensures Docker is running and enabled at startup.
- Adds the `ubuntu` user to the `docker` group for non-root access.
- Logs in to Docker Hub using environment variables.

#### **4. Transfer and Deploy Docker Compose**

- Copies the `docker-compose.yaml` file to the remote server.
- Runs `docker compose up -d` to start the containers.

---

<br>

### Inventory File: `inventory.ini.example`

Defines the target server for Ansible automation.

```
[test_server]
RANDOM_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
```

- `RANDOM_IP`: Replace with the actual server IP.
- `ansible_user=ubuntu`: Specifies the remote user.
- `ansible_ssh_private_key_file=~/.ssh/id_rsa`: Path to the SSH key for authentication.

---

<br>

### Ansible Configuration: `ansible.cfg`

#### **Configuration Settings:**

- Sets the default inventory file to `inventory.ini`.
- Disables host key checking to prevent SSH warnings.
- Disables retry file creation.
- Defines `ubuntu` as the remote user.
- Uses `sudo` for privilege escalation.
- Automatically detects the Python interpreter.

---

<br>

### **Setup**

1. **Update the inventory file** with the correct server IP. (Allocated the EC2 instance with an Elastic IP)
2. **Ensure SSH access** is in the remote server. (Host machine's `~/.ssh/id_-_rsa.pub` to remote server's `~/.ssh/authorized_keys`)
3. **Run the playbook from the host:**
   ```sh
   ansible-playbook playbook.yml -i inventory.ini
   ```
4. The application should now be deployed and running on the remote server.

<br>

<br>

## <h1 id="cdn">Deploy Next.js Static Files to Cloudflare CDN with OpenNext 🚀</h1>

### 📌 Prerequisites:

Ensure you have the following installed:

- Node.js (v18+)

- npm (or yarn)

- Cloudflare Account

- Wrangler CLI

##

<br>

#### 1️⃣ Installation :

Install the required dependencies:

```sh
npm install --save-dev @opennextjs/cloudflare@latest wrangler@latest
```

<br>

#### 2️⃣ Configure `wrangler.jsonc` :

Create or modify the wrangler.jsonc file in the Next js directory,

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "my-app",
  "compatibility_date": "2024-12-30",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "my-app"
    }
  ],
  "kv_namespaces": [
    // Uncomment and add a binding ID to enable KV-based caching
    // {
    //   "binding": "NEXT_INC_CACHE_KV",
    //   "id": "<BINDING_ID>"
    // }
  ]
}
```

<br>

#### 3️⃣ Configure `open-next.config.ts` :

Create or modify the open-next.config.ts file in the Next js directory,

```ts
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
```

<br>

#### 4️⃣ Modify `package.json` Scripts :

Add the following scripts in package.json,

```json
{
  "scripts": {
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
  }
}
```

<br>

#### 5️⃣ Enable KV Namespace for Caching :

To enable caching with Cloudflare KV, and copy the following cache ID to the wrangler.jsonc,

```sh
npx wrangler@latest kv namespace create <worker-name>
```

<br>

#### 6️⃣ Enable KV Namespace for Caching :

1. **Run Locally**:
   To preview the Cloudflare Worker:

```sh
npm run preview
```

2. **Deploy to Cloudflare**:
   To deploy your Next.js app to Cloudflare CDN:

```sh
npm run deploy
```

---

<br>

### 📌 **Notes:**

##

- Ensure your Cloudflare account is properly set up.
- Update `wrangler.jsonc` with your KV namespace ID from the caching.

---

## And if you want to run it locally, kindly execute or run the `localRun.sh` file. Thank you!
