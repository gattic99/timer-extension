
# FocusFlow API Backend

This is the backend server for the FocusFlow Chrome extension, handling secure communication with the OpenAI API.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

3. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

## Running the Server

### Development
```
npm run dev
```

### Production
```
npm start
```

## API Endpoints

- `POST /api/chat` - Send a message to the AI and get a response
- `GET /api/health` - Health check endpoint

## Deployment

See the `BACKEND_DEPLOYMENT.md` file for deployment instructions to various platforms.
