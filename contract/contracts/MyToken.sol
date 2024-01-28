// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor() ERC20("TestToken", "TTK") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
