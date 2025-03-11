
# Backend Deployment Guide

This guide explains how to deploy the FocusFlow backend API to various platforms.

## General Preparation

Before deploying:

1. Ensure you have the following:
   - A GitHub account (for source control)
   - Your OpenAI API key
   - Node.js 18+ installed locally

2. Push your code to a GitHub repository:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/focusflow-backend.git
   git push -u origin main
   ```

## Deployment Options

### 1. Render

[Render](https://render.com/) offers a simple deployment process with a generous free tier.

1. Create a Render account and connect your GitHub repository
2. Create a new Web Service
3. Select your repository
4. Configure the service:
   - Name: `focusflow-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free
   
5. Add the environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key

6. Click "Create Web Service"

7. Render will deploy your application and provide you with a URL like `https://focusflow-api.onrender.com`

### 2. Vercel

[Vercel](https://vercel.com/) is an excellent platform optimized for frontend applications but can host Node.js servers too.

1. Create a `vercel.json` file in your project root:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ]
   }
   ```

2. Create a Vercel account and connect your GitHub repository
3. Import your repository as a new project
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: ./
   
5. Add the environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key

6. Deploy

### 3. Netlify

[Netlify](https://www.netlify.com/) requires Netlify Functions to deploy server-side code.

1. Create a `netlify.toml` file:
   ```toml
   [build]
     command = "npm install"
     functions = "netlify/functions"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/api/:splat"
     status = 200
   ```

2. Create the following directory structure:
   ```
   netlify/
     functions/
       api.js
   ```

3. Create `netlify/functions/api.js`:
   ```javascript
   const express = require('express');
   const serverless = require('serverless-http');
   const cors = require('cors');
   const { Configuration, OpenAIApi } = require('openai');

   const app = express();
   app.use(cors());
   app.use(express.json());

   const configuration = new Configuration({
     apiKey: process.env.OPENAI_API_KEY,
   });
   const openai = new OpenAIApi(configuration);

   app.post('/api/chat', async (req, res) => {
     try {
       // ... (same code as in server.js)
     } catch (error) {
       // ... (same error handling)
     }
   });

   app.get('/api/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
   });

   module.exports.handler = serverless(app);
   ```

4. Add `serverless-http` to dependencies:
   ```
   npm install serverless-http
   ```

5. Create a Netlify account and connect your GitHub repository
6. Import your repository as a new site
7. Add the environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key
8. Deploy

## After Deployment

1. Test your API with a tool like Postman or curl:
   ```
   curl -X POST https://your-deployed-url.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello, how are you?"}'
   ```

2. Update your frontend to use the new API endpoint (see the frontend modifications in the main PR).
