// Import the User model or use your own database connection method
const User = require('../models/User'); // Import your User model

async function fetchAllUsersFromDatabase() {
  try {
    // Fetch all users from the database
    const users = await User.find({}); // This will retrieve all users
    
    return users;
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching users from the database:", error);
    throw new Error("Failed to fetch users from the database.");
  }
}

module.exports = fetchAllUsersFromDatabase;
