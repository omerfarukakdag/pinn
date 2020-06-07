# Pinn-Online Bookmark Manager

# Features

- Search
- Bookmark notes and tags
- Attach a file to a bookmark
- Generate QR code
- Import/Export bookmarks

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the application.

# Screenshots

Login
![Alt text](images/login.PNG?raw=true 'login')

Application
![Alt text](images/app.PNG?raw=true 'app')

Import Bookmarks
![Alt text](images/import.PNG?raw=true 'import')

Dashboard
![Alt text](images/main.PNG?raw=true 'main')

Update a bookmark
![Alt text](images/update.PNG?raw=true 'update')

Generate QR Code
![Alt text](images/qr.PNG?raw=true 'qr')

Export Bookmarks
![Alt text](images/export.PNG?raw=true 'export')
