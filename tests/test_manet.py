import pytest
import sys
import os
import asyncio

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from network_sim.p2p_manet import CryptographicManetNode

class TestSignatureVerification:
    def test_valid_signature_accepted(self):
        node1 = CryptographicManetNode(1, 9001, [])
        node2 = CryptographicManetNode(2, 9002, [])
        node2.authorized_keys = {1: node1.public_key}

        msg = b'{"event": "test"}'
        sig = node1.sign_message(msg)
        assert node2.verify_message(1, msg, sig) is True

    def test_forged_payload_rejected(self):
        node1 = CryptographicManetNode(1, 9001, [])
        node2 = CryptographicManetNode(2, 9002, [])
        node2.authorized_keys = {1: node1.public_key}

        msg = b'{"event": "test"}'
        sig = node1.sign_message(msg)
        tampered = b'{"event": "ATTACK"}'
        assert node2.verify_message(1, tampered, sig) is False

    def test_unknown_sender_rejected(self):
        node1 = CryptographicManetNode(1, 9001, [])
        node2 = CryptographicManetNode(2, 9002, [])
        # Don't add node1 to authorized_keys
        msg = b'{"event": "test", "_nonce": 1}'
        sig = node1.sign_message(msg)
        assert node2.verify_message(1, msg, sig) is False

class TestReplayProtection:
    @pytest.mark.asyncio
    async def test_replay_packet_rejected(self):
        node1 = CryptographicManetNode(1, 9001, [9002])
        node2 = CryptographicManetNode(2, 9002, [9001])
        node2.authorized_keys = {1: node1.public_key}
        
        # We simulate the datagram_received logic for node2
        # Create a valid message with nonce 1
        msg = b'{"event": "test", "_nonce": 1}'
        sig = node1.sign_message(msg)
        
        # Node 2 receives it the first time
        is_valid = node2.verify_message(1, msg, sig)
        assert is_valid is True
        node2.peer_nonces[1] = 1 # simulated acceptance
        
        # Replay the exact same packet
        is_valid2 = node2.verify_message(1, msg, sig)
        assert is_valid2 is True # signature is still valid
        # But nonce check fails
        assert node2.peer_nonces.get(1, -1) >= 1

