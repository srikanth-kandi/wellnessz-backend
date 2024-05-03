# WellnessZ Posts API

Live API URL - [https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts)

Postman Workspace - [https://www.postman.com/interstellar-flare-93984/workspace/wellnessz-posts-api-workspace](https://www.postman.com/interstellar-flare-93984/workspace/wellnessz-posts-api-workspace)

## Posts table Schema

Create a PostgreSQL Database with name of your choice and run the following SQL commands to create the required table.

```sql
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    "imageURL" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Instructions to run the application

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file in the root directory and add the following environment variables

    ```
    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASS=your_db_pass
    DB_HOST=your_db_host
    DB_PORT=5432
    DB_CERT=your_db_cert
    AWS_BUCKET_NAME=your_bucket_name
    AWS_SECRET_ACCESS_KEY=your_secret_access_key
    AWS_ACCESS_KEY_ID=your_access_key_id
    AWS_REGION=your_region
    ```
4. Run `npm start` to start the server
5. The server will start running on `http://localhost:3000`

## API Endpoints

### GET /posts

- Description: Get all posts
- Response: Array of posts limited to 10
- Example: [/posts](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts)

### GET /posts?tag=:tag

- Description: Get all posts with a specific tag
- Query Parameter:
    - tag: String (required) - The tag to filter the posts by "nature", "animals", "people", "food","travel", "tech", "architecture", "art", "fashion" and "sports"
- Response: Array of posts
- Example: [/posts?tag=nature](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts?tag=nature)

### GET /posts?keyword=:search

- Description: Get all posts that match the search query
- Query Parameter:
    - search: String (required) - The search query to match against post titles and descriptions
- Response: Array of posts
- Example: [/posts?keyword=in](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts?keyword=in)

### GET /posts?sort=:sort&order=:order

- Description: Get all posts sorted by a specific field
- Query Parameter:
    - sort: String (required) - The field to sort the posts by "id", "title", "description", "tag" and "imageURL". The fields order is used for sorting in ascending order ("asc") and for descending order ("desc").
- Response: Array of posts
- Example: [/posts?sort=id&order=desc](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts?sort=id&order=desc)

### GET /posts?limit=:limit&page=:page

- Description: Get all posts with pagination
- Query Parameter:
    - limit: Number (required) - The number of posts to return per page
    - page: Number (required) - The page number to return
- Response: Array of posts
- Example: [/posts?limit=5&page=3](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts?limit=5&page=3)

### POST /posts

- Description: Create a new post
- Request Body: JSON
  - title: String
  - description: String
  - tag: String
  - image: File (multipart/form-data)
- Response: Created post
- Example: [https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts](https://wellnessz-backend-495a90d34b2b.herokuapp.com/posts)