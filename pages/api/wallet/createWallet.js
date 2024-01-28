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
    const { email } = req.body; // Get email from request body

    const filePath = path.join(process.cwd(), 'database', 'testDatabase.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(fileData);

    const user = users.find(user => user.email === email);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    // Create a new wallet
    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const publicKey = wallet.address;

    // Encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    // Add the new wallet to the user's wallets
    user.wallets.push({ privateKey: encryptedPrivateKey, publicKey });
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    res.status(201).json({ publicKey });
}
