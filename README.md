# SSA-Project 2024-2025

### Fractional Property Ownership System (PropertyStake - Real Estate)

This project involves designing and implementing a fractional property ownership system that enables real estate investors to purchase shares in high-performing rental properties. Investors earn returns through rental income and property appreciation, making real estate investment more accessible and liquid.

### Key Features:
- **Investor & Agent Roles:** Investors purchase shares, while agents manage property listings.
- **Wallet System:** Investors deposit funds, receive rental income, and reinvest earnings.
- **Online Payments:** Transactions are handled via an external payment gateway (e.g., Stripe).
- **Exit Windows:** Investors can sell shares to add liquidity to their investments.
- **Automated Notifications:** Payment receipts and funding updates are sent via email.
- **Scalable Architecture:** Designed to handle high transaction loads.

### Technical Overview:

![diagram](diagram.png)

- **Microservice Architecture:** Utilizes NestJS, Docker, and Kubernetes.
- **Database:** Managed with PostgreSQL.
- **Authentication:** JWT-based authentication with role-based access control.
- **API Gateway:** Centralized entry point for all services, implemented with NestJS and `http-proxy-middleware`.
- **Services:**
    - **User Service:** Manages user accounts and profiles.
    - **Property Service:** Handles property listings and details.
    - **Investment Service:** Manages investments and shares.
    - **Payment Service:** Processes payments and transactions.
    - **Notification Service:** Sends automated notifications.

### Setup Instructions:
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Cyb0nix/ssa-project.git
   cd ssa-project
    ```
2. **start the services:**
   ```sh
   docker-compose up --build
   ```
3. **Access the API Gateway at `http://localhost:3000`.**

### Postman Collection:
- [PostMan Collection](diagram.png)

