# `ProFolio`

## Database Schema Design

![ProFolio Database Diagram](./schema/dbschema.png)

[ProFolio Database Diagram](https://drawsql.app/teams/otter-logic/diagrams/profolio/embed)

<iframe width="100%" height="500" src="https://drawsql.app/teams/otter-logic/diagrams/profolio/embed" frameborder="0" allowfullscreen></iframe>

---

[ProFolio Figma Wireframes](https://www.figma.com/design/5SOScinJ5QQJw72G2z1dOI/ProFolio?node-id=0-1&t=fI1y21OmCpM40MZ3-1)

<iframe style="border: 1px solid rgba(0, 0, 0, 0.1);" width="800" height="450" src="https://embed.figma.com/design/5SOScinJ5QQJw72G2z1dOI/ProFolio?node-id=0-1&embed-host=share" allowfullscreen></iframe>

---

## API Documentation

## **USER AUTHENTICATION/AUTHORIZATION**

### **All Endpoints that Require Authentication**

All endpoints that require a current user to be logged in.

- **Request:** Endpoints that require authentication
- **Error Response:** Require authentication
  - **Status Code:** 401
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Authentication required"
    }
    ```

---

### **All Endpoints that Require Proper Authorization**

All endpoints that require authentication and the current user does not have the correct role(s) or permission(s).

- **Request:** Endpoints that require proper authorization
- **Error Response:** Require proper authorization
  - **Status Code:** 403
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Forbidden"
    }
    ```

---

### **Get the Current User**

Returns the information about the current user that is logged in.

- **Require Authentication:** false
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/users/:id`
  - **Body:** none

- **Successful Response when there is a logged-in user:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- **Successful Response when there is no logged-in user:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "user": null
    }
    ```

---

### **Log In a User**

Logs in a current user with valid credentials and returns the current user's information.

- **Require Authentication:** false
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/session`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "credential": "john.smith@gmail.com",
      "password": "secret password"
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- **Error Response:** Invalid credentials
  - **Status Code:** 401
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Invalid credentials"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "credential": "Email or username is required",
        "password": "Password is required"
      }
    }
    ```

---

### **Sign Up a User**

Creates a new user, logs them in as the current user, and returns the current user's information.

- **Require Authentication:** false
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/users`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@gmail.com",
      "username": "JohnSmith",
      "password": "secret password"
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Smith",
        "email": "john.smith@gmail.com",
        "username": "JohnSmith"
      }
    }
    ```

- **Error Response:** User already exists with the specified email or username
  - **Status Code:** 500
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "User already exists",
      "errors": {
        "email": "User with that email already exists",
        "username": "User with that username already exists"
      }
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "email": "Invalid email",
        "username": "Username is required",
        "firstName": "First Name is required",
        "lastName": "Last Name is required"
      }
    }
    ```

---

Here are the API endpoints for user profile, including theme preference in markdown format:

## **User Profile API Endpoints**

### **1. Get User Profile Information**

Returns the current user's profile information, including their theme preference.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/users/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com",
        "username": "JohnDoe",
        "bio": "Web developer passionate about design",
        "avatarUrl": "https://cdn.example.com/avatar.png",
        "socialLinks": {
          "github": "https://github.com/johndoe",
          "linkedin": "https://linkedin.com/in/johndoe"
        },
        "resumeUrl": "https://cdn.example.com/resume.pdf",
        "themePreference": "dark",
        "createdAt": "2025-01-01T12:00:00Z",
        "updatedAt": "2025-01-03T14:00:00Z"
      }
    }
    ```

---

### **2. Update User Profile Information**

Allows the user to update their profile information, including their theme preference.

- **Require Authentication:** true
- **Request:**
  - **Method:** PUT
  - **Route path:** `/api/users/:id`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "bio": "Updated bio about my portfolio journey",
      "avatarUrl": "https://cdn.example.com/new-avatar.png",
      "resumeUrl": "https://cdn.example.com/new-resume.pdf",
      "socialLinks": {
        "github": "https://github.com/johndoe",
        "linkedin": "https://linkedin.com/in/johndoe"
      },
      "themePreference": "light"
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "User profile updated successfully",
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "bio": "Updated bio about my portfolio journey",
        "avatarUrl": "https://cdn.example.com/new-avatar.png",
        "resumeUrl": "https://cdn.example.com/new-resume.pdf",
        "socialLinks": {
          "github": "https://github.com/johndoe",
          "linkedin": "https://linkedin.com/in/johndoe"
        },
        "themePreference": "light",
        "updatedAt": "2025-01-05T15:30:00Z"
      }
    }
    ```

---

### **3. Update Theme Preference Only**

Allows the user to update only their theme preference.

- **Require Authentication:** true
- **Request:**
  - **Method:** PATCH
  - **Route path:** `/api/users/:id/theme`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "themePreference": "dark"
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Theme preference updated successfully",
      "themePreference": "dark"
    }
    ```

