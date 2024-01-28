// pages/api/fetchEthBalance.js
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

const alchemyProvider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/RRKskfmVqyH19j4q67gcHQp-A1IhhvBl");

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { walletAddress } = req.body;

            // Fetch the wallet's Ethereum balance
            const balance = await alchemyProvider.getBalance(walletAddress);
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
