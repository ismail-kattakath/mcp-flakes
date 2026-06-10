# AWS ECS MCP Server

Containerize and deploy applications to Amazon Elastic Container Service (ECS) with full lifecycle management.

## Overview

The AWS ECS MCP Server enables AI assistants to help with containerizing applications, deploying to Amazon ECS, troubleshooting deployments, and managing ECS resources. This is an official AWS Labs project.

## Tools

- `containerize_app` - Get best practices and guidance for containerizing web applications
- `build_and_push_image_to_ecr` - Create ECR infrastructure and push Docker images
- `validate_ecs_express_mode_prerequisites` - Validate IAM roles and images before deployment
- `ecs_resource_management` - Manage ECS clusters, services, tasks, and task definitions
- `wait_for_service_ready` - Track deployment progress
- `delete_app` - Complete cleanup of Express Mode deployments
- `ecs_troubleshooting_tool` - Diagnose and resolve common ECS problems

## Quick Start

```bash
# Create environment file
cat > .env << EOF
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
ALLOW_SENSITIVE_DATA=false
ALLOW_WRITE=false
EOF

# Run the server
docker compose run --rm mcp-aws-ecs
```

## Required Configuration

### AWS Credentials

- `AWS_REGION` - AWS region for ECS operations (e.g., us-east-1, eu-west-1)
- `AWS_ACCESS_KEY_ID` - AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - AWS secret access key

Required IAM permissions:
- ECS full access (ecs:*)
- ECR full access (ecr:*)
- CloudFormation access (cloudformation:*)
- IAM access for role creation
- Application Load Balancer access

### Optional Configuration

- `ALLOW_SENSITIVE_DATA` - Allow exposure of sensitive data (default: false for production)
- `ALLOW_WRITE` - Allow write operations (default: false for read-only production access)

## Features

- **Containerization Guidance** - Best practices for containerizing web apps
- **ECS Express Mode** - Deploy with automatic infrastructure provisioning
- **ECR Integration** - Automated Docker image builds and pushes
- **Load Balancer** - Automatic ALB configuration with HTTPS
- **Auto-scaling** - Built-in auto-scaling with CPU/memory targets
- **Infrastructure as Code** - CloudFormation template generation
- **Circuit Breaker** - Automatic rollback on deployment failure
- **Container Insights** - Enhanced monitoring integration

## Production Use

For production environments:
- Set `ALLOW_SENSITIVE_DATA=false` to prevent sensitive data exposure
- Set `ALLOW_WRITE=false` for read-only access
- Use IAM roles with minimal required permissions
- Consider AWS-managed ECS MCP Server for enterprise features

## Requirements

- Docker or Finch installed locally
- AWS account with ECS access
- Valid AWS credentials with appropriate IAM permissions

## Upstream

- **Source**: https://github.com/awslabs/mcp
- **License**: Apache-2.0
- **Commit**: a4c4c880293db24aac9f1480bd417ce9386dd779
