// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/umttoken.sol";

contract UMTTest is Test {
    UMTToken token;

    function setUp() public {
        token = new UMTToken(1000); // 1000 tokens minted to this contract (msg.sender)
    }

    function testInitialSupply() public {
        // this contract deployed, so address(this) has tokens
        uint256 bal = token.balanceOf(address(this));
        assertEq(bal, 1000 * (10 ** token.decimals()));
    }

    function testTransfer() public {
        address alice = address(0xA11CE);
        token.transfer(alice, 1 * (10 ** token.decimals()));
        assertEq(token.balanceOf(alice), 1 * (10 ** token.decimals()));
    }
}
