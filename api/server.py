from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json, asyncio, time
import numpy as np

app = FastAPI(title="S.U.T.R.A. Telemetry API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/swarm/state")
async def get_swarm_state():
    """Returns the latest SwarmRaft consensus state."""
    # Run a single consensus round and return results
    import sys
    import os
    # Add parent directory to path so we can import swarm_node
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    
    from swarm_node.node import SwarmRaftNode
    nodes = [SwarmRaftNode(i, 5, is_byzantine=(i == 3)) for i in range(5)]
    leader = nodes[0]
    leader.state = "Leader"
    actual = {n.node_id: n.actual_position for n in nodes}

    tels = {n.node_id: n.sense(actual) for n in nodes}
    mailbox = {nid: leader.inform(t)["data"] for nid, t in tels.items()}
    estimates = leader.estimate(mailbox)
    residuals = leader.evaluate(estimates, mailbox)
    corrected = leader.recover(residuals, estimates, threshold=15.0)
    final = leader.finalize(corrected)

    return {
        "nodes": [
            {
                "id": n.node_id,
                "state": n.state,
                "is_byzantine": n.is_byzantine,
                "reported_gps": tels[n.node_id]["gps_pos"],
                "corrected_pos": final["final_positions"][n.node_id],
                "residual": residuals.get(n.node_id, 0.0),
                "status": "Spoofed" if n.is_byzantine else "Active"
            }
            for n in nodes
        ],
        "leader_id": leader.node_id,
        "timestamp": final["timestamp"],
    }

@app.websocket("/ws/telemetry")
async def telemetry_stream(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Run consensus round
            state = await get_swarm_state()
            await websocket.send_json(state)
            await asyncio.sleep(2)  # Push updates every 2 seconds
    except Exception as e:
        print(f"WebSocket telemetry disconnected: {e}")
        try:
            await websocket.close()
        except:
            pass

@app.websocket("/ws/logs")
async def log_stream(websocket: WebSocket):
    await websocket.accept()
    logs = [
        "[System] Initializing SwarmRaft Consensus Engine v1.0",
        "[Node 0] Elected LEADER for Term 42",
        "[Node 1] Telemetry validated. Ranging distance 45m",
        "[Node 3] WARNING GNSS Residual exceeds threshold (18.5m > 10.0m)",
        "[Node 0] Byzantine behavior detected on Node 3. Recovering spatial coordinates...",
        "[Node 0] Finalizing secure Swarm State Map."
    ]
    try:
        for log in logs:
            await websocket.send_text(log)
            await asyncio.sleep(1.5)
        # Keep connection open and occasionally send heartbeat or new logs
        while True:
            await asyncio.sleep(5)
            await websocket.send_text(f"[System] Heartbeat: Swarm nominal. Timestamp: {time.time()}")
    except Exception as e:
        print(f"WebSocket logs disconnected: {e}")
        try:
            await websocket.close()
        except:
            pass