---

### **4. Delete User Profile**

Deletes the current user profile.

- **Require Authentication:** true
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/users/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "User profile deleted successfully"
    }
    ```

---

### **Error Responses**

**1. Unauthorized Access**
- **Status Code:** 401
- **Body:**
  ```json
  {
    "message": "Authentication required"
  }
  ```

**2. Forbidden Access**
- **Status Code:** 403
- **Body:**
  ```json
  {
    "message": "Forbidden"
  }
  ```


**3. Not Found**
- **Status Code:** 404
- **Body:
  ```json
  {
    "message": "User not found"
  }
  ```

---

## **Projects**

### **Get all Projects**

Returns all the projects created by the logged-in user.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/projects`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "Projects": [
        {
          "id": 1,
          "userId": 1,
          "title": "Portfolio Website",
          "description": "A personal website to showcase my work.",
          "tags": ["React", "Node.js"],
          "githubRepo": "https://github.com/user/portfolio",
          "projectLink": "https://portfolio.com",
          "imageUrl": "https://cdn.example.com/project-image.png",
          "createdAt": "2025-01-01T12:00:00Z",
          "updatedAt": "2025-01-01T12:30:00Z"
        }
      ]
    }
    ```

---

### **Get Project by ID**

Returns the details of a specific project by its ID.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/projects/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Portfolio Website",
      "description": "A personal website to showcase my work.",
      "tags": ["React", "Node.js"],
      "githubRepo": "https://github.com/user/portfolio",
      "projectLink": "https://portfolio.com",
      "imageUrl": "https://cdn.example.com/project-image.png",
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-01T12:30:00Z"
    }
    ```

- **Error Response:** Project not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Project couldn't be found"
    }
    ```

---

### **Create a Project**

Creates and returns a new project.

- **Require Authentication:** true
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/projects`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "title": "New Project",
      "description": "A new web app project.",
      "tags": ["Express", "PostgreSQL"],
      "githubRepo": "https://github.com/user/new-project",
      "projectLink": "https://newproject.com",
      "imageUrl": "https://cdn.example.com/project-image.png"
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 2,
      "userId": 1,
      "title": "New Project",
      "description": "A new web app project.",
      "tags": ["Express", "PostgreSQL"],
      "githubRepo": "https://github.com/user/new-project",
      "projectLink": "https://newproject.com",
      "imageUrl": "https://cdn.example.com/project-image.png",
      "createdAt": "2025-01-01T14:00:00Z",
      "updatedAt": "2025-01-01T14:00:00Z"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title is required",
        "description": "Description is required",
        "tags": "Tags must be an array of strings",
        "githubRepo": "GitHub URL must be a valid URL",
        "projectLink": "Project link must be a valid URL"
      }
    }
    ```

---

### **Update a Project**

Updates and returns an existing project.

- **Require Authentication:** true
- **Require proper authorization:** The project must belong to the current user.
- **Request:**
  - **Method:** PUT
  - **Route path:** `/api/projects/:id/edit`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "title": "Updated Project Title",
      "description": "Updated project description.",
      "tags": ["React", "Tailwind"],
      "projectLink": "https://updatedproject.com"
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Updated Project Title",
      "description": "Updated project description.",
      "tags": ["React", "Tailwind"],
      "githubRepo": "https://github.com/user/portfolio",
      "projectLink": "https://updatedproject.com",
      "imageUrl": "https://cdn.example.com/project-image.png",
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-01T15:00:00Z"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "title": "Title must be less than 100 characters",
        "tags": "Tags must be an array of strings"
      }
    }
    ```

- **Error Response:** Project not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Project couldn't be found"
    }
    ```

---

### **Delete a Project**

Deletes an existing project.

- **Require Authentication:** true
- **Require proper authorization:** The project must belong to the current user.
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/projects/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- **Error Response:** Project not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Project couldn't be found"
    }
    ```

## **Portfolios**

### **Get Portfolio Details**

Returns the public portfolio details for the specified user.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/portfolios/:userId`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "publicUrl": "https://profolio.user.com",
      "isPublished": true,
      "viewsCount": 250,
      "sharesCount": 50,
      "lastViewed": "2025-01-07T12:00:00Z"
    }
    ```

- **Error Response:** Portfolio not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```

---

## **Search Endpoint**

### **Search for Projects by Tags and Title**

Returns a list of projects that match the given tags or title.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/projects/search`
  - **Query Parameters:**
    - `tags`: comma-separated tags (optional)
    - `title`: partial or full project title (optional)
  - **Body:** none

