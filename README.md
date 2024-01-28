# Custodial Wallet Application

This project implements a custodial wallet application with a focus on Ethereum and ERC20 token management. It consists of a backend for managing user authentication, wallet operations, and ERC20 token transactions, along with a minimal frontend interface for user interactions.

## Part 1: Custodial Wallet Backend

### 1.1 User Authentication (Sign Up / Sign In)
- **API Endpoints for Authentication**: Implemented secure API endpoints for user sign up and sign in.
- **Password Security**: Passwords are hashed using bcrypt for secure storage.

### 1.2 Ethereum Wallet Generation
- **Wallet Creation**: Upon user registration, a new Ethereum wallet is generated and associated with the user's email.
- **Secure Storage**: The wallet's private and public keys are securely stored.

### 1.3 Multiple Wallets per User
- **Multiple Wallet Support**: Users can add multiple Ethereum wallets to their accounts.

## Part 2: ERC20 Token Creation

### 2.1 ERC20 Token Smart Contract
- **Smart Contract Development**: Developed an ERC20 token smart contract on the Ethereum blockchain.

### 2.2 Token Minting
- **Minting API Endpoint**: Created an API endpoint for minting new ERC20 tokens.

### 2.3 Token Transfer
- **Token Transfer Functionality**: Implemented functionality to transfer ERC20 tokens between Ethereum wallets.

## Part 3: Minimal Frontend

### 3.1 Sign In / Sign Up Page
- **Authentication Pages**: Developed simple sign-in and sign-up pages.
- **Frontend-Backend Integration**: Connected the frontend to the backend authentication API.

### 3.2 Display Ether and Token Balances
- **Balance Display**: Users can view their Ethereum and ERC20 token balances.
- **Dynamic Balance Fetching**: Balances are fetched and updated from the backend.

### 3.3 Transfer Interface
- **Transfer Functionality**: Users can transfer ERC20 tokens to another account using the interface
- **Validation and Processing**: Transfer requests are validated and processed through backend APIs.

## Testing

- **Test Account**: To test the application, you can create a new account or use the following test credentials:
  - Email: `test@gmail.com`
  - Password: `123`

---

For more details on each part of the project, please refer to the specific documentation sections or comments within the codebase.
