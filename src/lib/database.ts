import mysql from 'mysql2/promise';

// This file contains the database connection logic.
// The credentials are hardcoded here as per your request.

const dbConfig = {
    host: "192.168.2.6",
    user: "assetuser",
    password: "assetpass",
    database: "assetdb",
    port: 3306,
};


console.log("Database configuration loaded:");
console.log("DB_HOST:", dbConfig.host ? "********" : "Not Set");
console.log("DB_USER:", dbConfig.user ? "********" : "Not Set");
console.log("DB_PASSWORD:", dbConfig.password ? "********" : "Not Set");
console.log("DB_NAME:", dbConfig.database ? "********" : "Not Set");

// Create a connection pool
export const pool = mysql.createPool(dbConfig);

// Function to test the connection
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database.');
        connection.release();
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
}

// Test the connection when the application starts
testConnection();
