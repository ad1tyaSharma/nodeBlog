# Node Blog
A simple blog application built using Node.js, Express, and MongoDB.

### Features
* User authentication and authorization using JSON Web Tokens (JWT).
* Password Reset using One-time password reset link sent via email.
* CRUD operations for blog posts.
* User likes on blog posts.
* Image upload and storage using Cloudinary.

### Prerequisites
* Node.js and npm (node package manager)
* MongoDB
* Cloudinary account (for image storage)

### Installation
1. Clone the repository:
```
https://github.com/ad1tyaSharma/nodeBlog
```
1. Install the dependencies:
```
npm install
```
1. Create a _`.env`_ file in the root of the project and add the following environment variables:
```
MONGO_URI='MongoDB Url'
SESSION_SECRET = 'session secret'
PORT= 'Port number of server'
JWT_SECRET = 'JWT secret'
CLOUDINARY_API_KEY='Your cloudinary API key'
CLOUDINARY_NAME='Your cloudinary cloud's name'
CLOUDINARY_PRESET='Your cloudinary preset'
HOST = 'domain of server'
SIB_KEY = 'Your SendinBlue API key'
```
1. Start the server:
```
npm start
```
The application will be running on *`http://localhost:3000`*

### API Endpoints

#### The following endpoints are available for the blog application:
**Users**
* **POST** *`/users/forgot-password`* : Get One-time reset link via email
* **POST** *`/users/reset-password/:id`* : Reset password
* **POST** *`/users/register`* : Register User
* **POST** *`/users/login`* : Log in User
* **GET** *`/users/:id`* : Get User detail
* **POST** *`/users/:id/editUser`* : Edit User

**Posts**
* **GET** *`/posts/:id`* : Get post
* **POST** *`/posts/:id/editPost`* : Edit post
* **POST** *`/posts/createPost`* : Create post
* **POST** *`/posts/deletePost`* : Delete post
* **POST** *`/posts/:id/like`* : Like post
* **POST** *`/posts/:id/unlike`* : Unlike post

### Sample User
**Email:** abc@123.com
**Password:** 123456

### Built With
* **Node.js** - JavaScript runtime
* **Express** - Web framework for Node.js
* **MongoDB** - NoSQL database
* **Cloudinary** - Cloud-based image and video management service
* **JWT** - JSON Web Tokens for user authentication and authorization
