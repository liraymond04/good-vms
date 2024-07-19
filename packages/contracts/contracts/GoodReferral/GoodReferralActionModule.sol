// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { SafeERC20 } from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import { HubRestrictedUpgradeable } from '../lib/HubRestrictedUpgradeable.sol';

import { IPublicationActionModule } from 'lens-modules/contracts/interfaces/IPublicationActionModule.sol';
import { Types } from 'lens-modules/contracts/libraries/constants/Types.sol';
import { ILensHub } from 'lens-modules/contracts/interfaces/ILensHub.sol';
import { LensModule } from 'lens-modules/contracts/modules/LensModule.sol';

/// @custom:security-contact security@bcharity.net
contract GoodReferralActionModule is
  Initializable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  IPublicationActionModule,
  HubRestrictedUpgradeable,
  LensModule
{
  struct ReferralData {
    address tokenAddress;
    uint256 amount;
  }

  using SafeERC20 for IERC20;

  ILensHub public lensHub;

  string private moduleMetadataURI;

  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');

  error InvalidTokenAddress();
  error AmountCannotBeZero();
  error UnverifiedDonee(address donee);

  mapping(uint256 => mapping(uint256 => ReferralData)) private map;

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(
    address defaultAdmin,
    address pauser,
    address lensHubAddress
  ) public initializer {
    __Pausable_init();
    __AccessControl_init();
    HubRestrictedUpgradeable.initialize(lensHubAddress);

    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
    _grantRole(PAUSER_ROLE, pauser);

    lensHub = ILensHub(lensHubAddress);
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

  function getReferralModuleData(
    uint256 profileId,
    uint256 publicationId
  ) public view returns (bytes memory) {
    return
      abi.encode(
        map[profileId][publicationId].tokenAddress,
        map[profileId][publicationId].amount
      );
  }

  function setReferralModuleData(
    uint256 profileId,
    uint256 publicationId,
    address tokenAddress,
    uint256 amount
  ) private {
    map[profileId][publicationId] = ReferralData(tokenAddress, amount);
  }

  function initializePublicationAction(
    uint256 profileId,
    uint256 pubId,
    address transactionExecutor,
    bytes calldata data
  ) external override whenNotPaused onlyHub returns (bytes memory) {
    (address token, uint256 amount) = abi.decode(data, (address, uint256));
    setReferralModuleData(profileId, pubId, token, amount);
    return abi.encode(profileId, pubId, transactionExecutor);
  }

  function processPublicationAction(
    Types.ProcessActionParams calldata params
  ) external override whenNotPaused onlyHub returns (bytes memory) {
    address buyer = params.transactionExecutor;
    address seller = lensHub.ownerOf(params.publicationActedProfileId);

    (address tokenAddress, uint256 amount) = abi.decode(
      params.actionModuleData,
      (address, uint256)
    );

    if (amount == 0) {
      revert AmountCannotBeZero();
    }
    if (tokenAddress == address(0)) {
      revert InvalidTokenAddress();
    }

    IERC20 token = IERC20(tokenAddress);
    uint256 remaining = amount;
    for (uint8 i = 0; i < 3 && i < params.referrerProfileIds.length; i++) {
      uint256 referrerAmount = (i == 0 ? amount * 3 : amount) / 10;
      if (referrerAmount == 0) {
        break;
      }
      remaining -= referrerAmount;
      token.safeTransferFrom(
        buyer,
        lensHub.ownerOf(params.referrerProfileIds[i]),
        referrerAmount
      );
    }

    token.safeTransferFrom(buyer, seller, remaining);

    return
      abi.encode(
        params.actorProfileId,
        params.publicationActedProfileId,
        params.publicationActedId,
        tokenAddress,
        amount
      );
  }
}