- **Example Request:**
  - `/api/projects/search?tags=React,Node.js&title=portfolio`

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "Projects": [
        {
          "id": 1,
          "userId": 1,
          "title": "Portfolio Website",
          "description": "A personal website to showcase my work.",
          "tags": ["React", "Node.js"],
          "githubRepo": "https://github.com/user/portfolio",
          "projectLink": "https://portfolio.com",
          "imageUrl": "https://cdn.example.com/project-image.png"
        }
      ]
    }
    ```

- **Error Response:** No matching projects found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "No matching projects found"
    }
    ```

---

### **Create a Portfolio**

Creates and returns a new portfolio for the user.

- **Require Authentication:** true
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/portfolios`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "publicUrl": "https://profolio.user.com",
      "isPublished": true
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "publicUrl": "https://profolio.user.com",
      "isPublished": true,
      "viewsCount": 0,
      "sharesCount": 0,
      "lastViewed": null,
      "createdAt": "2025-01-07T14:00:00Z",
      "updatedAt": "2025-01-07T14:00:00Z"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "publicUrl": "Public URL is required",
        "isPublished": "Publish status must be true or false"
      }
    }
    ```

---

### **Update a Portfolio**

Updates and returns the existing portfolio.

- **Require Authentication:** true
- **Require proper authorization:** The portfolio must belong to the current user.
- **Request:**
  - **Method:** PUT
  - **Route path:** `/api/portfolios/:id/edit`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "isPublished": false
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "publicUrl": "https://profolio.user.com",
      "isPublished": false,
      "viewsCount": 250,
      "sharesCount": 50,
      "lastViewed": "2025-01-07T12:00:00Z",
      "updatedAt": "2025-01-07T15:00:00Z"
    }
    ```

- **Error Response:** Portfolio not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```

---

### **Delete a Portfolio**

Deletes an existing portfolio.

- **Require Authentication:** true
- **Require proper authorization:** The portfolio must belong to the current user.
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/portfolios/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- **Error Response:** Portfolio not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```

    ## **Feedback**

### **Get all Feedback for a Portfolio**

Returns all feedback comments for a specific portfolio.

- **Require Authentication:** false
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/feedback/:portfolioId`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "Feedback": [
        {
          "id": 1,
          "portfolioId": 1,
          "viewerName": "Alex Doe",
          "commentText": "Amazing portfolio!",
          "createdAt": "2025-01-07T12:00:00Z"
        },
        {
          "id": 2,
          "portfolioId": 1,
          "viewerName": "John Smith",
          "commentText": "I love your work!",
          "createdAt": "2025-01-07T12:05:00Z"
        }
      ]
    }
    ```

- **Error Response:** Portfolio not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```
## **Public Portfolio Endpoint**

### **Get Public Portfolio by Public URL**

Returns a public portfolio using its unique public URL.

- **Require Authentication:** false
- **Request:**
  - **Method:** GET
  - **Route path:** `/public/portfolios/:publicUrl`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "publicUrl": "https://profolio.user.com",
      "isPublished": true,
      "viewsCount": 251,
      "sharesCount": 50,
      "lastViewed": "2025-01-07T12:00:00Z",
      "tags": "Developer, Portfolio",
      "projects": [
        {
          "id": 1,
          "title": "Portfolio Website",
          "description": "A personal website to showcase my work.",
          "tags": ["React", "Node.js"],
          "githubRepo": "https://github.com/user/portfolio",
          "projectLink": "https://portfolio.com",
          "imageUrl": "https://cdn.example.com/project-image.png"
        }
      ],
      "customSections": [
        {
          "id": 1,
          "sectionTitle": "Awards",
          "content": "Hackathon MVP",
          "sectionType": "list"
        }
      ],
      "feedback": [
        {
          "viewerName": "Alex Doe",
          "commentText": "Amazing portfolio!",
          "createdAt": "2025-01-07T12:30:00Z"
        }
      ]
    }
    ```

- **Error Response:** Portfolio not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```

---

## **Portfolio Stats/Analytics Endpoint**

### **Get Portfolio Analytics for a User**

Returns analytics and statistics for a user's portfolio.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/portfolios/:userId/analytics`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "portfolioId": 1,
      "viewsCount": 251,
      "sharesCount": 50,
      "feedbackCount": 15,
      "lastViewed": "2025-01-07T12:00:00Z",
      "mostViewedProject": {
        "id": 1,
        "title": "Portfolio Website",
        "views": 120
      },
      "mostCommentedProject": {
        "id": 2,
        "title": "Open Source Contribution",
        "commentCount": 10
      }
    }
    ```

- **Error Response:** Portfolio not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Portfolio couldn't be found"
    }
    ```

---

## **Templates**

