# S.U.T.R.A.
**Secure Unjammable Tactical Resilient Array**

S.U.T.R.A. is a decentralized, fault-tolerant coordination network and consensus simulator for Unmanned Aerial Vehicles (UAVs) operating in GNSS-denied and heavily contested electronic warfare (EW) environments.

By unifying edge-computing consensus algorithms with Web3 cryptographic identity, S.U.T.R.A. guarantees spatial swarm integrity even when significant portions of the network are jammed, spoofed, or compromised

---

## 🏗 The Architecture of Resilience

The system is built upon three fundamental pillars of decentralized security:

### 1. SwarmRaft Consensus
A customized implementation of the Raft consensus algorithm optimized for spatial recovery. When nodes experience GNSS spoofing, the network utilizes a 6-step workflow (Sense, Inform, Estimate, Evaluate, Recover, Finalize) to dynamically substitute faulty telemetry with peer-range triangulated estimates, strictly enforcing `n ≥ 2f + 1` Byzantine fault tolerance.

### 2. Cryptographic MANET
An asynchronous peer-to-peer Mobile Ad-hoc Network (MANET) operating over UDP sockets. It enforces absolute cryptographic semantic integrity using standard **secp256k1 (ECDSA)** to sign and verify every single coordination packet. Unauthenticated or malformed payloads are immediately dropped to prevent Byzantine injection and replay attacks.

### 3. Proof of Physical Work (PoPW)
An on-chain Sybil-defense mechanism deployed via Solidity smart contracts. Drones must provide authorized cryptographic proofs of physical waypoint arrival to claim "Voting Power" (DVP). This ensures that network authority is inextricably linked to kinetic reality, structurally preventing remote attackers from spawning virtual nodes.

---

## 💻 Tech Stack

- **Dashboard / UI**: Next.js (App Router), React, TypeScript, Vanilla CSS
- **Consensus & Simulation Engine**: Python (NumPy, Cryptography)
- **Networking**: UDP Sockets
- **Web3 / Smart Contracts**: Solidity, Foundry, Anvil (Local Testnet)

---

## 🚀 Quick Start

### 1. Launch the Next.js Dashboard
Navigate to the dashboard directory and start the frontend Command Center interface:
```bash
cd dashboard
npm install
npm run dev
```
Access the dashboard at `http://localhost:3000`.

### 2. Run the Python Swarm Simulation
Ensure you have Python 3.9+ installed to run the backend consensus simulator.
```bash
python -m venv venv
.\venv\Scripts\activate
pip install numpy cryptography
```

### 3. Deploy Local Foundry Contracts
To test the PoPW token economy and cryptographic identity layer:
```bash
cd contracts
forge build
anvil
```

---

## 📁 Repository Structure
- `/dashboard` - Next.js React frontend featuring live swarm monitoring, interactive metrics, and an editorial design aesthetic.
- `/swarm_node` - Core Python SwarmRaft consensus state machine and spatial recovery algorithms.
- `/network_sim` - Cryptographic P2P MANET simulation using UDP and ECDSA signatures.
- `/contracts` - Foundry workspace containing the Proof-of-Physical-Work Solidity smart contracts.

---

## 📄 License
MIT License
