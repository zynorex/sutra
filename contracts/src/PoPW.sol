// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Proof-of-Physical-Work (PoPW) Token for UAV Swarms
 * @notice Mints network voting rights only when a drone cryptographically proves
 *         its physical presence at verified coordinates using authority-signed telemetry.
 */
contract PoPWToken {
    string public constant name = "Drone Voting Power";
    string public constant symbol = "DVP";
    uint8 public constant decimals = 18;

    address public owner;
    
    // Mapping of verified ground-station / oracle public keys authorized to sign physical telemetry
    mapping(address => bool) public authorizedOracles;
    
    // Mapping of active registered drone addresses
    mapping(address => bool) public registeredDrones;
    
    // Tracks drone token balances (voting power)
    mapping(address => uint256) public balanceOf;
    
    // Prevents replay attacks by tracking used signature hashes
    mapping(bytes32 => bool) public usedProofs;

    struct Waypoint {
        bytes32 id;
        int256 latitude;   // Multiplied by 10^7 for precision
        int256 longitude;  // Multiplied by 10^7 for precision
        bool active;
    }

    mapping(bytes32 => Waypoint) public waypoints;

    event DroneRegistered(address indexed drone);
    event WaypointAdded(bytes32 indexed id, int256 lat, int256 lon);
    event TokensMinted(address indexed drone, uint256 amount, bytes32 indexed waypointId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner authorized");
        _;
    }

    modifier onlyRegistered() {
        require(registeredDrones[msg.sender], "Drone not registered in swarm");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedOracles[msg.sender] = true;
    }

    function addOracle(address _oracle) external onlyOwner {
        authorizedOracles[_oracle] = true;
    }

    function registerDrone(address _drone) external onlyOwner {
        registeredDrones[_drone] = true;
        emit DroneRegistered(_drone);
    }

    function addWaypoint(bytes32 _id, int256 _lat, int256 _lon) external onlyOwner {
        waypoints[_id] = Waypoint(_id, _lat, _lon, true);
        emit WaypointAdded(_id, _lat, _lon);
    }

    /**
     * @notice Claims voting tokens by providing a cryptographic proof of presence.
     * @param _waypointId The unique ID of the physically reached waypoint.
     * @param _timestamp Epoch timestamp of physical arrival.
     * @param _sig The signature from an authorized ground station / IoT sensor verifying the coordinates.
     */
    function claimVotingTokens(
        bytes32 _waypointId,
        uint256 _timestamp,
        bytes calldata _sig
    ) external onlyRegistered {
        require(waypoints[_waypointId].active, "Invalid or inactive waypoint");
        require(_timestamp > block.timestamp - 1 hours, "Proof has expired");

        // Construct message hash: includes drone address, waypoint, and timestamp to prevent replay attacks
        bytes32 messageHash = keccak256(
            abi.encodePacked(msg.sender, _waypointId, _timestamp, block.chainid)
        );
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        require(!usedProofs[ethSignedMessageHash], "Proof already redeemed");
        
        // Recover signer and verify against authorized ground systems/oracles
        address signer = recoverSigner(ethSignedMessageHash, _sig);
        require(authorizedOracles[signer], "Invalid telemetry signature authority");

        usedProofs[ethSignedMessageHash] = true;
        
        // Mint exactly 10 voting tokens (DVP) to the drone
        uint256 mintAmount = 10 * 10**uint256(decimals);
        balanceOf[msg.sender] += mintAmount;

        emit TokensMinted(msg.sender, mintAmount, _waypointId);
    }

    function recoverSigner(bytes32 _hash, bytes memory _sig) public pure returns (address) {
        require(_sig.length == 65, "Malformed signature payload");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_sig, 32))
            s := mload(add(_sig, 64))
            v := byte(0, mload(add(_sig, 96)))
        }

        return ecrecover(_hash, v, r, s);
    }
}
