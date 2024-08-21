#!/bin/bash

wait_for_service() {
  local service_name=$1
  local retries=20
  local wait=5

  until [ "`docker inspect -f {{.State.Health.Status}} $container_id`" != "healthy" ] || [ "$retries" -le 0 ]; do
    echo "Waiting for $service_name to be healthy..."
    retries=$((retries-1))
    sleep $wait
  done

  if [ "$retries" -le 0 ]; then
    echo "$service_name did not become healthy, exiting..."
    exit 1
  fi
}

echo "Starting services with Docker Compose..."
docker compose down
docker compose up -d

wait_for_service "mongo"

echo "Starting Express Server..."
kill -9 $(lsof -ti:5000)
kill -9 $(lsof -ti:8080)
cd ./server
npm install
npm start &

echo "Starting Angular Frontend..."
kill -9 $(lsof -ti:4200)
cd ../delivery-app
npm install
ng s &

cd ..
echo "All services started successfully!"
