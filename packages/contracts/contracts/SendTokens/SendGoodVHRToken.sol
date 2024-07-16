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

contract SendGoodVHRToken is
  Initializable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  ReentrancyGuardUpgradeable
{
  using SafeERC20 for IERC20;

  ILensHub public lensHub;
  IERC20 public GOOD;
  IERC20 public VHR;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");

  // store statuses
  enum RequestStatus { Received, UnderReview, Approved, Rejected }
  // store a mapping of profile id to publication id to bool
  mapping(uint256 => mapping(uint256 => RequestStatus)) public requestStatus;

  event GoodTokenSent(
    uint256 indexed organizationProfileId,
    uint256 indexed toProfileId,
    uint256 indexed publicationId,
    address from,
    address to,
    uint256 GOODAmount
  );

  event VHRTokenSent(
    uint256 indexed organizationProfileId,
    uint256 indexed toProfileId,
    uint256 indexed publicationId,
    address from,
    address to,
    uint256 VHRAmount
  );

  event StatusChanged(
    uint256 indexed profileId,
    uint256 indexed publicationId,
    RequestStatus requestStatus
  );

  error InvalidLensProfile(uint256 profileId);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address defaultAdmin,
    address pauser,
    address lensHubAddress,
    address GOODAddress,
    address VHRAddress
  ) public initializer {
    __Pausable_init();
    __AccessControl_init();
    __ReentrancyGuard_init();

    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(PAUSER_ROLE, pauser);

    lensHub = ILensHub(lensHubAddress);
    // set GOOD and VHR addresses
    GOOD = IERC20(GOODAddress);
    VHR = IERC20(VHRAddress);

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

  function setGOOD(address _good) external onlyRole(DEFAULT_ADMIN_ROLE) {
    GOOD = IERC20(_good);
  }

  function setVHR(address _vhr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    VHR = IERC20(_vhr);
  }

  // Set the status of a request
  function setRequestStatus(
    uint256 profileId,
    uint256 publicationId,
    RequestStatus statusToSet
  ) external onlyRole(ORGANIZATION_ROLE) {
    requestStatus[profileId][publicationId] = statusToSet;

    emit StatusChanged(
        profileId, 
        publicationId, 
        requestStatus[profileId][publicationId]
      );
  }

  function sendGoodTokens(
    address recipient,
    uint256 GOODAmount,
    uint256 organizationProfileId,
    uint256 toProfileId,
    uint256 publicationId
  ) external whenNotPaused nonReentrant onlyRole(ORGANIZATION_ROLE){
    // Status check
    require(requestStatus[toProfileId][publicationId] == RequestStatus.Approved);

    if (lensHub.ownerOf(organizationProfileId) != msg.sender) {
      revert InvalidLensProfile(organizationProfileId);
    }
    
    if (lensHub.ownerOf(toProfileId) != recipient) {
      revert InvalidLensProfile(toProfileId);
    }
    
    // Send if amount values are >0
    if (GOODAmount > 0) {
      GOOD.safeTransferFrom(msg.sender, recipient, GOODAmount);
    }

    emit GoodTokenSent(
      organizationProfileId,
      toProfileId,
      publicationId,
      msg.sender,
      recipient,
      GOODAmount
    );
  }

  function sendVHRToken(
    address recipient,
    uint256 VHRAmount,
    uint256 organizationProfileId,
    uint256 toProfileId,
    uint256 publicationId
  ) external whenNotPaused nonReentrant onlyRole(ORGANIZATION_ROLE){
    // Status check
    require(requestStatus[toProfileId][publicationId] == RequestStatus.Approved);

    if (lensHub.ownerOf(organizationProfileId) != msg.sender) {
      revert InvalidLensProfile(organizationProfileId);
    }

    if (lensHub.ownerOf(toProfileId) != recipient) {
      revert InvalidLensProfile(toProfileId);
    }
    
    // Send if amount values are >0
    if (VHRAmount > 0) {
      VHR.safeTransferFrom(msg.sender, recipient, VHRAmount);
    }

    emit VHRTokenSent(
      organizationProfileId,
      toProfileId,
      publicationId,
      msg.sender,
      recipient,
      VHRAmount
    );
  }
}
