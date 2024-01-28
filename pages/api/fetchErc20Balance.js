import fs from 'fs';
import path from 'path';
import { ethers } from 'ethers';
import ERC20 from '../../lib/abi/ERC20' assert { type: 'json' };

const alchemyProvider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/RRKskfmVqyH19j4q67gcHQp-A1IhhvBl");
const TestTokenAddress = "0xc43dC2F57CB0f9A5Ae08D25fa378175F8BcC51b0";

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, walletAddress } = req.body;

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

            // ERC20 Balance logic
            const erc20Contract = new ethers.Contract(TestTokenAddress, ERC20, alchemyProvider);
            
            const balance = await erc20Contract.balanceOf(wallet.publicKey);
            const balanceInEther = ethers.utils.formatEther(balance);

            res.status(200).json({ balance: balanceInEther });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