### **Get all Templates for the Current User**

Returns all templates created by or available to the logged-in user.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/templates`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "Templates": [
        {
          "id": 1,
          "userId": 1,
          "templateType": "Modern",
          "primaryColor": "#3498db",
          "secondaryColor": "#2ecc71",
          "fontStyle": "Roboto",
          "animationSettings": "fade-in",
          "careerType": "developer",
          "createdAt": "2025-01-07T12:00:00Z",
          "updatedAt": "2025-01-07T12:30:00Z"
        },
        {
          "id": 2,
          "userId": null,
          "templateType": "Minimalist",
          "primaryColor": "#000000",
          "secondaryColor": "#ffffff",
          "fontStyle": "Montserrat",
          "animationSettings": "slide-in",
          "careerType": "designer",
          "createdAt": "2025-01-07T14:00:00Z",
          "updatedAt": "2025-01-07T14:30:00Z"
        }
      ]
    }
    ```

---

### **Create a New Template**

Creates a new custom template for the user.

- **Require Authentication:** true
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/templates`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "templateType": "Custom Design",
      "primaryColor": "#ff5733",
      "secondaryColor": "#333333",
      "fontStyle": "Lato",
      "animationSettings": "zoom-in",
      "careerType": "photographer"
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 3,
      "userId": 1,
      "templateType": "Custom Design",
      "primaryColor": "#ff5733",
      "secondaryColor": "#333333",
      "fontStyle": "Lato",
      "animationSettings": "zoom-in",
      "careerType": "photographer",
      "createdAt": "2025-01-07T15:00:00Z",
      "updatedAt": "2025-01-07T15:00:00Z"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "templateType": "Template type is required",
        "primaryColor": "Primary color is required",
        "fontStyle": "Font style is required"
      }
    }
    ```

---

### **Update a Template**

Updates an existing template for the user.

- **Require Authentication:** true
- **Require proper authorization:** The template must belong to the current user.
- **Request:**
  - **Method:** PUT
  - **Route path:** `/api/templates/:id/edit`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "templateType": "Updated Custom Design",
      "primaryColor": "#333333",
      "fontStyle": "Arial"
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 3,
      "userId": 1,
      "templateType": "Updated Custom Design",
      "primaryColor": "#333333",
      "secondaryColor": "#333333",
      "fontStyle": "Arial",
      "animationSettings": "zoom-in",
      "careerType": "photographer",
      "createdAt": "2025-01-07T15:00:00Z",
      "updatedAt": "2025-01-07T16:00:00Z"
    }
    ```

- **Error Response:** Template not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Template couldn't be found"
    }
    ```

---

### **Delete a Template**

Deletes an existing template.

- **Require Authentication:** true
- **Require proper authorization:** The template must belong to the current user.
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/templates/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- **Error Response:** Template not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Template couldn't be found"
    }
    ```

---

### **Create Feedback for a Portfolio**

Adds a new feedback comment to a portfolio.

- **Require Authentication:** false
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/feedback`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "portfolioId": 1,
      "viewerName": "Jane Doe",
      "commentText": "Very inspiring work!"
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 3,
      "portfolioId": 1,
      "viewerName": "Jane Doe",
      "commentText": "Very inspiring work!",
      "createdAt": "2025-01-07T14:00:00Z"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "portfolioId": "Portfolio ID is required",
        "viewerName": "Viewer name is required",
        "commentText": "Comment text is required"
      }
    }
    ```

---

### **Update Feedback**

Updates an existing feedback comment.

- **Require Authentication:** false
- **Request:**
  - **Method:** PUT
  - **Route path:** `/api/feedback/:id/edit`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "commentText": "Updated feedback comment."
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "portfolioId": 1,
      "viewerName": "Alex Doe",
      "commentText": "Updated feedback comment.",
      "createdAt": "2025-01-07T12:00:00Z",
      "updatedAt": "2025-01-07T15:00:00Z"
    }
    ```

- **Error Response:** Feedback not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Feedback couldn't be found"
    }
    ```

---

### **Delete Feedback**

Deletes an existing feedback comment.

- **Require Authentication:** false
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/feedback/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- **Error Response:** Feedback not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Feedback couldn't be found"
    }
    ```

## **Custom Sections**

### **Get all Custom Sections for a User**

Returns all custom sections for the specified user.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/custom_sections/:userId`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "CustomSections": [
        {
          "id": 1,
          "userId": 1,
          "sectionTitle": "Certifications",
          "content": "AWS Certified Solutions Architect",
          "sectionType": "list",
          "orderIndex": 1,
          "createdAt": "2025-01-07T12:00:00Z",
          "updatedAt": "2025-01-07T12:30:00Z"
        },
        {
          "id": 2,
          "userId": 1,
          "sectionTitle": "Volunteer Work",
          "content": "Taught coding to underprivileged youth.",
          "sectionType": "text",
          "orderIndex": 2,
          "createdAt": "2025-01-07T12:05:00Z",
          "updatedAt": "2025-01-07T12:35:00Z"
        }
      ]
    }
    ```

