ProFolio - solo capstone project

# **ProFolio**

**ProFolio** is a customizable and professional portfolio-building platform that empowers users across all professions to showcase their achievements and projects in a modern, interactive, and personalized way. With ProFolio, users can build and share their portfolios using dynamic templates, integrated project insights, and interactive features like feedback, badges, and analytics.

---

## **Table of Contents**
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Run Locally](#run-locally)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [Future Improvements](#future-improvements)
11. [Acknowledgments](#acknowledgments)

---

## **Features**
- **Customizable Drag-and-Drop Portfolio Builder:** Users can easily create, update, and organize their portfolio sections.
- **Pre-Built Templates:** Multiple professionally designed templates for different careers (e.g., developer, designer, photographer).
- **Project Integration:** Show off projects with GitHub stats (stars, forks) and live project links.
- **Feedback System:** Visitors can leave comments and feedback on portfolios.
- **Badges and Achievements:** Users earn badges for reaching milestones.
- **Analytics Dashboard:** Track views, shares, and feedback counts for portfolios and projects.
- **Responsive Design:** Optimized for desktop and mobile screens.
- **User Authentication:** Secure signup, login, and logout functionality with demo user access.

---

## **Tech Stack**
### **Frontend:**
- **React** (with **Vite** for faster builds)
- **Redux** (for state management)
- **HTML5/CSS3/SASS** (for styling)

### **Backend:**
- **Express.js** (for handling API routes)
- **Prisma** (ORM for database interaction)
- **Node.js** (server-side framework)

### **Database:**
- **PostgreSQL** (production database)
- **SQLite** (development database)

### **Other Tools and Integrations:**
- **GitHub API** (for project insights)
- **Google Analytics API** (for detailed portfolio analytics)
- **AWS S3** (for image storage)

---

## **Getting Started**

### **Prerequisites:**
Make sure you have the following installed:
- **Node.js** (v16+)
- **NPM** (or **Yarn**)
- **PostgreSQL** (for local and production databases)

---

## **Environment Variables**
Here’s the properly formatted content you requested in markdown:

---

## **Environment Variables**

Create a `.env` file in the root directory with the following:
```env
PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/profolio_db
JWT_SECRET=your_jwt_secret_key
AWS_BUCKET_NAME=your_aws_bucket_name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
GITHUB_API_KEY=your_github_api_key
GOOGLE_ANALYTICS_ID=your_analytics_id
```

---

## **Database Schema**

The ProFolio database schema includes the following tables:
- **Users:** Stores user information (e.g., username, email, avatar).
- **Projects:** Stores user-added projects with descriptions, tags, and GitHub data.
- **Portfolios:** Manages public and private portfolios for each user.
- **Feedback:** Stores viewer comments and notes.
- **Badges:** Stores badge achievements.
- **User Badges:** Tracks which badges each user has earned.
- **Templates:** Stores pre-defined portfolio templates.
- **Custom Sections:** Stores user-customized sections (e.g., “About Me,” “Awards”).

---

### **1. Users Table**
| Column Name | Type    | Description             |
|--------------|---------|------------------------|
| id           | Integer | Primary key             |
| username     | String  | Unique username         |
| email        | String  | Unique email address    |
| firstName    | String  | First name of the user  |
| lastName     | String  | Last name of the user   |
| bio          | String  | Short bio (optional)    |
| avatarUrl    | String  | Profile picture URL     |
| resumeUrl    | String  | Resume URL (optional)   |
| socialLinks  | JSON    | Social media links      |
| themePreference | String | Social media links   |

---

### **2. Portfolios Table**
| Column Name  | Type    | Description                      |
|--------------|---------|-----------------------------------|
| id           | Integer | Primary key                      |
| userId       | Integer | Foreign key referencing `Users`  |
| publicUrl    | String  | Unique public URL for the portfolio |
| isPublished  | Boolean | Determines if the portfolio is public |
| viewsCount   | Integer | Number of views                   |
| sharesCount  | Integer | Number of times shared            |
| tags         | String  | Tags for filtering/searching      |

---

### **3. Projects Table**
| Column Name  | Type    | Description                      |
|--------------|---------|-----------------------------------|
| id           | Integer | Primary key                      |
| userId       | Integer | Foreign key referencing `Users`  |
| title        | String  | Project title                     |
| description  | String  | Project description                |
| githubRepo   | String  | GitHub repository link             |
| projectLink  | String  | Live project/demo link             |
| imageUrl     | String  | Image URL for the project          |

---

### **4. Feedback Table**
| Column Name  | Type    | Description                       |
|--------------|---------|-----------------------------------|
| id           | Integer | Primary key                       |
| portfolioId  | Integer | Foreign key referencing `Portfolios` |
| viewerName   | String  | Name of the viewer leaving feedback |
| comment      | String  | The feedback comment               |
| createdAt    | DateTime| Timestamp when feedback was created |

---

### **5. Badges Table**
| Column Name  | Type    | Description                        |
|--------------|---------|------------------------------------|
| id           | Integer | Primary key                        |
| title        | String  | Title of the badge                 |
| description  | String  | Description of how to earn the badge |
| iconUrl      | String  | Icon representing the badge         |
| criteria     | JSON    | Conditions needed to earn the badge |

---

### **6. User Badges Table**
| Column Name | Type    | Description                        |
|-------------|---------|------------------------------------|
| id          | Integer | Primary key                        |
| userId      | Integer | Foreign key referencing `Users`    |
| badgeId     | Integer | Foreign key referencing `Badges`   |
| dateEarned  | DateTime| Timestamp when the badge was earned |

---

### **7. Templates Table**
| Column Name      | Type    | Description                      |
|------------------|---------|-----------------------------------|
| id               | Integer | Primary key                      |
| userId           | Integer | Foreign key referencing `Users`  |
| careerType       | String  | Type of career the template is for |
| templateType     | String  | Type of template (e.g., "Modern") |
| primaryColor     | String  | Primary color of the template     |
| secondaryColor   | String  | Secondary color of the template   |
| fontStyle        | String  | Font style for the template       |
| animationSettings| String  | Animation settings for transitions (optional) |

---

### **8. Custom Sections Table**
| Column Name  | Type    | Description                         |
|--------------|---------|-------------------------------------|
| id           | Integer | Primary key                         |
| userId       | Integer | Foreign key referencing `Users`     |
| sectionTitle | String  | Title of the custom section          |
| content      | String  | Content for the custom section       |
| orderIndex   | Integer | Display order of the section         |
| sectionType  | String  | Type of section (e.g., "text", "list") |

---

## **API Documentation**

Full API documentation for **ProFolio** is available [here](./api-docs.md). Below is a brief preview of the key endpoints:

---

### **Authentication Endpoints**

- **POST /api/users**
  - **Description:** Sign up a new user.
  - **Request Body:**
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@gmail.com",
      "username": "JohnDoe",
      "password": "securepassword"
    }
    ```
  - **Response:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com",
        "username": "JohnDoe"
      }
    }
    ```

- **POST /api/session**
  - **Description:** Log in a user.
  - **Request Body:**
    ```json
    {
      "credential": "john.doe@gmail.com",
      "password": "securepassword"
    }
    ```
  - **Response:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com",
        "username": "JohnDoe"
      }
    }
    ```

- **GET /api/users/:id**
  - **Description:** Get current user details (if logged in).
  - **Response:**
    ```json
    {
      "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@gmail.com",
        "username": "JohnDoe"
      }
    }
    ```

---

### **Portfolio Endpoints**

- **GET /api/portfolios**
  - **Description:** Get all portfolios for the logged-in user.
  - **Response:**
    ```json
    {
      "portfolios": [
        {
          "id": 1,
          "userId": 1,
          "publicUrl": "https://profolio.example.com/johndoe",
          "isPublished": true,
          "viewsCount": 150,
          "sharesCount": 20,
          "tags": "Developer, Web",
          "createdAt": "2025-01-01T12:00:00Z",
          "updatedAt": "2025-01-03T14:00:00Z"
        }
      ]
    }
    ```

- **POST /api/portfolios**
  - **Description:** Create a new portfolio.
  - **Request Body:**
    ```json
    {
      "publicUrl": "https://profolio.example.com/johndoe",
      "isPublished": true,
      "tags": "Developer, Web"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 1,
      "userId": 1,
      "publicUrl": "https://profolio.example.com/johndoe",
      "isPublished": true,
      "tags": "Developer, Web",
      "viewsCount": 0,
      "sharesCount": 0,
      "createdAt": "2025-01-01T12:00:00Z",
      "updatedAt": "2025-01-01T12:00:00Z"
    }
    ```

---

Let me know if you'd like more updates or edits!

### **3. Deploy the Backend**
- Deploy your **Express** backend to a service like **Render**:
  1. Create a new web service in Render.
  2. Connect your GitHub repository.
  3. Specify the start command:
     ```bash
     npm run start
     ```
  4. Add your environment variables in Render's settings.
  5. Deploy and wait for the service to build and run.

### **4. Deploy the Frontend**
- Deploy your **React** frontend to **Netlify** or **Vercel**:
  1. Log in to Netlify or Vercel.
  2. Create a new site and link it to your GitHub repository.
  3. Specify the build command and output directory:
     ```bash
     npm run build
     ```
     Output directory: `dist`
  4. Add any necessary environment variables for the frontend (e.g., API URL).
  5. Deploy the site and confirm it is live.

### **5. Final Steps**
- Make sure the frontend can connect to the backend API by updating the API base URL in the frontend.
- Test the deployed application for any issues with authentication, database connections, or API requests.
- Add your custom domain if applicable (Netlify and Vercel allow this).

---

This section provides the steps for deploying both the **backend** and **frontend** of **ProFolio**. Let me know if you'd like additional notes or troubleshooting tips!


## **Contributing**

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes and push to your fork.
4. Submit a pull request for review.

---

## **Future Improvements**
- **Live Collaboration:** Allow users to invite collaborators to edit portfolios.
- **Theme Builder:** Enable users to create custom themes with advanced controls.
- **Custom Domain Support:** Allow users to link custom domains to their portfolios.
- **WebSockets:** Enable real-time updates for analytics and comments.
- **Internationalization:** Add support for multiple languages.

---

## **Acknowledgments**
- Thanks to **Prism.js** for syntax highlighting.
- Special thanks to **App Academy** for guidance.
- All icons and design assets are credited to their original creators.

---

## **License**

This project is licensed under the MIT License.
