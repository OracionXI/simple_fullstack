#!/bin/bash

docker compose build
docker compose up -d

echo "Waiting for the server container to start..."
sleep 5

if [ "$TERM" = "xterm" ]; then
    echo "Using winpty for Git Bash/MinTTY compatibility..."
    winpty docker exec -it server npx prisma migrate dev --name init
else
    echo "Running Prisma migration..."
    docker exec -i server npx prisma migrate dev --name init
fi

echo "Done importing..."
echo "Starting Application..."
sleep 10

echo "Launching..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start http://localhost:3000
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
else
    # Linux
    xdg-open http://localhost:3000
fi
sleep 10