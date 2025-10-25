#!/bin/bash
echo "🧹 Cleaning up workshop environment..."

echo "Stopping Docker Compose services..."
cd ../../ && docker compose -f docker-compose.yaml -f docker-compose.development.yaml down -v && cd k8s/development

echo "Cleaning up Kubernetes resources..."
kubectl delete namespace just-task-it 2>/dev/null || true

echo "✅ Cleanup completed!"
