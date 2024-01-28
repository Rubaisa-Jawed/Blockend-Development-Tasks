// pages/api/auth/signin.js
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;

            // Path to the JSON database
            const filePath = path.join(process.cwd(), 'database', 'testDatabase.json');
            const fileData = fs.readFileSync(filePath, 'utf8');
            const users = JSON.parse(fileData || '[]');

            // Find user by email
            const user = users.find(user => user.email === email);
            if (!user) {
                res.status(401).json({ error: 'User does not exist' });
                return;
            }

            // Compare hashed password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                res.status(401).json({ error: 'Invalid password' });
                return;
            }

            // User authenticated
            res.status(200).json({ message: 'Authentication successful' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
