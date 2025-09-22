// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title UMTToken - Simple ERC20 token (fixed supply minted to deployer)
contract UMTToken is ERC20 {
    /// @param initialSupply number of whole tokens (not including decimals).
    /// e.g. pass 1000 to mint 1000 * 10^decimals() units.
    constructor(uint256 initialSupply) ERC20("UMT Token", "UMT") {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
}
