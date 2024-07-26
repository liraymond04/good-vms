// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import { HubRestrictedUpgradeable } from '../lib/HubRestrictedUpgradeable.sol';
import { IOrganizationStore } from '../GoodOrganizationStore/IOrganizationStore.sol';

import { IPublicationActionModule } from 'lens-modules/contracts/interfaces/IPublicationActionModule.sol';
import { Types } from 'lens-modules/contracts/libraries/constants/Types.sol';
import { ILensHub } from 'lens-modules/contracts/interfaces/ILensHub.sol';
import { LensModule } from 'lens-modules/contracts/modules/LensModule.sol';

/// @custom:security-contact security@bcharity.net
contract GoodDonationActionModule is
  Initializable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  IPublicationActionModule,
  HubRestrictedUpgradeable,
  LensModule
{
  using SafeERC20 for IERC20;

  ILensHub public lensHub;

  string private moduleMetadataURI;

  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');

  // Deprecated after creation of separate organization storage contract.
  bytes32 private constant __DEPRECATED__VERIFIED_DONEE_ROLE =
    keccak256('VERIFIED_DONEE_ROLE');

  IOrganizationStore public organizationStore;

  event CauseCreated(
    uint256 indexed profileId,
    uint256 indexed publicationId,
    address indexed profileOwner
  );

  event DonationSent(
    uint256 indexed fromProfileId,
    uint256 indexed toProfileId,
    uint256 indexed publicationId,
    address token,
    address from,
    address to,
    uint256 amount
  );

  error InvalidTokenAddress();
  error DonationAmountCannotBeZero();
  error UnverifiedDonee(address donee);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(
    address defaultAdmin,
    address pauser,
    address lensHubAddress,
    address organizationStoreAddress
  ) public initializer {
    __Pausable_init();
    __AccessControl_init();
    __HubRestricted_init(lensHubAddress);

    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(PAUSER_ROLE, pauser);

    lensHub = ILensHub(lensHubAddress);
    organizationStore = IOrganizationStore(organizationStoreAddress);
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

  function getModuleMetadataURI() external view returns (string memory) {
    return moduleMetadataURI;
  }

  function setLensHub(
    address lensHubAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    lensHub = ILensHub(lensHubAddress);
  }

  function setOrganizationStore(
    address organizationStoreAddress
  ) external onlyRole(DEFAULT_ADMIN_ROLE) {
    organizationStore = IOrganizationStore(organizationStoreAddress);
  }

  function initializePublicationAction(
    uint256 profileId,
    uint256 pubId,
    address transactionExecutor,
    bytes calldata /* data */
  ) external override whenNotPaused onlyHub returns (bytes memory) {
    if (!organizationStore.isOrganization(transactionExecutor)) {
      revert UnverifiedDonee(transactionExecutor);
    }

    emit CauseCreated(profileId, pubId, transactionExecutor);

    return abi.encode(profileId, pubId, transactionExecutor);
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata params
  ) external override whenNotPaused onlyHub returns (bytes memory) {
    address sender = params.transactionExecutor;
    address recipient = lensHub.ownerOf(params.publicationActedProfileId);

    if (!organizationStore.isOrganization(recipient)) {
      revert UnverifiedDonee(recipient);
    }

    (address tokenAddress, uint256 amount) = abi.decode(
      params.actionModuleData,
      (address, uint256)
    );

    if (tokenAddress == address(0)) {
      revert InvalidTokenAddress();
    }

    if (amount == 0) {
      revert DonationAmountCannotBeZero();
    }

    IERC20(tokenAddress).safeTransferFrom(sender, recipient, amount);

    emit DonationSent(
      params.actorProfileId,
      params.publicationActedProfileId,
      params.publicationActedId,
      tokenAddress,
      sender,
      recipient,
      amount
    );

    return
      abi.encode(
        params.actorProfileId,
        params.publicationActedProfileId,
        params.publicationActedId,
        tokenAddress,
        sender,
        recipient,
        amount
      );
  }
}
