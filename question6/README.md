## Modules & Components of the Design

### 1. Website (Frontend)
   - **Displays the top 10 user scores**.
   - **Allows users to perform actions** that trigger a score update.
   - **Communicates with the backend** via API calls to update and retrieve scores.

### 2. Application Server (Backend)
   - **Handles the business logic** for score updates.
   - **Authenticates and authorizes users** before updating scores.
   - **Interacts with Redis** for caching and rate-limiting.
   - **Updates the database** with new scores and invalidates the cache as needed.
   - **Dispatches events** for score updates to the event queue (e.g., Kafka).

### 3. Redis (Cache Layer)
   - **Caches the top 10 user scores** to reduce database load.
   - **Implements rate-limiting** for score update requests.

### 4. Rate Limiting Service (Redis)
   - **Tracks user actions** to prevent excessive requests and score manipulation.
   - **Stores counters** for actions performed by users in Redis to apply rate limits.

### 5. Database (Score Table)
   - **Stores user scores** and other relevant data.
   - **Provides the top 10 scores** when needed and updates them when score changes occur.

### 6. Authentication Service
   - **Verifies the identity** of the user making the score update request.
   - **Ensures the user has the right** to perform the action.

### 7. Event Queue (e.g., Kafka)
   - **Asynchronously processes score update events** to decouple score updates from other operations.
   - Can be used for **external services**, such as analytics or notifications.

### 8. Logging Service
   - **Tracks user actions**, including successful and failed score updates.
   - Provides **monitoring** and helps detect potential malicious activity or errors in the system.

---

## Flow of Execution

### 1. **User Views Top 10 Scores**
   - **Route**: `GET /scoreboard/top`
   - **Action**:
     1. User visits the scoreboard page.
     2. The frontend checks Redis for cached top 10 scores.
     3. If a cache miss occurs, the backend fetches the scores from the database, caches them in Redis, and returns them to the frontend.

### 2. **User Performs Action (Triggers Score Update)**
   - **Route**: `POST /score/update`
   - Can use **Event-driven architecture** to handle score updates asynchronously.
     - **Purpose**: Asynchronous processing of score updates via an event queue. This allows decoupling of score updates from other system actions.
     - **Example**: If the score update affects an external service (e.g., analytics), an event is dispatched to handle the update without blocking the user request.
   - **Action**:
     1. The user performs an action that results in a score increase.
     2. The frontend sends a request to the backend to update the user's score.
     3. The backend performs the following:
        - **Rate Limiting**: The system checks Redis to see if the user has exceeded the rate limit for score updates.
        - **Authentication**: The system authenticates the user through the authentication service.
        - **Authorization**: The system checks if the user is authorized to perform the score update.
        - **Database Update**: If authenticated and authorized, the score is updated in the database.
        - **Event Dispatch**: The system dispatches an event to an event queue (e.g., Kafka) to asynchronously process the update.
        - **Cache Invalidation**: Redis cache for the top 10 scores is invalidated to ensure consistency with the database.

### 3. **Rate Limiting (Prevent Malicious Actions)**
   - **Purpose**: Prevent users from performing excessive score update actions, which could be used for malicious behavior.
   - **Implementation**: Redis stores counters for each user, and if the user exceeds the set limit within a defined time window (e.g., 10 updates per minute), they are rate-limited.
   - **Route**: `POST /score/update`
   - **Action**:
     1. Before performing any score update, the system checks the rate limit for the user.
     2. If the rate limit is exceeded, the backend responds with an error, and the frontend informs the user that they have been rate-limited.

### 4. **Logging**
   - **Action**:
     1. Each request is logged by the logging service for monitoring purposes.
     2. Logs include details such as the user ID, request type, action outcome (success/failure), and any rate limit or authorization failures.

---


## **API Endpoints**

### 1. **GET /scoreboard/top**
   - **Description**: Fetches the top 10 user scores.
   - **Method**: `GET`
   - **Request**: None
   - **Response**:
     ```json
     {
       "topScores": [
         {"userId": 1, "score": 100},
         {"userId": 2, "score": 95},
         ...
       ]
     }
     ```
   - **Flow**: 
     - Check Redis for cached top 10 scores.
     - If cache miss, fetch from the database and update Redis.

