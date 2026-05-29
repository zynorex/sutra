// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PoPW.sol";

contract PoPWTokenTest is Test {
    PoPWToken token;
    address owner = address(this);
    address drone = address(0x1);
    address oracle;
    uint256 oracleKey;

    function setUp() public {
        token = new PoPWToken();
        (oracle, oracleKey) = makeAddrAndKey("oracle");
        token.addOracle(oracle);
        token.registerDrone(drone);
        token.addWaypoint(bytes32("WP1"), 261100000, 853900000);
    }

    function test_RegisteredDroneCanClaim() public {
        // Construct and sign the proof
        uint256 ts = block.timestamp;
        bytes32 msgHash = keccak256(abi.encodePacked(drone, bytes32("WP1"), ts, block.chainid));
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oracleKey, ethHash);
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.prank(drone);
        token.claimVotingTokens(bytes32("WP1"), ts, sig);

        assertEq(token.balanceOf(drone), 10 * 1e18);
    }

    function test_ReplayAttackReverts() public {
        uint256 ts = block.timestamp;
        bytes32 msgHash = keccak256(abi.encodePacked(drone, bytes32("WP1"), ts, block.chainid));
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oracleKey, ethHash);
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.prank(drone);
        token.claimVotingTokens(bytes32("WP1"), ts, sig);

        vm.expectRevert("Proof already redeemed");
        vm.prank(drone);
        token.claimVotingTokens(bytes32("WP1"), ts, sig);
    }

    function test_ExpiredTimestampReverts() public {
        uint256 ts = block.timestamp - 2 hours;
        bytes32 msgHash = keccak256(abi.encodePacked(drone, bytes32("WP1"), ts, block.chainid));
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oracleKey, ethHash);
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.expectRevert("Proof has expired");
        vm.prank(drone);
        token.claimVotingTokens(bytes32("WP1"), ts, sig);
    }

    function test_UnregisteredDroneReverts() public {
        address unregistered = address(0x2);
        uint256 ts = block.timestamp;
        bytes32 msgHash = keccak256(abi.encodePacked(unregistered, bytes32("WP1"), ts, block.chainid));
        bytes32 ethHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", msgHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(oracleKey, ethHash);
        bytes memory sig = abi.encodePacked(r, s, v);

        vm.expectRevert("Drone not registered in swarm");
        vm.prank(unregistered);
        token.claimVotingTokens(bytes32("WP1"), ts, sig);
    }
}
