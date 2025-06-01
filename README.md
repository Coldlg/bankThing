# Bank Service Application

A modern banking application built with Next.js, Express.js, and MySQL.

## Features

- User authentication (signup/login)
- Account management
- Money transfers between accounts
- Transaction history
- Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Express.js, MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: MySQL

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/bank-service.git
cd bank-service
```

2. Install frontend dependencies:

```bash
cd front
npm install
```

3. Install backend dependencies:

```bash
cd ../back
npm install
```

4. Set up the database:

- Create a MySQL database named 'bank'
- Import the database schema from `back/database.sql`

5. Configure environment variables:

- Create a `.env` file in the `back` directory with the following variables:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bank
JWT_SECRET=your_secret_key
PORT=4000
```

## Running the Application

1. Start the backend server:

```bash
cd back
npm start
```

2. Start the frontend development server:

```bash
cd front
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
bank-service/
├── front/                 # Next.js frontend
│   ├── src/
│   │   ├── pages/        # Page components
│   │   └── styles/       # Global styles
│   └── public/           # Static files
├── back/                 # Express.js backend
│   ├── app.js           # Main application file
│   └── database.sql     # Database schema
└── README.md
```

## API Endpoints

- `POST /api/signup` - Create a new user account
- `POST /api/login` - User login
- `GET /api/user` - Get user profile
- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create new account
- `POST /api/transfers` - Transfer money between accounts
