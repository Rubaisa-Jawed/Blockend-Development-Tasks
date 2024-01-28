// pages/api/auth/signup.js
import bcrypt from 'bcrypt';
import { ethers } from 'ethers';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const SECRET_KEY = 'Secretkey'; // Replace with your key from environment variables
const secretKeyBuffer = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);

function encryptPrivateKey(privateKey) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKeyBuffer), iv);
    let encrypted = cipher.update(privateKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}



export default async function handler(req, res) {


    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;
            const wallet = ethers.Wallet.createRandom();
            const privateKey = wallet.privateKey;
            const publicKey = wallet.address;
            const encryptedPrivateKey = encryptPrivateKey(privateKey);

            // Path to the JSON database
            const filePath = path.join(process.cwd(), 'database', 'testDatabase.json');
            const fileData = fs.readFileSync(filePath, 'utf8');
            const users = JSON.parse(fileData || '[]');

            // Check if user already exists
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                res.status(409).json({ error: 'User already exists' });
                return;
            }

            const salt = await bcrypt.genSalt(10); // You can adjust the cost factor
            const hashedPassword = await bcrypt.hash(password, salt);

            // Prepare user data and save

            const userData = {
                email,
                password: hashedPassword,
                wallets: [{ privateKey: encryptedPrivateKey, publicKey }]
            };

            users.push(userData);
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }



}
