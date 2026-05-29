import asyncio
import json
import socket
import random
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes
from cryptography.exceptions import InvalidSignature

class CryptographicManetNode:
    """
    Simulates a secure tactical MANET node communicating over UDP sockets,
    verifying peer identities and consensus state signatures under lossy conditions.
    """
    def __init__(self, node_id: int, port: int, peer_ports: list):
        self.node_id = node_id
        self.port = port
        self.peer_ports = peer_ports
        
        # ECDSA Cryptographic Key Generation (secp256k1 curve)
        self.private_key = ec.generate_private_key(ec.SECP256K1())
        self.public_key = self.private_key.public_key()
        
        # Keystore containing public keys of authorized swarm nodes
        self.authorized_keys = {}
        
        # Nonce tracking for replay protection
        self.nonce = 0
        self.peer_nonces = {}
        
        # Simulates dynamic communication omission rates (e.g., 20% packet drop due to jamming)
        self.omission_rate = 0.20 

    def sign_message(self, message_bytes: bytes) -> bytes:
        """Signs payload with the node's private key."""
        signature = self.private_key.sign(
            message_bytes,
            ec.ECDSA(hashes.SHA256())
        )
        return signature

    def verify_message(self, sender_id: int, message_bytes: bytes, signature: bytes) -> bool:
        """Verifies digital signature against the sender's public key to prevent spoofing."""
        if sender_id not in self.authorized_keys:
            # Drop messages from unverified/unregistered nodes
            return False
        
        peer_pub_key = self.authorized_keys[sender_id]
        try:
            peer_pub_key.verify(
                signature,
                message_bytes,
                ec.ECDSA(hashes.SHA256())
            )
            return True
        except InvalidSignature:
            print(f" Invalid signature received from Node {sender_id}!")
            return False

    async def broadcast_state(self, state_data: dict):
        """Asynchronously broadcasts signed telemetry over the lossy MANET."""
        self.nonce += 1
        payload_dict = state_data.copy()
        payload_dict["_nonce"] = self.nonce
        
        payload_string = json.dumps(payload_dict)
        payload_bytes = payload_string.encode('utf-8')
        signature = self.sign_message(payload_bytes)

        # Combined packet structural schema
        packet = {
            "sender_id": self.node_id,
            "payload": payload_string,
            "signature": signature.hex()
        }
        
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        for target_port in self.peer_ports:
            # Simulate real-world packet drop (omission faults)
            if random.random() < self.omission_rate:
                # Packet dropped due to electronic interference
                continue
            
            try:
                sock.sendto(json.dumps(packet).encode('utf-8'), ('127.0.0.1', target_port))
            except Exception as e:
                pass
        sock.close()

    async def start_udp_listener(self):
        """Asynchronous network loop processing inbound UDP packet streams."""
        loop = asyncio.get_running_loop()
        
        class UDPProtocol(asyncio.DatagramProtocol):
            def __init__(self, outer_node):
                self.outer_node = outer_node

            def datagram_received(self, data, addr):
                try:
                    packet = json.loads(data.decode('utf-8'))
                    sender_id = packet["sender_id"]
                    payload = packet["payload"]
                    signature = bytes.fromhex(packet["signature"])

                    # Enforce cryptographic validation
                    is_valid = self.outer_node.verify_message(
                        sender_id, 
                        payload.encode('utf-8'), 
                        signature
                    )

                    if is_valid:
                        parsed_payload = json.loads(payload)
                        nonce = parsed_payload.get("_nonce", -1)
                        last_nonce = self.outer_node.peer_nonces.get(sender_id, -1)
                        
                        if nonce > last_nonce:
                            self.outer_node.peer_nonces[sender_id] = nonce
                            print(f" Node {self.outer_node.node_id} accepted signed message from Node {sender_id}: {parsed_payload['event']}")
                        else:
                            print(f" Node {self.outer_node.node_id} BLOCKED REPLAY packet from Node {sender_id} (nonce {nonce} <= {last_nonce}).")
                    else:
                        print(f" Node {self.outer_node.node_id} blocked unauthenticated packet from Node {sender_id}.")
                except Exception as e:
                    print(f"Error parsing inbound packet: {e}")

        transport, protocol = await loop.create_datagram_endpoint(
            lambda: UDPProtocol(self),
            local_addr=('127.0.0.1', self.port)
        )
        print(f"MANET Node {self.node_id} listening on UDP port {self.port}...")

# Simulation Orchestrator
async def main():
    print("--- Starting Cryptographic P2P MANET Simulation ---")
    
    # 3 tactical node swarm
    node_ports = {1: 8001, 2: 8002, 3: 8003}
    
    # Fixed port assignments so Node X binds to node_ports[X]
    n1 = CryptographicManetNode(1, node_ports[1], [node_ports[2], node_ports[3]])
    n2 = CryptographicManetNode(2, node_ports[2], [node_ports[1], node_ports[3]])
    n3 = CryptographicManetNode(3, node_ports[3], [node_ports[1], node_ports[2]])

    # Populate Keystores (Trust initialization)
    n1.authorized_keys = {2: n2.public_key, 3: n3.public_key}
    n2.authorized_keys = {1: n1.public_key, 3: n3.public_key}
    n3.authorized_keys = {1: n1.public_key, 2: n2.public_key}

    # Start network ports
    await asyncio.gather(
        n1.start_udp_listener(),
        n2.start_udp_listener(),
        n3.start_udp_listener()
    )

    # Test Broadcaster Loop: Simulating telemetry propagation
    await asyncio.sleep(1)
    print("\n--- Broadcasting Signed Telemetry Updates ---")
    
    await n1.broadcast_state({"event": "WayPoint_Alpha_Reached", "lat": 26.11, "lon": 85.39})
    await n2.broadcast_state({"event": "Scanning_Sector_B"})
    
    # Wait for async packet delivery
    await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
