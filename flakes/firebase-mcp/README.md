# Firebase MCP Server

Model Context Protocol server for Firebase with Auth, Firestore, and Cloud Storage operations.

## Overview

Enables LLMs to interact with Firebase services including Authentication, Firestore database, and Cloud Storage through a standardized MCP interface.

## Features

- **Firebase Authentication**: Create, read, update, delete users
- **Cloud Firestore**: Document CRUD operations and queries
- **Cloud Storage**: File upload, download, delete, and listing
- **Emulator Support**: Test with local Firebase emulators

## Use Cases

### 1. User Management
```
AI: "Create a new user with email user@example.com"
AI: "Get user details for UID abc123"
AI: "Update user display name to John Doe"
```

### 2. Firestore Operations
```
AI: "Store this order in the orders collection"
AI: "Query all users where status equals active"
AI: "Update document users/123 with lastLogin timestamp"
```

### 3. File Storage
```
AI: "Upload this image to the avatars bucket"
AI: "List all files in the documents folder"
AI: "Delete the old backup file"
```

## Configuration

### Required Environment Variables

```bash
FIREBASE_PROJECT_ID=my-firebase-project
FIREBASE_CREDENTIALS=/path/to/service-account.json
```

### Service Account Setup

1. Go to Firebase Console > Project Settings > Service Accounts
2. Generate new private key (JSON)
3. Save as `firebase-service-account.json`
4. Set `GOOGLE_APPLICATION_CREDENTIALS` to file path

### Firebase Emulators (Testing)

```bash
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

## Available Tools

### Authentication
- `auth_create_user` - Create new user
- `auth_get_user` - Get user by UID or email
- `auth_update_user` - Update user properties
- `auth_delete_user` - Delete user account
- `auth_list_users` - List all users with pagination

### Firestore
- `firestore_get` - Get document by path
- `firestore_set` - Create/replace document
- `firestore_update` - Update specific fields
- `firestore_delete` - Delete document
- `firestore_query` - Query collection with filters

### Cloud Storage
- `storage_upload` - Upload file to bucket
- `storage_download` - Download file URL
- `storage_delete` - Delete file
- `storage_list` - List files in directory

## Quick Start

### Using Docker Compose

```bash
cd flakes/firebase-mcp
export FIREBASE_PROJECT_ID=my-project
export FIREBASE_CREDENTIALS=./firebase-service-account.json
docker compose up -d
```

### Using with Claude Desktop

```json
{
  "mcpServers": {
    "firebase": {
      "command": "docker",
      "args": [
        "compose",
        "-f",
        "/path/to/flakes/firebase-mcp/compose.yaml",
        "run",
        "--rm",
        "firebase-mcp"
      ],
      "env": {
        "FIREBASE_PROJECT_ID": "my-project",
        "FIREBASE_CREDENTIALS": "/path/to/service-account.json"
      }
    }
  }
}
```

## Security Best Practices

1. **Service Account Permissions**: Use least-privilege service accounts
2. **Firestore Rules**: Enforce security rules at database level
3. **Storage Rules**: Restrict bucket access with rules
4. **Secret Management**: Never commit credentials to version control
5. **Emulator First**: Test with emulators before production

## Links

- **Repository**: https://github.com/gannonh/firebase-mcp
- **NPM**: https://www.npmjs.com/package/@gannonh/firebase-mcp
- **Firebase Docs**: https://firebase.google.com/docs
- **Video Demo**: https://www.youtube.com/watch?v=FI-oE_voCpA

## License

MIT License - see [ATTRIBUTION.md](./ATTRIBUTION.md) for details.
