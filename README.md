# Social Media Platform

A modern social media platform built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (signup, login, logout)
- Create and share posts
- Like and comment on posts
- User profiles
- Real-time updates
- Responsive design

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT
- Styling: Tailwind CSS

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
social-media-platform/
├── client/             # Frontend React application
├── server/             # Backend Node.js/Express application
├── .env                # Environment variables
└── README.md          # Project documentation
``` 