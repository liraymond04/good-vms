// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

interface IOrganizationStore {
  function isOrganization(address account) external view returns (bool);
  function addOrganization(address account) external;
  function removeOrganization(address account) external;
}