---

### **Create a Custom Section**

Creates and returns a new custom section for the user.

- **Require Authentication:** true
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/custom_sections`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "userId": 1,
      "sectionTitle": "Awards",
      "content": "Received Hackathon MVP Award.",
      "sectionType": "text",
      "orderIndex": 3
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 3,
      "userId": 1,
      "sectionTitle": "Awards",
      "content": "Received Hackathon MVP Award.",
      "sectionType": "text",
      "orderIndex": 3,
      "createdAt": "2025-01-07T14:00:00Z",
      "updatedAt": "2025-01-07T14:00:00Z"
    }
    ```

- **Error Response:** Body validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "sectionTitle": "Section title is required",
        "content": "Content is required",
        "sectionType": "Section type must be either 'text', 'list', or 'gallery'"
      }
    }
    ```

---

### **Update a Custom Section**

Updates and returns an existing custom section.

- **Require Authentication:** true
- **Require proper authorization:** The section must belong to the current user.
- **Request:**
  - **Method:** PUT
  - **Route path:** `/api/custom_sections/:id/edit`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "sectionTitle": "Updated Section Title",
      "content": "Updated content for the custom section.",
      "sectionType": "text"
    }
    ```

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "sectionTitle": "Updated Section Title",
      "content": "Updated content for the custom section.",
      "sectionType": "text",
      "orderIndex": 1,
      "createdAt": "2025-01-07T12:00:00Z",
      "updatedAt": "2025-01-07T15:00:00Z"
    }
    ```

- **Error Response:** Custom section not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Custom section couldn't be found"
    }
    ```

---

### **Delete a Custom Section**

Deletes an existing custom section.

- **Require Authentication:** true
- **Require proper authorization:** The section must belong to the current user.
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/custom_sections/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- **Error Response:** Custom section not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Custom section couldn't be found"
    }
    ```

## **Badges**

### **Get all Available Badges**

Returns a list of all available badges in the system.

- **Require Authentication:** false
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/badges`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "Badges": [
        {
          "id": 1,
          "title": "First Project Added",
          "description": "Awarded for adding your first project!",
          "iconUrl": "https://cdn.example.com/badges/first-project.png",
          "criteria": {
            "requiredActions": "Add a project",
            "requiredCount": 1
          },
          "createdAt": "2025-01-01T12:00:00Z",
          "updatedAt": "2025-01-01T12:00:00Z"
        },
        {
          "id": 2,
          "title": "Profile Completed",
          "description": "Awarded for completing your profile information.",
          "iconUrl": "https://cdn.example.com/badges/profile-completed.png",
          "criteria": {
            "requiredActions": "Complete profile details",
            "requiredCount": 1
          },
          "createdAt": "2025-01-02T15:00:00Z",
          "updatedAt": "2025-01-02T15:00:00Z"
        }
      ]
    }
    ```

---

### **Award a Badge to a User**

Assigns a badge to a user after they meet the criteria.

- **Require Authentication:** true
- **Request:**
  - **Method:** POST
  - **Route path:** `/api/user_badges`
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "userId": 1,
      "badgeId": 2
    }
    ```

- **Successful Response:**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "badgeId": 2,
      "dateEarned": "2025-01-07T14:00:00Z",
      "message": "Badge awarded successfully."
    }
    ```

- **Error Response:** Validation errors
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "userId": "User ID is required",
        "badgeId": "Badge ID is required"
      }
    }
    ```

---

### **Get All Badges Earned by a User**

Returns all badges that the specified user has earned.

- **Require Authentication:** true
- **Request:**
  - **Method:** GET
  - **Route path:** `/api/user_badges/:userId`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "UserBadges": [
        {
          "id": 1,
          "userId": 1,
          "badgeId": 1,
          "dateEarned": "2025-01-07T12:30:00Z",
          "badge": {
            "title": "First Project Added",
            "description": "Awarded for adding your first project!",
            "iconUrl": "https://cdn.example.com/badges/first-project.png"
          }
        },
        {
          "id": 2,
          "userId": 1,
          "badgeId": 2,
          "dateEarned": "2025-01-07T14:00:00Z",
          "badge": {
            "title": "Profile Completed",
            "description": "Awarded for completing your profile information.",
            "iconUrl": "https://cdn.example.com/badges/profile-completed.png"
          }
        }
      ]
    }
    ```

- **Error Response:** User not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "User couldn't be found"
    }
    ```

