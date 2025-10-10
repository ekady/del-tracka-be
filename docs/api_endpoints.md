# API Endpoints & Flow Documentation

## 1. Base URL & Versioning

- **Base URL**: `/api/v1`
- **Versioning**: URI-based (e.g., `/api/v1/resource`)
- **Documentation**: Available at `/swagger`

## 2. Authentication Endpoints

### 2.1 Sign In

- **Endpoint**: `POST /authentication/sign-in`
- **Description**: Authenticate user with email and password
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": { ... }
  }
  ```
- **Flow**:
  1. Validate email format
  2. Find user by email
  3. Verify password hash
  4. Generate JWT tokens
  5. Return tokens and user data

### 2.2 Sign Up

- **Endpoint**: `POST /authentication/sign-up`
- **Description**: Register new user account
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "user": { ... }
  }
  ```

### 2.3 Refresh Token

- **Endpoint**: `POST /authentication/refresh`
- **Description**: Refresh access token using refresh token
- **Request Body**:
  ```json
  {
    "refreshToken": "eyJhbGci..."
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
  ```

## 3. Project Endpoints

### 3.1 Create Project

- **Endpoint**: `POST /project`
- **Description**: Create a new project
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "name": "My Project",
    "description": "Project description"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "_id": "...",
    "name": "My Project",
    "shortId": "PROJ-123",
    "createdBy": "...",
    "createdAt": "2026-03-15T10:00:00.000Z"
  }
  ```

### 3.2 Get Project by ID

- **Endpoint**: `GET /project/{shortId}`
- **Description**: Retrieve project details
- **Auth Required**: Yes (JWT)
- **Response**: `200 OK`
  ```json
  {
    "_id": "...",
    "name": "My Project",
    "shortId": "PROJ-123",
    "description": "Project description",
    "stages": [...],
    "members": [...]
  }
  ```

### 3.3 Update Project

- **Endpoint**: `PUT /project/{shortId}`
- **Description**: Update project details
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated description"
  }
  ```

### 3.4 Delete Project

- **Endpoint**: `DELETE /project/{shortId}`
- **Description**: Delete a project
- **Auth Required**: Yes (JWT)

## 4. Task Endpoints

### 4.1 Create Task

- **Endpoint**: `POST /project/{projectShortId}/stage/{stageShortId}/task`
- **Description**: Create a new task in a specific stage
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "title": "Fix login bug",
    "detail": "User cannot login with special characters",
    "priority": "HIGH",
    "assigneeId": "user_id",
    "dueDate": "2026-03-20"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "_id": "...",
    "title": "Fix login bug",
    "shortId": "TASK-456",
    "status": "OPEN",
    "priority": "HIGH",
    "projectId": "...",
    "stageId": "...",
    "assigneeId": "...",
    "reporterId": "...",
    "createdAt": "2026-03-15T10:00:00.000Z"
  }
  ```

### 4.2 Get Tasks by Stage

- **Endpoint**: `GET /project/{projectShortId}/stage/{stageShortId}/task`
- **Description**: Get all tasks in a specific stage
- **Auth Required**: Yes (JWT)
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
  - `priority` (optional): Filter by priority
- **Response**: `200 OK`
  ```json
  {
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25
    }
  }
  ```

### 4.3 Update Task

- **Endpoint**: `PUT /project/{projectShortId}/stage/{stageShortId}/task/{taskShortId}`
- **Description**: Update task details or move between stages
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "title": "Updated title",
    "status": "IN_PROGRESS",
    "assigneeId": "new_user_id"
  }
  ```

### 4.4 Delete Task

- **Endpoint**: `DELETE /project/{projectShortId}/stage/{stageShortId}/task/{taskShortId}`
- **Description**: Delete a task
- **Auth Required**: Yes (JWT)

## 5. Stage Endpoints

### 5.1 Create Stage

- **Endpoint**: `POST /project/{projectShortId}/stage`
- **Description**: Create a new stage in a project
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "name": "In Progress",
    "order": 2
  }
  ```

### 5.2 Get Stages by Project

- **Endpoint**: `GET /project/{projectShortId}/stage`
- **Description**: Get all stages for a project
- **Auth Required**: Yes (JWT)
- **Response**: `200 OK`
  ```json
  [
    {
      "_id": "...",
      "name": "To Do",
      "order": 1,
      "tasks": [...]
    },
    {
      "_id": "...",
      "name": "In Progress",
      "order": 2,
      "tasks": [...]
    }
  ]
  ```

## 6. Comment Endpoints

### 6.1 Create Comment

- **Endpoint**: `POST /project/{projectShortId}/task/{taskShortId}/comment`
- **Description**: Add a comment to a task
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "content": "This is a comment on the task"
  }
  ```

### 6.2 Get Task Comments

- **Endpoint**: `GET /project/{projectShortId}/task/{taskShortId}/comment`
- **Description**: Get all comments for a task
- **Auth Required**: Yes (JWT)

## 7. User Endpoints

### 7.1 Get Profile

- **Endpoint**: `GET /user/profile`
- **Description**: Get current user profile
- **Auth Required**: Yes (JWT)
- **Response**: `200 OK`
  ```json
  {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "picture": "..."
  }
  ```

### 7.2 Update Profile

- **Endpoint**: `PUT /user/profile`
- **Description**: Update user profile
- **Auth Required**: Yes (JWT)
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "picture": "https://..."
  }
  ```

## 8. File Upload Endpoints

### 8.1 Upload File

- **Endpoint**: `POST /file/upload`
- **Description**: Upload file to AWS S3
- **Auth Required**: Yes (JWT)
- **Content-Type**: `multipart/form-data`
- **Response**: `201 Created`
  ```json
  {
    "url": "https://s3.amazonaws.com/bucket/file.jpg",
    "fileName": "file.jpg"
  }
  ```

## 9. Notification Endpoints

### 9.1 Get Notifications

- **Endpoint**: `GET /notification`
- **Description**: Get user notifications
- **Auth Required**: Yes (JWT)
- **Query Parameters**:
  - `isRead` (optional): Filter by read status

### 9.2 Mark as Read

- **Endpoint**: `PUT /notification/{id}/read`
- **Description**: Mark notification as read
- **Auth Required**: Yes (JWT)

## 10. Error Responses

### 10.1 Standard Error Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 10.2 Common Error Codes

- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## 11. Pagination & Filtering

### 11.1 Standard Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`

### 11.2 Response Format

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
