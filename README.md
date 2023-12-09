# Vehicle-Maintenance-Tracker
An application for tracking vehicle maintenance items such as oil changes, filter changes, or any other services performed on a vehicle. Notifies the user of upcoming service intervals for each tracked vehicle and service item. Each user has an account so they can easily manage their records.

## Requirements
Node.js and PostgreSQL installed

## Database
Use the database.sql script in /server to generate the necessary database and tables for PosgreSQL. The server assumes PSQL is running on localhost:5432.

## Client
```
cd client
```
```
npm install
```
```
npm start
```
Application will start at localhost:3000

## Server
```
cd server
```
```
node index.js
```
Application will start at localhost:1234