---

### **Delete a Badge from a User**

Removes an earned badge from a user.

- **Require Authentication:** true
- **Require proper authorization:** The badge must belong to the current user.
- **Request:**
  - **Method:** DELETE
  - **Route path:** `/api/user_badges/:id`
  - **Body:** none

- **Successful Response:**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Successfully deleted"
    }
    ```

- **Error Response:** Badge not found
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: `application/json`
  - **Body:**
    ```json
    {
      "message": "Badge couldn't be found"
    }
    ```

---

## **GitHub Integration Endpoints**

### **Connect GitHub Account**
Allows a user to link their GitHub account to ProFolio.

- **Require Authentication:** true
- **Request**
  - **Method:** GET
  - **Route path:** `/api/github/connect`
  - **Query Parameters:** None
  - **Body:** None

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "GitHub account connected successfully",
      "githubProfileUrl": "https://github.com/username"
    }
    ```

---

### **Fetch GitHub Repositories**
Fetches the linked user's public repositories.

- **Require Authentication:** true
- **Request**
  - **Method:** GET
  - **Route path:** `/api/github/repos`
  - **Body:** None

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "repositories": [
        {
          "name": "Portfolio Project",
          "description": "A React-based portfolio app",
          "starsCount": 100,
          "forksCount": 50,
          "htmlUrl": "https://github.com/username/portfolio"
        },
        {
          "name": "Blog Project",
          "description": "A Node.js blog app",
          "starsCount": 20,
          "forksCount": 10,
          "htmlUrl": "https://github.com/username/blog"
        }
      ]
    }
    ```

---

### **Disconnect GitHub Account**
Disconnects the user's GitHub account from ProFolio.

- **Require Authentication:** true
- **Request**
  - **Method:** DELETE
  - **Route path:** `/api/github/disconnect`
  - **Body:** None

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "GitHub account disconnected successfully"
    }
    ```

---

## **LinkedIn Integration Endpoints**

### **Connect LinkedIn Account**
Allows a user to link their LinkedIn account to ProFolio.

- **Require Authentication:** true
- **Request**
  - **Method:** GET
  - **Route path:** `/api/linkedin/connect`
  - **Query Parameters:** None
  - **Body:** None

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "LinkedIn account connected successfully",
      "linkedinProfileUrl": "https://linkedin.com/in/username"
    }
    ```

---

### **Fetch LinkedIn Recommendations**
Fetches recommendations from the linked LinkedIn profile.

- **Require Authentication:** true
- **Request**
  - **Method:** GET
  - **Route path:** `/api/linkedin/recommendations`
  - **Body:** None

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "recommendations": [
        {
          "recommenderName": "Jane Doe",
          "relationship": "Former Manager",
          "content": "John is an exceptional engineer with great leadership skills."
        },
        {
          "recommenderName": "Sam Smith",
          "relationship": "Colleague",
          "content": "John consistently delivers high-quality work and is a team player."
        }
      ]
    }
    ```

---

### **Disconnect LinkedIn Account**
Disconnects the user's LinkedIn account from ProFolio.

- **Require Authentication:** true
- **Request**
  - **Method:** DELETE
  - **Route path:** `/api/linkedin/disconnect`
  - **Body:** None

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "LinkedIn account disconnected successfully"
    }
    ```

---

### Check LinkedIn/GitHub Integration Status
- **GET** `/api/integrations/status`
  - **Description:** Returns whether LinkedIn and GitHub are linked.
  - **Response:**
    ```json
    {
      "githubLinked": true,
      "linkedinLinked": true
    }
    ```

---

### Check Integration Status
- **GET** `/api/integrations/status`
  - **Response:**
    ```json
    {
      "github": {
        "status": "connected",
        "lastSyncedAt": "2025-01-07T12:00:00Z"
      },
      "linkedin": {
        "status": "expired",
        "lastSyncedAt": "2025-01-06T11:00:00Z"
      }
    }
    ```

### Connect to a Platform
- **POST** `/api/integrations/:platform/connect`
  - **Request Body:**
    ```json
    {
      "authorizationCode": "oauth_auth_code"
    }
    ```

### Disconnect from a Platform
- **DELETE** `/api/integrations/:platform/disconnect`
  - **Response:**
    ```json
    {
      "message": "Successfully disconnected from LinkedIn"
    }
    ```

---

## **Integrations Endpoints**

### **Get all integrations for the current user**

Fetch all the platforms the current user has connected.

- **Require Authentication:** true
- **Request**
  - **Method:** GET
  - **Route path:** `/api/integrations`
  - **Body:** none

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "integrations": [
        {
          "id": 1,
          "userId": 1,
          "platformUserId": "12345",
          "platform": "Google",
          "status": "Connected",
          "accessToken": "access_token_example",
          "refreshToken": "refresh_token_example",
          "connectedAt": "2025-01-09T18:32:00Z",
          "updatedAt": "2025-01-09T18:35:00Z",
          "expiresAt": "2025-01-10T18:32:00Z"
        },
        {
          "id": 2,
          "userId": 1,
          "platformUserId": "67890",
          "platform": "GitHub",
          "status": "Connected",
          "accessToken": "access_token_example",
          "refreshToken": "refresh_token_example",
          "connectedAt": "2025-01-09T18:40:00Z",
          "updatedAt": "2025-01-09T18:45:00Z",
          "expiresAt": "2025-01-10T18:40:00Z"
        }
      ]
    }
    ```