### 2. **POST /score/update**
   - **Description**: Updates the score of the user.
   - **Method**: `POST`
   - **Request**:
     ```json
     {
       "userId": 1,
       "scoreIncrease": 10
     }
     ```
   - **Response**:
     - If the rate limit is exceeded:
       ```json
       {
         "message": "Rate limit exceeded. Try again later."
       }
       ```
     - On success:
       ```json
       {
         "message": "Score updated successfully."
       }
       ```
   - **Flow**:
     - Check if the user is rate-limited using Redis.
     - Authenticate and authorize the user.
     - Update the database and dispatch an event to the event queue.
     - Invalidate the cache for the top 10 scores in Redis.

---

### 3. **POST /user/register**
   - **Description**: Registers a new user with the system.
   - **Method**: `POST`
   - **Request**:
     ```json
     {
       "username": "user1",
       "password": "password123",
       "email": "user1@example.com"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "User registered successfully."
     }
     ```
   - **Flow**:
     - Validate the user input (e.g., check for duplicate usernames).
     - Store the user's information securely (password hashed).
     - Send a confirmation response.

### 4. **POST /user/login**
   - **Description**: Authenticates a user and returns a session token.
   - **Method**: `POST`
   - **Request**:
     ```json
     {
       "username": "user1",
       "password": "password123"
     }
     ```
   - **Response**:
     - On success:
       ```json
       {
         "message": "Login successful.",
         "token": "abc123xyz456"
       }
       ```
     - On failure (invalid credentials):
       ```json
       {
         "message": "Invalid username or password."
       }
       ```
   - **Flow**:
     - Validate the user credentials.
     - Generate a session token for the authenticated user.

### 5. **POST /user/logout**
   - **Description**: Logs out a user and invalidates the session token.
   - **Method**: `POST`
   - **Request**:
     ```json
     {
       "token": "abc123xyz456"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Logout successful."
     }
     ```
   - **Flow**:
     - Invalidate the session token and end the user's session.

### 6. **GET /score/{userId}**
   - **Description**: Fetches the current score of a specific user.
   - **Method**: `GET`
   - **Request**: None
   - **Response**:
     ```json
     {
       "userId": 1,
       "score": 100
     }
     ```
   - **Flow**:
     - Retrieve the score directly from the database or Redis if cached.

---

### 7. **POST /admin/reset-scores**
   - **Description**: Allows administrators to reset the scores of all users (e.g., for a new season).
   - **Method**: `POST`
   - **Request**: None
   - **Response**:
     ```json
     {
       "message": "All scores reset successfully."
     }
     ```
   - **Flow**:
     - Validate the administrator's credentials.
     - Reset all user scores in the database.
     - Invalidate the cache in Redis for all users.

---

### 8. **GET /admin/logs**
   - **Description**: Fetches logs of all user actions related to score updates, authentication, and system errors (for monitoring purposes).
   - **Method**: `GET`
   - **Request**: 
     - Optional query parameters: `startDate`, `endDate`, `userId`, `actionType`
   - **Response**:
     ```json
     {
       "logs": [
         {
           "timestamp": "2025-03-02T10:15:30Z",
           "userId": 1,
           "action": "Score Update",
           "status": "Success"
         },
         {
           "timestamp": "2025-03-02T10:16:30Z",
           "userId": 2,
           "action": "Rate Limiting",
           "status": "Exceeded"
         }
       ]
     }
     ```
   - **Flow**:
     - Fetch logs from the logging service, filtered by the provided parameters.

---

## **Flow of Execution**

### 1. **User Views Top 10 Scores**
   - **Route**: `GET /scoreboard/top`
   - **Action**:
     - The frontend calls the `GET /scoreboard/top` endpoint to fetch the top 10 scores.
     - The backend checks Redis for the cached scores.
     - If the cache is empty, the system queries the database, updates Redis, and then sends the data back to the frontend.

### 2. **User Performs Action (Triggers Score Update)**
   - **Route**: `POST /score/update`
   - **Action**:
     - User performs an action (e.g., completing a task).
     - The frontend calls the `POST /score/update` API to update the score.
     - The backend checks the rate limit using Redis. If the limit is exceeded, the API responds with a rate limit message.
     - If not rate-limited, the backend authenticates and authorizes the user, updates the score in the database, sends an event to the event queue, and invalidates the Redis cache.
   
