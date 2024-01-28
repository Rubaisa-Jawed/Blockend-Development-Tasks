// pages/api/transfer.js
import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import crypto from 'crypto';
import ERC20 from '../../lib/abi/ERC20' assert { type: 'json' };

const alchemyProvider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/RRKskfmVqyH19j4q67gcHQp-A1IhhvBl");
const TestTokenAddress = "0xc43dC2F57CB0f9A5Ae08D25fa378175F8BcC51b0";
const SECRET_KEY = 'Secretkey'; // Replace with your key from environment variables
const secretKeyBuffer = crypto.createHash('sha256').update(String(SECRET_KEY)).digest('base64').substr(0, 32);

function decryptPrivateKey(encryptedPrivateKey) {
    const textParts = encryptedPrivateKey.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKeyBuffer), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, amount, walletAddress, receivingAddress } = req.body;

             // Path to the JSON database
             const filePath = path.join(process.cwd(), 'database', 'testDatabase.json');
             const fileData = fs.readFileSync(filePath, 'utf8');
             const users = JSON.parse(fileData);
 
             // Find user by email
             const user = users.find(u => u.email === email);
             if (!user) {
                 res.status(404).json({ error: 'User not found' });
                 return;
             }
 
             // Find the wallet by the provided address
             const wallet = user.wallets.find(w => w.publicKey === walletAddress);
             if (!wallet) {
                 res.status(404).json({ error: 'Wallet not found' });
                 return;
             }
 
             // Decrypt the private key
            const privateKey = decryptPrivateKey(wallet.privateKey);
            const signer = new ethers.Wallet(privateKey, alchemyProvider);

            const erc20Contract = new ethers.Contract(TestTokenAddress, ERC20, signer);
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);

            await erc20Contract.transfer(receivingAddress, amountInWei);

            res.status(200).json({ message: 'Transfer successful' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
