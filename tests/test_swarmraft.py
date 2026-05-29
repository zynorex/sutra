import pytest
import numpy as np
import sys
import os

# Ensure the module can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from swarm_node.node import SwarmRaftNode

class TestSensePhase:
    def test_honest_node_reports_near_actual_position(self):
        node = SwarmRaftNode(0, 5, is_byzantine=False)
        tel = node.sense({0: node.actual_position, 1: np.array([10.0, 0.0])})
        reported = np.array(tel["gps_pos"])
        assert np.linalg.norm(reported - node.actual_position) < 1.0

    def test_byzantine_node_reports_spoofed_position(self):
        node = SwarmRaftNode(0, 5, is_byzantine=True)
        tel = node.sense({0: node.actual_position})
        reported = np.array(tel["gps_pos"])
        assert np.linalg.norm(reported - node.actual_position) > 100.0

class TestRecoverPhase:
    def test_byzantine_node_is_flagged(self):
        leader = SwarmRaftNode(0, 5)
        residuals = {0: 0.5, 1: 0.8, 2: 200.0}
        estimates = {0: np.array([0.0, 0.0]), 1: np.array([10.0, 0.0]), 2: np.array([20.0, 0.0])}
        recovered = leader.recover(residuals, estimates, threshold=10.0)
        # Node 2 should be recovered (residual 200 > threshold 10)
        assert np.array_equal(recovered[2], estimates[2])

class TestBFTInvariant:
    @pytest.mark.parametrize("n,f", [(5,1), (7,2), (9,3), (3,1)])
    def test_safety_with_valid_quorum(self, n, f):
        assert n >= 2 * f + 1, f"BFT violated: {n} < {2*f+1}"
        nodes = [SwarmRaftNode(i, n, is_byzantine=(i < f)) for i in range(n)]
        # Should complete without error
        leader = nodes[f]  # First honest node
        leader.state = "Leader"
        actual = {nd.node_id: nd.actual_position for nd in nodes}
        tels = {nd.node_id: nd.sense(actual) for nd in nodes}
        mailbox = {nid: leader.inform(t)["data"] for nid, t in tels.items()}
        est = leader.estimate(mailbox)
        res = leader.evaluate(est, mailbox)
        corrected = leader.recover(res, est)
        final = leader.finalize(corrected)
        assert len(final["final_positions"]) == n
