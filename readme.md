# Project Setup

This project requires **Python 3.10** and **Node.js**.

## Prerequisites

* [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/getting-started/install) installed
* Python 3.10 installed
* Node.js installed

---

## Step 1: Start the ICP Canister

1. Navigate to the `icp-canister` folder:

   ```bash
   cd icp-canister
   ```

2. Start the local replica with a clean state:

   ```bash
   dfx start --clean
   ```

3. Open a new terminal, then deploy the canister:

   ```bash
   dfx deploy
   ```

4. After deployment, copy the generated **canister ID**. You will use this ID for the Fetch AI agent configuration.

---

## Step 2: Start Fetch AI Agent

1. Navigate to the `fetch-ai-agent/backend/domain` folder and edit the configuration file.

2. Update the following variables:

   * `CANISTER_URI` → set this to the deployed canister URI
   * `CANISTER_ID` → set this to the deployed canister ID
   * `ASI1_API_KEY` → set this with your **ASI One API Key**

3. Go to the backend folder:

   ```bash
   cd fetch-ai-agent/backend
   ```

4. Start the agent:

   ```bash
   python agent.py
   ```

---

## Step 3: Start the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd fetch-ai-agent/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

---
## Important things
* Fetch AI agent address: test-agent://agent1qgpxk8mkgmrmtvathm00la928h7nxh7pflzsn67pp20f7tcg9s4usg3ltu8

## Notes

* Ensure that your ICP canister is running before starting the Fetch AI agent.
* Keep your **ASI\_API\_KEY** secret and do not commit it to version control.
* For troubleshooting, check the logs of each service in their respective terminals.
