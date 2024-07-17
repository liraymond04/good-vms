// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

interface ILensHub {
  function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract SendTokens is
  Initializable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  ReentrancyGuardUpgradeable
{
  using SafeERC20 for IERC20;

  ILensHub public lensHub;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");


  event TokensSent(
    uint256 indexed fromProfileId,
    uint256 indexed toProfileId,
    uint256 indexed publicationId,
    address token,
    address from,
    address to,
    uint256 amount
  );

  error InvalidLensProfile(uint256 profileId);
  error InsufficientAllowance();

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address defaultAdmin,
    address pauser,
    address lensHubAddress
  ) public initializer {
    __Pausable_init();
    __AccessControl_init();
    __ReentrancyGuard_init();

    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(PAUSER_ROLE, pauser);

    lensHub = ILensHub(lensHubAddress);
  }

  function pause() external onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function setLensHub(
    address lensHubAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    lensHub = ILensHub(lensHubAddress);
  }

  function checkAllowance(
    address tokenAddress,
    address owner
  ) public view returns (uint256) {
    IERC20 token = IERC20(tokenAddress);
    return token.allowance(owner, address(this));
  }

  function sendTokens(
    address tokenAddress,
    address recipient,
    uint256 amount,
    uint256 fromProfileId,
    uint256 toProfileId,
    uint256 publicationId
  ) external whenNotPaused nonReentrant {
    if (checkAllowance(tokenAddress, msg.sender) < amount) {
      revert InsufficientAllowance();
    }

    if (lensHub.ownerOf(fromProfileId) != msg.sender) {
      revert InvalidLensProfile(fromProfileId);
    }

    if (lensHub.ownerOf(toProfileId) != recipient) {
      revert InvalidLensProfile(toProfileId);
    }
    IERC20 token = IERC20(tokenAddress);

    // Send tokens
    token.safeTransferFrom(msg.sender, recipient, amount);

    emit TokensSent(
      fromProfileId,
      toProfileId,
      publicationId,
      tokenAddress,
      msg.sender,
      recipient,
      amount
    );
  }
}
