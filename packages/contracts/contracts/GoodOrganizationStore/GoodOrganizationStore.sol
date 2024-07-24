// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import { IOrganizationStore } from './IOrganizationStore.sol';

/// @custom:security-contact security@bcharity.net
contract GoodOrganizationStore is
  IOrganizationStore,
  Initializable,
  AccessControlUpgradeable
{
  bytes32 public constant ORGANIZATION_ROLE = keccak256('ORGANIZATION_ROLE');

  event OrganizationAdded(address indexed organization);
  event OrganizationRemoved(address indexed organization);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize(address defaultAdmin) public initializer {
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
  }

  function isOrganization(address account) external view returns (bool) {
    return hasRole(ORGANIZATION_ROLE, account);
  }

  function addOrganization(address account) external {
    // Caller's permissions are checked by the function so no need
    // to do it ourselves
    grantRole(ORGANIZATION_ROLE, account);

    emit OrganizationAdded(account);
  }

  function removeOrganization(address account) external {
    // Caller's permissions are checked by the function so no need
    // to do it ourselves
    revokeRole(ORGANIZATION_ROLE, account);

    emit OrganizationRemoved(account);
  }
}
