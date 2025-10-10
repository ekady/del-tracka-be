# Flow Diagrams & Data Processes

## 1. Authentication Flow

### 1.1 User Login Sequence

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant AuthService
    participant UserRepository
    participant JWTService
    participant Database

    Client->>Controller: POST /authentication/sign-in (email, password)
    Controller->>AuthService: signIn(dto)
    AuthService->>UserRepository: findOneByEmail(email)
    UserRepository->>Database: Query User
    Database-->>UserRepository: User Data
    UserRepository-->>AuthService: User Entity
    AuthService->>AuthService: Validate Password
    AuthService->>JWTService: generateTokens(user)
    JWTService-->>AuthService: {accessToken, refreshToken}
    AuthService-->>Controller: AuthResponse
    Controller-->>Client: 200 OK + Tokens
```

### 1.2 JWT Token Validation Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant JwtAuthGuard
    participant JWTService
    participant UserRepository

    Client->>Controller: GET /api/v1/protected (Bearer Token)
    Controller->>JwtAuthGuard: canActivate(context)
    JwtAuthGuard->>JWTService: verify(token)
    JWTService-->>JwtAuthGuard: Decoded Payload
    JwtAuthGuard->>UserRepository: findById(decoded.sub)
    UserRepository-->>JwtAuthGuard: User Entity
    JwtAuthGuard-->>Controller: true/false
    Controller-->>Client: Response or 401 Unauthorized
```

## 2. Task Management Flow

### 2.1 Create Task Sequence

```mermaid
sequenceDiagram
    participant Client
    participant TaskController
    participant TaskService
    participant ProjectService
    participant StageService
    participant TaskRepository
    participant ActivityService
    participant NotificationService
    participant Database

    Client->>TaskController: POST /project/{pId}/stage/{sId}/task (TaskDTO)
    TaskController->>TaskService: createTask(pId, sId, dto, user)
    TaskService->>ProjectService: validateProjectAccess(pId, user)
    TaskService->>StageService: validateStageInProject(sId, pId)
    TaskService->>TaskRepository: create(taskData)
    TaskRepository->>Database: Insert Task
    Database-->>TaskRepository: Saved Task
    TaskRepository-->>TaskService: Task Entity
    TaskService->>ActivityService: logCreation(task, user)
    TaskService->>NotificationService: notifyAssignee(task, user)
    TaskService-->>TaskController: Task Entity
    TaskController-->>Client: 201 Created + Task Data
```

### 2.2 Update Task Status Flow (Kanban Move)

```mermaid
sequenceDiagram
    participant Client
    participant TaskController
    participant TaskService
    participant StageService
    participant TaskRepository
    participant ActivityService
    participant Database

    Client->>TaskController: PUT /project/{pId}/stage/{sId}/task/{tId} (UpdateDTO)
    TaskController->>TaskService: updateTask(tId, pId, sId, dto, user)
    TaskService->>StageService: validateStage(sId, pId)
    TaskService->>TaskRepository: findOneById(tId)
    TaskRepository-->>TaskService: Existing Task
    TaskService->>TaskRepository: update(tId, updateData)
    TaskRepository->>Database: Update Task
    Database-->>TaskRepository: Updated Task
    TaskRepository-->>TaskService: Task Entity
    TaskService->>ActivityService: logStatusChange(task, oldStatus, newStatus, user)
    TaskService-->>TaskController: Task Entity
    TaskController-->>Client: 200 OK + Task Data
```

## 3. File Upload Flow

### 3.1 AWS S3 Upload Sequence

```mermaid
sequenceDiagram
    participant Client
    participant FileController
    participant FileService
    participant AWS_S3_Service
    participant Database

    Client->>FileController: POST /file/upload (multipart/form-data)
    FileController->>FileService: uploadFile(file, userId)
    FileService->>AWS_S3_Service: generatePresignedUrl(file)
    AWS_S3_Service-->>FileService: URL
    FileService->>Database: Save File Metadata (name, url, userId)
    Database-->>FileService: Saved Metadata
    FileService-->>FileController: FileResponse DTO
    FileController-->>Client: 201 Created + File URL
```

## 4. Notification Flow

### 4.1 Real-time Notification via Firebase

```mermaid
sequenceDiagram
    participant EventTrigger
    participant NotificationService
    participant FirebaseAdmin
    participant FCM
    participant ClientDevice

    EventTrigger->>NotificationService: triggerNotification(event)
    NotificationService->>NotificationService: buildMessage(event)
    NotificationService->>FirebaseAdmin: sendNotification(deviceToken, message)
    FirebaseAdmin->>FCM: HTTP Request
    FCM-->>FirebaseAdmin: Response
    FirebaseAdmin-->>NotificationService: Result
    NotificationService-->>EventTrigger: Success
    FCM->>ClientDevice: Push Notification
```

## 5. Project & Stage Management Flow

### 5.1 Create Project with Default Stages

```mermaid
sequenceDiagram
    participant Client
    participant ProjectController
    participant ProjectService
    participant StageService
    participant ProjectRepository
    participant StageRepository
    participant Database

    Client->>ProjectController: POST /project (ProjectDTO)
    ProjectController->>ProjectService: createProject(dto, user)
    ProjectService->>ProjectRepository: create(projectData)
    ProjectRepository->>Database: Insert Project
    Database-->>ProjectRepository: Saved Project
    ProjectRepository-->>ProjectService: Project Entity
    ProjectService->>StageService: createDefaultStages(project)
    StageService->>StageRepository: bulkCreate(stageData)
    StageRepository->>Database: Insert Stages
    Database-->>StageRepository: Saved Stages
    StageRepository-->>StageService: Stage Entities
    StageService-->>ProjectService: Stages Created
    ProjectService-->>ProjectController: Project with Stages
    ProjectController-->>Client: 201 Created + Project Data
```

## 6. Error Handling Flow

### 6.1 Exception Filter Process

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant ExceptionFilter
    participant Logger

    Client->>Controller: Request
    Controller->>Controller: Execute Handler
    Controller->>ExceptionFilter: Error Caught
    ExceptionFilter->>Logger: Log Error Details
    ExceptionFilter-->>Client: 400/401/403/404/500 Response
```
