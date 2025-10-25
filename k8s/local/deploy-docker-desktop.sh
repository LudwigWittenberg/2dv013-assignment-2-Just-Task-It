#!/bin/bash

# Prediction API Docker Desktop Kubernetes Deployment Script
set -e

echo "🚀 Deploying Prediction API to Docker Desktop Kubernetes..."

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed or not in PATH"
    exit 1
fi

# Check if cluster is running
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Kubernetes cluster is not accessible"
    echo "💡 Make sure Docker Desktop Kubernetes is enabled"
    exit 1
fi

echo "✅ Kubernetes cluster is accessible"

# Build the Docker image
echo "🐳 Building Docker image..."
cd ../../ && docker build -f Dockerfile.production -t just-task-it:latest .

# Convert docker-compose.yaml to kubernetes deployment
echo "🔄 Converting docker-compose.yaml to kubernetes deployment..."
kompose convert -f docker-compose.yaml -f docker-compose.production.yaml -o ./k8s/local/kompose/

# For Docker Desktop, the image is automatically available to Kubernetes
echo "📦 Image built successfully and available to Docker Desktop Kubernetes"
cd k8s/local

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Deploy Just Task It
echo "🚀 Deploying Just Task It..."
kubectl apply -n just-task-it -f ./kompose/

# Apply services
echo "🌐 Applying services..."
kubectl apply -n just-task-it -f ingress.yaml
kubectl apply -n just-task-it -f docker-desktop-ingress.yaml

echo "✅ Deployment completed!"

# Show status
echo "📊 Deployment Status:"
kubectl get pods -n just-task-it
kubectl get services -n just-task-it

echo ""
echo "🔗 Access your Just Task It:"
echo "  - NodePort: http://localhost:30080"
echo ""
echo "📝 To check logs:"
echo "  kubectl logs -f deployment/just-task-it -n just-task-it"
echo ""
