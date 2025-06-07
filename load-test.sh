#!/usr/bin/env bash

# Número de peticiones concurrentes que queremos enviar
CONCURRENT_REQUESTS=10

for i in $(seq 1 $CONCURRENT_REQUESTS); do
  (
    curl -s http://localhost:3000/api/facturar \
      -X POST \
      -H "Content-Type: application/json" \
      -d "{\"taskId\":\"task-$i\",\"payload\":{\"deviceId\":\"device-$i\"}}"
  ) &
done

wait
echo "✅ Se enviaron $CONCURRENT_REQUESTS peticiones concurrentes."
