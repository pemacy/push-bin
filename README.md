# Request Bin

A full-stack webhook inspection and testing application that allows developers to create temporary URLs (bins) for capturing, inspecting, and analyzing HTTP requests in real-time.

## Use - need 3 terminal window

1. Terminal 1: Install ngrok

```
ngrok http --url=amazing-mostly-tadpole.ngrok-free.app 3000
```

2. Terminal 2:

```
cd server
npm run server:dev
```

3. Terminal 3:

```
cd client
npm run dev
```

## Create webhook

1. Go to localhost:5173 (or whatever vite gives you as the endpoint)
2. Create and open a new bin
3. Copy the bin address and put that as the webhook

The page will now start receiving webhook packages

## Github example

If you make a repo have the ngrok endpoint as a webhook, then when you commit it will push information about that commit to Push Bin

## Features

- **Create Webhook Bins**: Generate unique URLs to capture webhooks and HTTP requests
- **Real-time Updates**: Live record updates via WebSocket connections
- **Request Inspection**: View detailed request data including:
  - HTTP method and headers
  - Request payloads and bodies
  - Timestamps
- **Session Management**: Bins are scoped to user sessions via HTTP cookies
- **Multi-Database Architecture**: Hybrid PostgreSQL + MongoDB for optimal data storage
- **Multiple Deployment Modes**: Support for local development and AWS RDS with SSL/Secrets Manager

## Technology Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.1.0
- **Databases**:
  - PostgreSQL (bin metadata, record references)
  - MongoDB (webhook payloads and headers)
- **Real-time**: WebSocket (ws 8.18.3)
- **AWS Integration**: AWS SDK, AWS Secrets Manager
- **Session Management**: cookie-parser, cookie-session
- **Testing**: Vitest 3.2.4

### Frontend

- **Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS 4.1.12
- **HTTP Client**: Axios 1.11.0
- **Icons**: React Icons 5.5.0
- **Testing**: Vitest 3.2.4

## Project Structure

```
request-bin-react/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # React components (Form, Sidebar, BinPage, etc.)
│   │   ├── services/       # API client (webhookApi.ts)
│   │   ├── utils/          # Utility functions and TypeScript types
│   │   └── tests/          # Frontend tests
│   └── package.json
├── server/                 # Express backend application
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── db/             # Database connections and schemas
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API route definitions
│   │   ├── tests/          # Backend tests
│   │   └── utils/          # Server utilities
│   └── package.json
└── README.md
```

## Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- MongoDB database

### Clone and Install

```bash
# Navigate to the project directory
cd request-bin-react

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Configuration

Create environment files in both `server/` and `client/` directories:

### Server Environment (`.env.development`)

```env
NODE_ENV=development
PORT=3000
ARCHITECTURE=single-machine

# PostgreSQL Configuration
PGHOST=localhost
PGPORT=5432
PGDATABASE=request_bin
PGUSER=your_username
PGPASSWORD=your_password

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/request_bin

# AWS Configuration (for production)
AWS_MONGO_SECRET_NAME=your_secret_name
AWS_POSTGRES_SECRET_NAME=your_secret_name
CA_FILE_PATH=path/to/ca-certificate.pem
```

### Client Environment (`.env.development`)

```env
VITE_WEBHOOK_URL=http://localhost:3000/api
```

## Database Setup

### PostgreSQL

```bash
# From server directory
cd server
psql -U your_username -d request_bin -f src/db/postgres/schema.sql
```

### MongoDB

```bash
# MongoDB will create collections automatically on first use
# Seed data (optional):
npm run db:seed
```

## Usage

### Development Mode

Start both the backend and frontend:

```bash
# Terminal 1 - Start Server
cd server
npm run server:dev

# Terminal 2 - Start Client
cd client
npm run dev-mode
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

### Creating a Bin

1. Open the application in your browser
2. Enter a bin name and click "Create Bin"
3. Copy the generated bin URL
4. Send HTTP requests to that URL
5. View incoming requests in real-time on the bin page

### Sending Webhooks

Test your bin using curl:

```bash
# Example webhook
curl -X POST http://localhost:3000/api/your-bin-id \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, Request Bin!"}'
```

Or using another service:

```bash
# GitHub webhook example
# Add the bin URL as a webhook endpoint in your repository settings
```

## API Endpoints

| Method | Endpoint                | Description                         |
| ------ | ----------------------- | ----------------------------------- |
| GET    | `/health`               | Health check                        |
| GET    | `/bins`                 | List all bins for current session   |
| GET    | `/bins/:id`             | Get bin details                     |
| GET    | `/bins/:id/records`     | Get all records for a bin           |
| POST   | `/bins/:id`             | Create a new bin                    |
| POST   | `/:id`                  | Create record (webhook capture)     |
| POST   | `/bins/:id/records`     | Create record (webhook capture)     |
| DELETE | `/bins`                 | Delete all bins for current session |
| DELETE | `/bins/:id`             | Delete a specific bin               |
| DELETE | `/bins/:id/records`     | Delete all records for a bin        |
| DELETE | `/bins/:id/records/:id` | Delete a specific record            |

## Architecture

### Hybrid Database Pattern

- **PostgreSQL**: Stores bin metadata and record references (lightweight relational data)
  - `bins` table: id, session_id, created_at
  - `records` table: id, method, bin_id, mongo_doc_id, created_at
- **MongoDB**: Stores flexible request payloads and headers
  - `WebHookPayloads` collection: id, payload, headers

This pattern provides:

- Fast relational queries for bin management
- Flexible document storage for variable webhook data
- Optimal performance for each use case

### Deployment Modes

The application supports four deployment modes via the `ARCHITECTURE` environment variable:

1. **single-machine**: Local development with standard DB connections
2. **3-tier**: Traditional 3-tier architecture
3. **RDS-ssl**: AWS RDS with SSL/TLS encryption
4. **RDS-secret-manager**: AWS RDS with credentials via AWS Secrets Manager

## Testing

### Backend Tests

```bash
cd server
npm run test:watch
```

### Frontend Tests

```bash
cd client
npm run test:watch
```

### Database Reset

```bash
# Reset PostgreSQL test database
cd server
npm run db:reset:test

# Reset PostgreSQL development database
npm run db:reset:development
```

## Production Deployment

### AWS Deployment

For production deployment with AWS:

1. **RDS Setup**: Create PostgreSQL and MongoDB instances on AWS RDS
2. **Secrets Manager**: Store database credentials in AWS Secrets Manager
3. **SSL Configuration**: Obtain SSL certificates for encrypted connections
4. **Environment Variables**: Set `ARCHITECTURE=RDS-secret-manager`
5. **CloudFront**: Configure CDN for frontend (optional)

### CloudFront Signed URLs

The project includes support for generating signed CloudFront URLs for private S3 content:

```bash
node cloudfrontSignedUrl.js
```

See `cloudfrontSignedUrl.js` for configuration details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Use Cases

- **Debugging Webhooks**: Test and debug webhook integrations from services like GitHub, Stripe, Slack
- **API Development**: Inspect HTTP requests during API development
- **Integration Testing**: Capture and analyze third-party callback URLs
- **Security Testing**: Monitor incoming request data for security analysis
- **Documentation**: Generate examples of webhook payloads from real services
