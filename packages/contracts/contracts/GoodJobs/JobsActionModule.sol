// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import '@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

import { HubRestrictedUpgradeable } from '../lib/HubRestrictedUpgradeable.sol';
import { IOrganizationStore } from '../GoodOrganizationStore/IOrganizationStore.sol';

import { IPublicationActionModule } from 'lens-modules/contracts/interfaces/IPublicationActionModule.sol';
import { Types } from 'lens-modules/contracts/libraries/constants/Types.sol';
import { Errors } from 'lens-modules/contracts/libraries/constants/Errors.sol';
import { ILensHub } from 'lens-modules/contracts/interfaces/ILensHub.sol';
import { LensModule } from 'lens-modules/contracts/modules/LensModule.sol';

/// @custom:security-contact security@bcharity.net
contract JobsActionModule is
  Initializable,
  PausableUpgradeable,
  AccessControlUpgradeable,
  IPublicationActionModule,
  HubRestrictedUpgradeable,
  LensModule
{
  enum Status {
    NotApplied,
    Withdrawn,
    Received,
    UnderReview,
    Approved,
    Rejected
  }

  struct OpportunityKey {
    uint256 orgProfileId;
    uint256 publicationId;
  }

  struct Opportunity {
    bool deleted;
    address organization;
    uint256 applicantCount;
    address[] applicants;
    mapping(address applicant => Status status) statuses;
  }

  error NotAnOrganization(address account);

  error OpportunityDoesNotExist(uint256 orgProfileId, uint256 publicationId);
  error ApplicationDoesNotExist(
    uint256 orgProfileId,
    uint256 publicationId,
    address applicant
  );

  error AlreadyApplied(
    uint256 orgProfileId,
    uint256 publicationId,
    address applicant
  );

  error UnknownStatus(uint256 status);
  error CannotSetStatus(Status status);

  event OpportunityCreated(
    uint256 indexed orgProfileId,
    uint256 indexed publicationId,
    address indexed organizationAddress
  );

  event OpportunityDeleted(
    uint256 indexed orgProfileId,
    uint256 indexed publicationId,
    address indexed organizationAddress
  );

  event ApplicantStatusChanged(
    uint256 indexed orgProfileId,
    uint256 indexed publicationId,
    address organizationAddress,
    address indexed applicant,
    Status newStatus
  );

  event ApplicationCreated(
    uint256 indexed orgProfileId,
    uint256 indexed publicationId,
    address organizationAddress,
    address indexed applicant
  );

  event ApplicationWithdrawn(
    uint256 indexed orgProfileId,
    uint256 indexed publicationId,
    address organizationAddress,
    address indexed applicant
  );

  modifier onlyOrganization(address account) {
    if (!organizationStore.isOrganization(account)) {
      revert NotAnOrganization(account);
    }
    _;
  }

  modifier onlyProfileOwner(address account, uint256 profileId) {
    if (account != lensHub.ownerOf(profileId)) {
      revert Errors.NotProfileOwner();
    }
    _;
  }

  bytes32 public constant PAUSER_ROLE = keccak256('PAUSER_ROLE');
  bytes32[15] __gap_roles;

  IOrganizationStore public organizationStore;

  ILensHub public lensHub;
  string internal moduleMetadataURI;

  // Opportunities for which an applicant has applied to
  mapping(address applicant => OpportunityKey[] keys)
    internal applicantOpportunities;

  // Opportunities created by an organization
  mapping(address organization => OpportunityKey[] keys)
    internal organizationCreatedOpportunities;

  // All opportunities, accessed by an OpportunityKey
  mapping(uint256 orgProfileId => mapping(uint256 publicationId => Opportunity opportunity))
    internal opportunities;

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

  function pause() public onlyRole(PAUSER_ROLE) {
    _pause();
  }

  function unpause() public onlyRole(PAUSER_ROLE) {
    _unpause();
  }

  function supportsInterface(
    bytes4 interfaceID
  ) public pure override(LensModule, AccessControlUpgradeable) returns (bool) {
    return
      interfaceID == type(IPublicationActionModule).interfaceId ||
      super.supportsInterface(interfaceID);
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

  ////////////////////////////
  // OPPORTUNITY MANAGEMENT //
  ////////////////////////////

  // Create opportunity
  function initializePublicationAction(
    uint256 profileId,
    uint256 pubId,
    address transactionExecutor,
    bytes calldata /* data */
  )
    external
    override
    whenNotPaused
    onlyHub
    onlyOrganization(transactionExecutor)
    returns (bytes memory)
  {
    OpportunityKey memory key = OpportunityKey(profileId, pubId);

    organizationCreatedOpportunities[transactionExecutor].push(key);

    opportunities[profileId][pubId].organization = transactionExecutor;

    emit OpportunityCreated(profileId, pubId, transactionExecutor);

    return abi.encode(profileId, pubId, transactionExecutor);
  }

  function deleteOpportunity(
    uint256 orgProfileId,
    uint256 pubId
  )
    external
    whenNotPaused
    onlyOrganization(msg.sender)
    onlyProfileOwner(msg.sender, orgProfileId)
  {
    Opportunity storage opportunity = opportunities[orgProfileId][pubId];

    if (!isActiveOpportunity(opportunity)) {
      revert OpportunityDoesNotExist(orgProfileId, pubId);
    }

    opportunity.deleted = true;

    emit OpportunityDeleted(orgProfileId, pubId, msg.sender);
  }

  function setApplicantStatus(
    uint256 orgProfileId,
    uint256 pubId,
    address applicant,
    Status newStatus
  )
    external
    onlyOrganization(msg.sender)
    onlyProfileOwner(msg.sender, orgProfileId)
  {
    // Status is out of the range of known enum values
    if (newStatus < type(Status).min || newStatus > type(Status).max) {
      revert UnknownStatus(uint256(newStatus));
    }

    // Should not be able to set internally used statuses
    if (newStatus == Status.NotApplied || newStatus == Status.Withdrawn) {
      revert CannotSetStatus(newStatus);
    }

    Opportunity storage opportunity = opportunities[orgProfileId][pubId];

    if (!isActiveOpportunity(opportunity)) {
      revert OpportunityDoesNotExist(orgProfileId, pubId);
    }

    Status applicantStatus = opportunity.statuses[applicant];

    if (
      applicantStatus == Status.NotApplied ||
      applicantStatus == Status.Withdrawn
    ) {
      revert ApplicationDoesNotExist(orgProfileId, pubId, applicant);
    }

    opportunity.statuses[applicant] = newStatus;

    emit ApplicantStatusChanged(
      orgProfileId,
      pubId,
      msg.sender,
      applicant,
      newStatus
    );
  }

  // Returns whether the given opportunity can be interacted with
  function isActiveOpportunity(
    Opportunity storage opportunity
  ) internal view returns (bool) {
    return opportunity.organization != address(0) && !opportunity.deleted;
  }

  ////////////////////////////
  // APPLICATION MANAGEMENT //
  ////////////////////////////

  // Create application
  function processPublicationAction(
    Types.ProcessActionParams calldata params
  ) external override whenNotPaused onlyHub returns (bytes memory) {
    address applicant = params.actorProfileOwner;

    uint256 orgProfileId = params.publicationActedProfileId;
    uint256 pubId = params.publicationActedId;

    Opportunity storage opportunity = opportunities[orgProfileId][pubId];

    if (!isActiveOpportunity(opportunity)) {
      revert OpportunityDoesNotExist(orgProfileId, pubId);
    }

    Status applicantStatus = opportunity.statuses[applicant];

    if (applicantStatus == Status.NotApplied) {
      // Completely new applicant (not a re-application after withdrawing)
      opportunity.applicants.push(applicant);
      applicantOpportunities[applicant].push(
        OpportunityKey(orgProfileId, pubId)
      );
    } else if (applicantStatus != Status.Withdrawn) {
      // Applicant has an existing application
      revert AlreadyApplied(orgProfileId, pubId, applicant);
    }

    opportunity.statuses[applicant] = Status.Received;
    opportunity.applicantCount += 1;

    emit ApplicationCreated(
      orgProfileId,
      pubId,
      lensHub.ownerOf(orgProfileId),
      applicant
    );

    return abi.encode(orgProfileId, pubId, applicant);
  }

  function withdrawApplication(
    uint256 orgProfileId,
    uint256 pubId
  ) external whenNotPaused {
    address applicant = msg.sender;

    Opportunity storage opportunity = opportunities[orgProfileId][pubId];

    if (!isActiveOpportunity(opportunity)) {
      revert OpportunityDoesNotExist(orgProfileId, pubId);
    }

    Status applicantStatus = opportunity.statuses[applicant];

    if (applicantStatus == Status.NotApplied) {
      revert ApplicationDoesNotExist(orgProfileId, pubId, applicant);
    }

    if (applicantStatus != Status.Withdrawn) {
      opportunity.statuses[applicant] = Status.Withdrawn;
      opportunity.applicantCount -= 1;
    }

    emit ApplicationWithdrawn(
      orgProfileId,
      pubId,
      lensHub.ownerOf(orgProfileId),
      applicant
    );
  }

  /////////////
  // QUERIES //
  /////////////

  function getOpportunitiesAppliedToBy(
    address applicant
  ) external view returns (OpportunityKey[] memory) {
    return applicantOpportunities[applicant];
  }

  function getOpportunitiesCreatedBy(
    address organization
  ) external view returns (OpportunityKey[] memory) {
    return organizationCreatedOpportunities[organization];
  }

  function getOpportunityInfo(
    uint256 orgProfileId,
    uint256 pubId
  )
    external
    view
    returns (
      address organization,
      uint256 applicantCount,
      address[] memory applicants
    )
  {
    Opportunity storage opportunity = opportunities[orgProfileId][pubId];

    if (!isActiveOpportunity(opportunity)) {
      revert OpportunityDoesNotExist(orgProfileId, pubId);
    }

    return (
      opportunity.organization,
      opportunity.applicantCount,
      opportunity.applicants
    );
  }

  function getApplicantStatus(
    uint256 orgProfileId,
    uint256 pubId,
    address applicant
  ) external view returns (Status) {
    Opportunity storage opportunity = opportunities[orgProfileId][pubId];

    if (!isActiveOpportunity(opportunity)) {
      revert OpportunityDoesNotExist(orgProfileId, pubId);
    }

    Status applicantStatus = opportunity.statuses[applicant];

    if (applicantStatus == Status.NotApplied) {
      revert ApplicationDoesNotExist(orgProfileId, pubId, applicant);
    }

    return applicantStatus;
  }
}
