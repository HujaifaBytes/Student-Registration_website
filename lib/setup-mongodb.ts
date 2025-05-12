// This file is for documentation purposes only
// Follow these steps to set up MongoDB for your Olympiad Registration System:

/*
1. Create a MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (create a user with password)
4. Set up network access (allow access from anywhere for development)
5. Get your connection string from MongoDB Atlas
6. Create a .env.local file in the root of your project with the following:

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

7. Replace <username>, <password>, <cluster>, and <database> with your MongoDB Atlas credentials
8. Restart your application

The system will automatically create the necessary collections:
- students: Stores all student registration data
- admins: Stores admin user credentials

Default admin credentials:
Username: Science@1
Password: Jackson.com@312

You can change these credentials in the lib/db.ts file before deploying to production.
*/

export {}
