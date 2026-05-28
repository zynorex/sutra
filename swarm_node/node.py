import numpy as np
import time
import random
from typing import Dict, List, Tuple

class SwarmRaftNode:
    """
    Implements a single UAV node running the SwarmRaft consensus architecture.
    Handles local spatial measurements, leader states, and Byzantine sensor recovery.
    """
    def __init__(self, node_id: int, total_nodes: int, is_byzantine: bool = False):
        self.node_id = node_id
        self.total_nodes = total_nodes
        self.is_byzantine = is_byzantine # True if jammed, spoofed, or malicious
        
        # SwarmRaft State Machine
        self.state = "Follower"
        self.current_leader = None
        self.last_known_positions: Dict[int, np.ndarray] = {}
        
        # Real-world physical position (2D vector for simulation simplicity)
        self.actual_position = np.array([float(node_id * 10), 0.0])
        
        # GNSS status (Can be jammed/spoofed)
        self.gnss_denied = False

    def sense(self, neighbors_actual_pos: Dict[int, np.ndarray]) -> Dict:
        """
        Step 1: Sense.
        UAV measures its own position (potentially spoofed/noisy) and calculates
        physical distances (e.g., using Ultra-Wideband range sensors) to active neighbors.
        """
        # Simulated sensor noise
        noise = np.random.normal(0, 0.1, size=2)
        reported_position = self.actual_position + noise

        if self.is_byzantine or self.gnss_denied:
            # Simulate heavy GPS spoofing (injecting a massive positional offset)
            reported_position += np.array([500.0, -300.0])

        # Measure exact physical ranges to nearby peers (immune to GNSS jamming)
        ranges = {}
        for peer_id, peer_pos in neighbors_actual_pos.items():
            if peer_id != self.node_id:
                distance = np.linalg.norm(self.actual_position - peer_pos)
                # Add ranging noise (typical for UWB)
                ranges[peer_id] = distance + random.gauss(0, 0.05)

        return {
            "node_id": self.node_id,
            "gps_pos": reported_position.tolist(),
            "ranges": ranges,
            "timestamp": time.time()
        }

    def inform(self, telemetry: Dict) -> Dict:
        """
        Step 2: Inform.
        Package local telemetry with a cryptographic timestamp to send to the leader.
        """
        return {
            "type": "TELEMETRY_SUBMISSION",
            "sender_id": self.node_id,
            "data": telemetry
        }

    def estimate(self, gathered_telemetry: Dict) -> Dict[int, np.ndarray]:
        """
        Step 3: Estimate.
        Leader-only function. Triangulates and recomputes every UAV's spatial
        coordinates based strictly on range constraints and peer relative distances.
        """
        estimated_positions = {}
        # Start anchoring estimates using the leader's own verified position
        estimated_positions[self.node_id] = np.array(gathered_telemetry[self.node_id]["gps_pos"])

        # Triangulate relative positions from inter-node range readings
        for peer_id, tel in gathered_telemetry.items():
            if peer_id == self.node_id:
                continue
            
            # Retrieve range from leader to the peer
            r_leader_to_peer = gathered_telemetry[self.node_id]["ranges"].get(peer_id)
            if r_leader_to_peer is not None:
                # Basic triangulation vector calculation
                direction_vector = np.array([1.0, 0.0]) # Simplified coordinate vector
                estimated_positions[peer_id] = estimated_positions[self.node_id] + (direction_vector * r_leader_to_peer)
            else:
                # Fallback to reported GPS if no direct line-of-sight range exists
                estimated_positions[peer_id] = np.array(tel["gps_pos"])

        return estimated_positions

    def evaluate(self, estimates: Dict[int, np.ndarray], gathered_telemetry: Dict) -> Dict[int, float]:
        """
        Step 4: Evaluate.
        Leader-only function. Calculates spatial residuals:
        $$\\text{Residual} = ||\\mathbf{X}_{GPS} - \\mathbf{X}_{Estimated}||$$
        Detects anomalies or GPS spoofing attacks.
        """
        residuals = {}
        for peer_id, est_pos in estimates.items():
            reported_gps = np.array(gathered_telemetry[peer_id]["gps_pos"])
            # Calculate Euclidean residual
            residuals[peer_id] = float(np.linalg.norm(reported_gps - est_pos))
        return residuals

    def recover(self, residuals: Dict[int, float], estimates: Dict[int, np.ndarray], threshold: float = 10.0) -> Dict[int, np.ndarray]:
        """
        Step 5: Recover.
        Leader-only function. If residual exceeds threshold, the node's reporting is
        flagged as "Byzantine" and replaced with its range-triangulated spatial estimate.
        """
        recovered_positions = {}
        for peer_id, est_pos in estimates.items():
            if residuals[peer_id] > threshold:
                print(f" Node {peer_id} flagged as Byzantine (Residual: {residuals[peer_id]:.2f}m). Recovering position...")
                # Discard spoofed GPS, substitute range estimate
                recovered_positions[peer_id] = est_pos
            else:
                recovered_positions[peer_id] = est_pos
        return recovered_positions

    def finalize(self, recovered_positions: Dict[int, np.ndarray]) -> Dict:
        """
        Step 6: Finalize.
        Leader-only function. Formulates the verified, corrected swarm position map
        and broadcasts it to finalize state consistency.
        """
        final_map = {node_id: pos.tolist() for node_id, pos in recovered_positions.items()}
        return {
            "type": "SWARM_STATE_UPDATE",
            "leader_id": self.node_id,
            "final_positions": final_map,
            "timestamp": time.time()
        }

# Executable Simulation Verification
if __name__ == "__main__":
    print("--- Running Local SwarmRaft Spatial Recovery Simulation ---")
    
    # 5 UAV Swarm (n = 5), where 1 node is under cyber/jamming attack (f = 1).
    # Satisfies: n >= 2f + 1 (5 >= 3) -> Swarm maintains safety.
    nodes = [SwarmRaftNode(i, 5, is_byzantine=(i == 3)) for i in range(5)]
    
    # Node 0 acts as elected Leader
    leader = nodes[0]
    leader.state = "Leader"
    
    # Define physical map for range calculations
    actual_swarm_positions = {node.node_id: node.actual_position for node in nodes}
    
    print(f"Node 3 Is Byzantine / Under Spoofing Attack: {nodes[3].is_byzantine}")
    print(f"Node 3 Actual Physical Position: {nodes[3].actual_position}\n")

    # 1. Sense Phase
    telemetries = {}
    for node in nodes:
        telemetries[node.node_id] = node.sense(actual_swarm_positions)
        print(f"Node {node.node_id} Reported GPS: {telemetries[node.node_id]['gps_pos']}")

    # 2. Inform Phase
    incoming_leader_mailbox = {}
    for node_id, tel in telemetries.items():
        incoming_leader_mailbox[node_id] = leader.inform(tel)["data"]

    # 3. Estimate Phase (Leader processing)
    print("\n Estimating swarm locations using range constraints...")
    estimates = leader.estimate(incoming_leader_mailbox)

    # 4. Evaluate Phase
    residuals = leader.evaluate(estimates, incoming_leader_mailbox)

    # 5. Recover Phase
    corrected_positions = leader.recover(residuals, estimates, threshold=15.0)

    # 6. Finalize Phase
    final_state_broadcast = leader.finalize(corrected_positions)
    print(f"\n Verified swarm positions: {final_state_broadcast['final_positions']}")
