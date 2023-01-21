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
* **POST** *`/forgot-password`* : Get One-time reset link via email
* **POST** *`/reset-password/:id`* : Reset password
* **POST** *`/register`* : Register User
* **POST** *`/login`* : Log in User
* **GET** *`/:id`* : Get User detail
* **POST** *`/:id/editUser`* : Edit User

**Posts**
* **GET** *`/:id`* : Get post
* **POST** *`/:id/editPost`* : Edit post
* **POST** *`/createPost`* : Create post
* **POST** *`/deletePost`* : Delete post
* **POST** *`/:id/like`* : Like post
* **POST** *`/:id/unlike`* : Unlike post

### Sample User
**Email:** abc@123.com
**Password:** 123456

### Built With
* **Node.js** - JavaScript runtime
* **Express** - Web framework for Node.js
* **MongoDB** - NoSQL database
* **Cloudinary** - Cloud-based image and video management service
* **JWT** - JSON Web Tokens for user authentication and authorization