---

### **Connect a new integration**

Add a new platform connection for the current user.

- **Require Authentication:** true
- **Request**
  - **Method:** POST
  - **Route path:** `/api/integrations`
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "platform": "Google",
      "platformUserId": "12345",
      "accessToken": "access_token_example",
      "refreshToken": "refresh_token_example",
      "expiresAt": "2025-01-10T18:32:00Z"
    }
    ```

- **Successful Response**
  - **Status Code:** 201
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "id": 3,
      "userId": 1,
      "platformUserId": "12345",
      "platform": "Google",
      "status": "Connected",
      "accessToken": "access_token_example",
      "refreshToken": "refresh_token_example",
      "connectedAt": "2025-01-09T18:50:00Z",
      "updatedAt": "2025-01-09T18:50:00Z",
      "expiresAt": "2025-01-10T18:50:00Z"
    }
    ```

- **Error Response: Missing fields**
  - **Status Code:** 400
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "message": "Bad Request",
      "errors": {
        "platform": "Platform is required",
        "platformUserId": "Platform user ID is required",
        "accessToken": "Access token is required"
      }
    }
    ```

---

### **Update an integration**

Update an existing integration for the current user.

- **Require Authentication:** true
- **Request**
  - **Method:** PUT
  - **Route path:** `/api/integrations/:id`
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "status": "Connected",
      "accessToken": "new_access_token_example",
      "refreshToken": "new_refresh_token_example",
      "expiresAt": "2025-01-11T18:32:00Z"
    }
    ```

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "platformUserId": "12345",
      "platform": "Google",
      "status": "Connected",
      "accessToken": "new_access_token_example",
      "refreshToken": "new_refresh_token_example",
      "connectedAt": "2025-01-09T18:32:00Z",
      "updatedAt": "2025-01-09T19:00:00Z",
      "expiresAt": "2025-01-11T18:32:00Z"
    }
    ```

- **Error Response: Integration not found**
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "message": "Integration not found"
    }
    ```

---

### **Delete an integration**

Remove an existing platform connection for the current user.

- **Require Authentication:** true
- **Request**
  - **Method:** DELETE
  - **Route path:** `/api/integrations/:id`
  - **Body:** none

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "message": "Integration successfully deleted"
    }
    ```

- **Error Response: Integration not found**
  - **Status Code:** 404
  - **Headers:**
    - Content-Type: application/json
  - **Body:**
    ```json
    {
      "message": "Integration not found"
    }
    ```

---

### **Get Analytics for a Portfolio**
- **GET** `/api/portfolios/:id/analytics`
  - **Description:** Get detailed analytics for a specific portfolio, including views, shares, and feedback interactions.
  - **Query Parameters (optional):**
    - `eventType`: `view`, `share`, or `feedback`
    - `fromDate`: Start date for filtering (e.g., `2025-01-01`)
    - `toDate`: End date for filtering (e.g., `2025-01-31`)

  **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "portfolioId": 101,
      "analytics": {
        "totalViews": 350,
        "totalShares": 45,
        "totalFeedback": 12,
        "events": [
          {
            "id": 1,
            "eventType": "view",
            "timestamp": "2025-01-10T12:45:00Z",
            "viewerId": null,
            "referrer": "LinkedIn",
            "location": "San Francisco, CA",
            "deviceType": "desktop",
            "browser": "Chrome"
          },
          {
            "id": 2,
            "eventType": "share",
            "timestamp": "2025-01-10T13:05:00Z",
            "viewerId": 34,
            "referrer": "Direct",
            "location": "New York, NY",
            "deviceType": "mobile",
            "browser": "Safari"
          },
          {
            "id": 3,
            "eventType": "feedback",
            "timestamp": "2025-01-11T09:15:00Z",
            "viewerId": 56,
            "referrer": "Email",
            "location": "Chicago, IL",
            "deviceType": "tablet",
            "browser": "Firefox"
          }
        ]
      }
    }
    ```

---

