#!/bin/bash

# Define the file and variable
ENV_FILE=".env.production"
VAR_NAME="NEXT_PUBLIC_API_URL"
NEW_VALUE="http://localhost:8800"
OLD_VALUE="http://13.215.88.139:80"

# Backup the current .env.production
cp $ENV_FILE "${ENV_FILE}.bak"

# Update the value in .env.production
sed -i.bak "s|$OLD_VALUE|$NEW_VALUE|g" $ENV_FILE

# Build and start the containers
docker compose up -d

echo "Launching..."
sleep 5

# Restore the original .env.production value
mv "${ENV_FILE}.bak" $ENV_FILE

# Open the URL in the default browser
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    start http://localhost:3000  # Windows
elif [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000  # macOS
else
    xdg-open http://localhost:3000  # Linux
fi
