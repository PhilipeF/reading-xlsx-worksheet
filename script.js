
const xlsx = require("xlsx");
const mysql = require('mysql');

const wb = xlsx.readFile("tabelabehappy.xlsx");

const ws = wb.Sheets["BE HAPPY"]

console.log(ws)


//aqui vai ficar a conexão com o banco

async function runTransaction() {
    try {
        // Start a transaction
        await beginTransaction(connection);

        // Insert a new record into the "users" table
         const userId = await insertUser(connection, 'behappytabacaria_hlg', 'behappytabacaria_root');
         console.log('Inserted record with ID ' + userId);

        // Commit the transaction
        await commitTransaction(connection);

        console.log('Transaction committed successfully.');
    } catch (error) {
        console.error('Error performing transaction: ' + error.stack);

        // Rollback the transaction
        await rollbackTransaction(connection);

        console.error('Transaction rolled back.');
    } finally {
        connection.end();
    }
}

async function beginTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function commitTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.commit((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function rollbackTransaction(connection) {
    return new Promise((resolve, reject) => {
        connection.rollback((error) => {
            if (error) {
                reject(error);
            } else {
                resolve();
            }
        });
    });
}

async function insertUser(connection, name, email) {
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    const values = [name, email];

    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results.insertId);
            }
        });
    });
}

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }

    console.log('Connected to MySQL database as ID ' + connection.threadId);

    runTransaction();
});