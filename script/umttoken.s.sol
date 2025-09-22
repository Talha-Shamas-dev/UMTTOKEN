// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/umttoken.sol";

contract DeployScript is Script {
    uint256 deployerKey =
        0x7c757c5d14990de32f0ad973d97610025af84fb6565353f32b5fa5711931aa68;

    function run() external {
        // load private key from environment variable: PRIVATE_KEY
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // initialSupply in whole tokens (e.g. 1000)
        uint256 initialSupply = 1000;

        UMTToken token = new UMTToken(initialSupply);

        // optional: log address (prints during forge script run)
        console.log("Deployed UMTToken at:", address(token));

        vm.stopBroadcast();
    }
}
