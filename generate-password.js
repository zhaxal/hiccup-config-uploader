// generate-password.js
const bcrypt = require('bcryptjs');

if (process.argv.length < 3) {
    console.error('Please provide a password as argument');
    console.error('Usage: node generate-password.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const saltRounds = 10;

bcrypt.hash(password, saltRounds)
    .then(hash => {
        console.log('\nHashed Password:');
        console.log(hash);
        console.log('\nAdd this to your .env file as:');
        console.log(`HASHED_PASSWORD=${hash}\n`);
    })
    .catch(err => {
        console.error('Error generating hash:', err);
        process.exit(1);
    });