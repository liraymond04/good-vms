// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol';

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import { HubRestrictedUpgradeable } from './lib/HubRestrictedUpgradeable.sol';

import { IPublicationActionModule } from 'lens-modules/contracts/interfaces/IPublicationActionModule.sol';
import { Types } from 'lens-modules/contracts/libraries/constants/Types.sol';
import { LensModule } from 'lens-modules/contracts/modules/LensModule.sol';

interface ILensHub {
  function ownerOf(uint256 tokenId) external view returns (address owner);
}

/// @custom:security-contact security@bcharity.net
contract SendTokenActionModule is
  Initializable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  IPublicationActionModule,
  HubRestrictedUpgradeable,
  LensModule
{
  using SafeERC20 for IERC20;

  ILensHub public lensHub;
  IERC20 public GOOD;
  IERC20 public VHR;

  string private moduleMetadataURI;

  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant ORGANIZATION_ROLE = keccak256("ORGANIZATION_ROLE");

  enum RequestStatus { Received, UnderReview, Approved, Rejected }
  struct Request {
    RequestStatus requestStatus;
    bool postedByOrganization;
    address recipientAddress;
    uint256 GOODAmount;
    uint256 VHRAmount;
  }
  mapping(uint256 => mapping(uint256 => Request)) public request;

  event RequestCreated(
    uint256 indexed profileId,
    uint256 indexed publicationId,
    address indexed profileOwner,
    address organizationAddress,
    address recipientAddress,
    uint256 GOODAmount,
    uint256 VHRAmount
  );

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
  error UnverifiedOrganization(address organization);

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
    HubRestrictedUpgradeable.initialize(lensHubAddress);

    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(PAUSER_ROLE, pauser);

    lensHub = ILensHub(lensHubAddress);
    // set GOOD and VHR addresses
    GOOD = IERC20(GOODAddress);
    VHR = IERC20(VHRAddress);

  }

  function supportsInterface(
    bytes4 interfaceID
  ) public pure override(LensModule, AccessControlUpgradeable) returns (bool) {
    return
      interfaceID == type(IPublicationActionModule).interfaceId ||
      super.supportsInterface(interfaceID);
  }

  function pause() external onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function setModuleMetadataURI(
    string memory _metadataURI
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    moduleMetadataURI = _metadataURI;
  }

  // Set the status of a request
  function setRequestStatus(
    uint256 profileId,
    uint256 publicationId,
    RequestStatus statusToSet
  ) external onlyRole(ORGANIZATION_ROLE) {
    request[profileId][publicationId].requestStatus = statusToSet;

    emit StatusChanged(
        profileId, 
        publicationId, 
        request[profileId][publicationId].requestStatus
      );
  }

  function setGOOD(address _good) external onlyRole(DEFAULT_ADMIN_ROLE) {
    GOOD = IERC20(_good);
  }

  function setVHR(address _vhr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    VHR = IERC20(_vhr);
  }

  function getModuleMetadataURI() external view returns (string memory) {
    return moduleMetadataURI;
  }

  function isOrganization (address account) public view returns (bool) {
    return hasRole(ORGANIZATION_ROLE, account);
  }

  function addOrganization(address account) external {
    grantRole(ORGANIZATION_ROLE, account);
  }

  function removeOrganization(address account) external {
    revokeRole(ORGANIZATION_ROLE, account);
  }

  function initializePublicationAction(
    uint256 profileId,
    uint256 pubId,
    address transactionExecutor,
    bytes calldata data
  ) external override whenNotPaused onlyHub returns (bytes memory){
    (
      address organizationAddress, 
      bool postedByOrganization, 
      address recipientAddress, 
      uint256 GOODAmount, 
      uint256 VHRAmount
    ) = abi.decode(data, (address, bool, address, uint256, uint256));
    
    if (postedByOrganization && !isOrganization(organizationAddress)) {
      revert UnverifiedOrganization(organizationAddress);
    }

    request[profileId][pubId] = Request(RequestStatus.Received, postedByOrganization, recipientAddress, GOODAmount, VHRAmount);

    emit RequestCreated(profileId, pubId, transactionExecutor, organizationAddress, recipientAddress, GOODAmount, VHRAmount);

    return abi.encode(profileId, pubId, transactionExecutor, organizationAddress, recipientAddress, GOODAmount, VHRAmount);
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata params
  ) external override whenNotPaused onlyHub returns (bytes memory) {
    Request memory req = request[params.publicationActedProfileId][params.publicationActedId];
    address sender = params.transactionExecutor;
    address recipient = address(0);

    if (req.postedByOrganization) {
      recipient = req.recipientAddress;
    } else {
      recipient = lensHub.ownerOf(params.publicationActedProfileId);
    }
    
    if (!isOrganization(sender)) {
      revert UnverifiedOrganization(sender);
    }

    this.setRequestStatus(params.publicationActedProfileId, params.publicationActedId, RequestStatus.Approved);

    _sendGood(recipient, req.GOODAmount, params.actorProfileId, params.publicationActedProfileId, params.publicationActedId, sender);  
    _sendVHR(recipient, req.VHRAmount, params.actorProfileId, params.publicationActedProfileId, params.publicationActedId, sender); 

    return abi.encode(
      params.actorProfileId, 
      params.publicationActedProfileId, 
      params.publicationActedId, 
      sender, 
      recipient, 
      req.GOODAmount, 
      req.VHRAmount
    );

  }

  function _sendVHR(
    address recipient,
    uint256 VHRAmount,
    uint256 organizationProfileId,
    uint256 toProfileId,
    uint256 publicationId,
    address sender
  ) internal {
    // Status check
    require(request[toProfileId][publicationId].requestStatus == RequestStatus.Approved);

    if (lensHub.ownerOf(organizationProfileId) != sender) {
      revert InvalidLensProfile(organizationProfileId);
    }

    if (lensHub.ownerOf(toProfileId) != recipient) {
      revert InvalidLensProfile(toProfileId);
    }
    
    // Send if amount values are >0
    if (VHRAmount > 0) {
      VHR.safeTransferFrom(sender, recipient, VHRAmount);
    }

    emit VHRTokenSent(
      organizationProfileId,
      toProfileId,
      publicationId,
      sender,
      recipient,
      VHRAmount
    );
  }

  function _sendGood(
    address recipient,
    uint256 GOODAmount,
    uint256 organizationProfileId,
    uint256 toProfileId,
    uint256 publicationId,
    address sender
  ) internal {
    // Status check
    require(request[toProfileId][publicationId].requestStatus == RequestStatus.Approved);

    if (lensHub.ownerOf(organizationProfileId) != sender) {
      revert InvalidLensProfile(organizationProfileId);
    }
    
    if (lensHub.ownerOf(toProfileId) != recipient) {
      revert InvalidLensProfile(toProfileId);
    }
    
    // Send if amount values are >0
    if (GOODAmount > 0) {
      GOOD.safeTransferFrom(sender, recipient, GOODAmount);
    }

    emit GoodTokenSent(
      organizationProfileId,
      toProfileId,
      publicationId,
      sender,
      recipient,
      GOODAmount
    );
  }

  function sendVHR(address recipient, uint256 VHRAmount, uint256 organizationProfileId, uint256 toProfileId, uint256 publicationId, address sender) external whenNotPaused onlyRole(ORGANIZATION_ROLE) {
    _sendVHR(recipient, VHRAmount, organizationProfileId, toProfileId, publicationId, sender);
  }

  function sendGood(address recipient, uint256 GOODAmount, uint256 organizationProfileId, uint256 toProfileId, uint256 publicationId, address sender) external whenNotPaused onlyRole(ORGANIZATION_ROLE) {
    _sendGood(recipient, GOODAmount, organizationProfileId, toProfileId, publicationId, sender);
  }
}
