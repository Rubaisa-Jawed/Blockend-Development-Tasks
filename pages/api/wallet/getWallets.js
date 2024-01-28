import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { email } = req.query; // Get email from query parameters

    const filePath = path.join(process.cwd(), 'database', 'testDatabase.json');
    const fileData = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(fileData);

    const user = users.find(user => user.email === email);
    if (user) {
        res.status(200).json({ wallets: user.wallets.map(wallet => wallet.publicKey) });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
}
