# ☸️ Kubernetes MCP Server

![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?logo=kubernetes&logoColor=white)
![Helm](https://img.shields.io/badge/Helm-0F1689?logo=helm)
![Istio](https://img.shields.io/badge/Istio-466BB0?logo=istio)
![ArgoCD](https://img.shields.io/badge/ArgoCD-EF7B4D?logo=argo)

Secure execution of kubectl, helm, istioctl, and argocd CLI commands for Kubernetes cluster management. All-in-one container with multi-cloud support.

## Overview

K8s MCP Server is a Docker-based server implementing Anthropic's Model Context Protocol (MCP) that enables Claude and other AI assistants to run Kubernetes CLI tools in a secure, containerized environment.

## Tools

- `kubectl` - Execute kubectl commands for Kubernetes operations
- `helm` - Execute Helm commands for package management
- `istioctl` - Execute Istio service mesh commands
- `argocd` - Execute ArgoCD GitOps commands

## Quick Start

```bash
# Run with your kubeconfig
docker compose run --rm mcp-k8s

# Or with direct docker command
docker run -i --rm \
  -v ~/.kube:/home/appuser/.kube:ro \
  ghcr.io/mcp-flakes/k8s-mcp-server:latest
```

## Required Configuration

### Kubeconfig

Mount your Kubernetes configuration file as read-only:

```yaml
volumes:
  - ${HOME}/.kube:/home/appuser/.kube:ro
```

### Cloud Provider Setup

**AWS EKS**: Requires AWS credentials and eksctl/aws-cli installed

**Google GKE**: Requires gcloud credentials

**Azure AKS**: Requires Azure CLI credentials

See the [Cloud Provider Support](https://github.com/alexei-led/k8s-mcp-server/blob/main/docs/cloud-providers.md) guide for detailed setup.

## Optional Configuration

- `K8S_MCP_TRANSPORT` - Transport protocol (stdio, streamable-http, sse)
- `K8S_MCP_HOST` - Host for HTTP/SSE transport (default: 0.0.0.0)
- `K8S_MCP_PORT` - Port for HTTP/SSE transport (default: 8000)
- `K8S_MCP_LOG_LEVEL` - Logging level (DEBUG, INFO, WARNING, ERROR)
- `K8S_MCP_ALLOWED_COMMANDS` - Comma-separated list of allowed commands
- `K8S_MCP_MAX_EXECUTION_TIME` - Maximum command execution time in seconds (default: 300)

## Features

- **Multiple Kubernetes Tools** - kubectl, helm, istioctl, and argocd in one container
- **Cloud Providers** - Native support for AWS EKS, Google GKE, and Azure AKS
- **Security** - Runs as non-root user with strict command validation
- **Command Piping** - Support for common Unix tools like jq, grep, and sed
- **Multiple Transports** - stdio (default), HTTP, and SSE protocols

## Example Prompts

- "What Kubernetes contexts do I have available?"
- "Show me all pods in the default namespace"
- "Create a deployment with 3 replicas of nginx:1.21"
- "Deploy the bitnami/wordpress chart with Helm"
- "Explain what's wrong with my StatefulSet 'database'"

## Security

- Runs as non-root user
- Strict command validation
- Read-only kubeconfig mount
- Configurable command allowlist
- Execution time limits

## Use Cases

| Use Case | Example |
|----------|---------|
| **Cluster Inspection** | "Show me all pods in the production namespace" |
| **Deployments** | "Scale the web-app deployment to 5 replicas" |
| **Helm Charts** | "Install the bitnami/postgresql chart in the database namespace" |
| **Service Mesh** | "Analyze Istio traffic policies for the user-service" |
| **GitOps** | "Check ArgoCD sync status for all applications" |
| **Debugging** | "Get logs for all failing pods" |

## Example Workflows

### Deploy Application with Helm

```bash
# 1. Search for charts
helm search repo wordpress

# 2. Install chart
helm install my-blog bitnami/wordpress \
  --namespace websites \
  --set wordpressPassword=secret

# 3. Check deployment status
kubectl get pods -n websites

# 4. Get service endpoint
kubectl get svc -n websites
```

### Istio Traffic Management

```bash
# 1. Check Istio injection
istioctl analyze -n default

# 2. View traffic metrics
istioctl dashboard kiali

# 3. Configure traffic splitting
kubectl apply -f virtual-service.yaml
```

### ArgoCD GitOps Workflow

```bash
# 1. List applications
argocd app list

# 2. Sync application
argocd app sync my-app

# 3. Check sync status
argocd app get my-app
```

## Cloud Provider Quickstart

### AWS EKS

```bash
# Update kubeconfig
aws eks update-kubeconfig --name my-cluster --region us-west-2

# Run server
docker compose run --rm mcp-k8s
```

### Google GKE

```bash
# Get credentials
gcloud container clusters get-credentials my-cluster --region us-central1

# Run server
docker compose run --rm mcp-k8s
```

### Azure AKS

```bash
# Get credentials
az aks get-credentials --resource-group myRG --name myCluster

# Run server
docker compose run --rm mcp-k8s
```

## Advanced Configuration

### Command Allowlist

Restrict available commands for security:

```yaml
environment:
  - K8S_MCP_ALLOWED_COMMANDS=kubectl get,kubectl describe,helm list
```

### Execution Timeout

Set maximum command runtime:

```yaml
environment:
  - K8S_MCP_MAX_EXECUTION_TIME=600  # 10 minutes
```

### Transport Options

Use HTTP or SSE instead of stdio:

```yaml
environment:
  - K8S_MCP_TRANSPORT=sse
  - K8S_MCP_PORT=8000
```

## Related Flakes

- **postgres** - Database management
- **git** - GitOps workflows
- **github** - CI/CD integration

## Upstream

- **Source**: https://github.com/alexei-led/k8s-mcp-server
- **License**: MIT
- **Commit**: 1794ac932b5ff75c60a6d9c117ee57a81b95678a