### 3. **User Registration and Login**
   - **Route**: `POST /user/register` and `POST /user/login`
   - **Action**:
     - Users can register through the `POST /user/register` endpoint and authenticate using `POST /user/login`.
     - On successful login, a session token is returned to the frontend to use in subsequent requests.
  
### 4. **Administrator Actions**
   - **Route**: `POST /admin/reset-scores` and `GET /admin/logs`
   - **Action**:
     - Administrators can reset scores using the `POST /admin/reset-scores` endpoint.
     - Admins can monitor user actions and system events by fetching logs with the `GET /admin/logs` endpoint.

---


## **Database Design**

### **Database Overview**
The database stores user data, scores, rate limits, and event logs. The schema ensures data integrity, supports efficient querying, and facilitates scalability.

---

## **Database Tables**

### 1. **User Table** (users)
   - **Description**: Stores user information such as ID, username, and email.
   - **Primary Key (PK)**: user_id
   
   **Columns:**
   | Column Name   | Data Type   | Description                        | Key      |
   |---------------|-------------|------------------------------------|----------|
   | user_id     | INT         | Unique identifier for each user    | PK       |
   | username    | VARCHAR(255) | Unique username                    |          |
   | email       | VARCHAR(255) | User's email                       |          |
   | password_hash | VARCHAR(255) | Hashed password                    |          |
   | created_at  | TIMESTAMP   | Timestamp when user was created    |          |


### 2. **Score Table** (`scores`)
   - **Description**: Stores the score for each user.
   - **Primary Key (PK)**: `score_id`
   - **Foreign Key (FK)**: `user_id` (references `users.user_id`)
   
   **Columns:**
   | Column Name   | Data Type   | Description                        | Key      |
   |---------------|-------------|------------------------------------|----------|
   | `score_id`    | INT         | Unique identifier for each score   | PK       |
   | `user_id`     | INT         | Foreign key to the user            | FK       |
   | `score`       | INT         | User's current score               |          |
   | `last_updated`| TIMESTAMP   | Timestamp when score was last updated |          |

### 3. **Rate Limit Table** (`rate_limits`)
   - **Description**: Tracks the number of actions a user performs in a time window (for rate-limiting).
   - **Primary Key (PK)**: `rate_limit_id`
   - **Foreign Key (FK)**: `user_id` (references `users.user_id`)
   
   **Columns:**
   | Column Name   | Data Type   | Description                               | Key      |
   |---------------|-------------|-------------------------------------------|----------|
   | `rate_limit_id` | INT       | Unique identifier for each rate limit entry | PK       |
   | `user_id`     | INT         | Foreign key to the user                   | FK       |
   | `action_count`| INT         | Number of actions (e.g., score updates) performed in a time window |          |
   | `time_window` | TIMESTAMP   | Timestamp of the time window for rate limiting |          |


### 4. **Event Log Table** (`event_logs`)
   - **Description**: Logs events related to score updates, rate limit breaches, etc.
   - **Primary Key (PK)**: `event_id`
   - **Foreign Key (FK)**: `user_id` (references `users.user_id`)
   
   **Columns:**
   | Column Name   | Data Type   | Description                        | Key      |
   |---------------|-------------|------------------------------------|----------|
   | `event_id`    | INT         | Unique identifier for each event   | PK       |
   | `user_id`     | INT         | Foreign key to the user            | FK       |
   | `event_type`  | VARCHAR(255) | Type of event (e.g., "score update", "rate limit exceeded") |          |
   | `event_details` | TEXT      | Additional details about the event |          |
   | `timestamp`   | TIMESTAMP   | Timestamp of the event             |          |

## Suggestions for Improvement

### 1. **Security Considerations**
   - Use **HTTPS** for all communication between frontend, backend, and other services.
   - Implement more stringent **rate-limiting policies** based on user behavior analysis (e.g., high-frequency actions from the same IP address or session).

### 2. **Scalability**
   - Consider **horizontal scaling** for Redis and database systems to handle increased traffic.
   - Utilize **Redis clustering** if the cache size grows significantly.

### 3. **Error Handling**
   - Provide detailed **error messages** for all failure points (e.g., authentication failure, authorization failure, rate limit exceeded) to improve debugging and troubleshooting.

### 4. **Event Queue and Processing**
   - Document how **event consumers** (e.g., analytics services, external systems) process score update events and what data is expected in the event payload.