### **Error Response: Portfolio Not Found**
- **Status Code:** 404
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
  ```json
  {
    "message": "Portfolio not found"
  }

---

## **Authentication Endpoints**

### **Social Sign-In with External Platforms**

- **POST /api/auth/google**
  - **Description:** Authenticates and logs in the user via Google OAuth.
  - **Request Body:**
    ```json
    {
      "accessToken": "google_oauth_access_token"
    }
    ```
  - **Response (Success):**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com",
        "username": "JohnDoe",
        "avatarUrl": "https://avatar.url/image.png",
        "socialPlatform": "Google"
      }
    }
    ```
  - **Response (Error):**
    ```json
    {
      "message": "Google OAuth failed"
    }
    ```

- **POST /api/auth/github**
  - **Description:** Authenticates and logs in the user via GitHub OAuth.
  - **Request Body:**
    ```json
    {
      "accessToken": "github_oauth_access_token"
    }
    ```
  - **Response (Success):**
    ```json
    {
      "user": {
        "id": 2,
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@github.com",
        "username": "JaneSmith",
        "avatarUrl": "https://github.com/avatar.png",
        "socialPlatform": "GitHub"
      }
    }
    ```
  - **Response (Error):**
    ```json
    {
      "message": "GitHub OAuth failed"
    }
    ```

- **POST /api/auth/linkedin**
  - **Description:** Authenticates and logs in the user via LinkedIn OAuth.
  - **Request Body:**
    ```json
    {
      "accessToken": "linkedin_oauth_access_token"
    }
    ```
  - **Response (Success):**
    ```json
    {
      "user": {
        "id": 3,
        "firstName": "Alice",
        "lastName": "Brown",
        "email": "alice.brown@linkedin.com",
        "username": "AliceBrown",
        "avatarUrl": "https://linkedin.com/avatar.png",
        "socialPlatform": "LinkedIn"
      }
    }
    ```
  - **Response (Error):**
    ```json
    {
      "message": "LinkedIn OAuth failed"
    }
    ```

### **Get User Integrations**
- **GET /api/integrations**
  - **Description:** Retrieves all external platform connections for the logged-in user.
  - **Response:**
    ```json
    {
      "integrations": [
        {
          "platform": "Google",
          "connectedAt": "2025-01-10T12:00:00Z",
          "status": "active"
        },
        {
          "platform": "GitHub",
          "connectedAt": "2025-01-09T18:00:00Z",
          "status": "active"
        }
      ]
    }
    ```

### **Disconnect an Integration**
- **DELETE /api/integrations/:platform**
  - **Description:** Disconnects a linked social account (e.g., Google, GitHub, LinkedIn).
  - **Response (Success):**
    ```json
    {
      "message": "Successfully disconnected GitHub"
    }
    ```
  - **Response (Error):**
    ```json
    {
      "message": "Integration not found"
    }
    ```

---

### **Figma Flow Guidance for Sign-Up and Log-In Modals**

- **Sign-Up Modal**:
  1. **Title Section:** "Create an Account" (clean and concise).
  2. **Input Fields:**
     - Name, email, and password input fields.
     - Autofocus on the first field (email).
  3. **SSO Buttons:**
     - "Sign Up with Google" (red button, icon included).
     - "Sign Up with GitHub" (black button).
     - "Sign Up with LinkedIn" (blue button).
  4. **Form Buttons:**
     - "Already have an account? Log in" link for easy access.

- **Log-In Modal**:
  1. **Title Section:** "Log In to ProFolio".
  2. **Input Fields:**
     - Email and password input fields.
     - Autofocus on the email input.
  3. **SSO Buttons:**
     - "Log In with Google" (red button).
     - "Log In with GitHub" (black button).
     - "Log In with LinkedIn" (blue button).
  4. **Password Recovery Link:**
     - "Forgot Password?" link for password reset.

- **Error States**:
  - For invalid log-in attempts, show feedback like:
    - "Invalid email or password. Please try again."
    - "GitHub OAuth failed. Please authorize access."

---

## **Feedback Visibility Endpoints**

### **Update Feedback Visibility**
Allows users to set feedback visibility as public or private.

- **Require Authentication:** true
- **Request**
  - **Method:** PATCH
  - **Route path:** `/api/feedback/:id/visibility`
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "isPublic": true
    }
    ```

- **Successful Response**
  - **Status Code:** 200
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Feedback visibility updated",
      "feedback": {
        "id": 1,
        "comment": "Great portfolio!",
        "isPublic": true
      }
    }
    ```

- **Error Response: Feedback not found**
  - **Status Code:** 404
  - **Headers:**
    - `Content-Type: application/json`
  - **Body:**
    ```json
    {
      "message": "Feedback not found"
    }
    ```

---