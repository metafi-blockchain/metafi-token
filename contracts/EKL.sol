// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EKL is ERC20Burnable {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mint(uint256 amount) external {
    _mint(_msgSender(), amount);
  }

  function mintTo(address to, uint256 amount) external {
    _mint(to, amount);
  }
}
