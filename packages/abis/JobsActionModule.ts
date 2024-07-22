export const JobsActionModule = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'AccessControlBadConfirmation', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' }
    ],
    name: 'AccessControlUnauthorizedAccount',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'publicationId', type: 'uint256' },
      { internalType: 'address', name: 'applicant', type: 'address' }
    ],
    name: 'AlreadyApplied',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'publicationId', type: 'uint256' },
      { internalType: 'address', name: 'applicant', type: 'address' }
    ],
    name: 'ApplicationDoesNotExist',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'enum JobsActionModule.Status',
        name: 'status',
        type: 'uint8'
      }
    ],
    name: 'CannotSetStatus',
    type: 'error'
  },
  { inputs: [], name: 'EnforcedPause', type: 'error' },
  { inputs: [], name: 'ExpectedPause', type: 'error' },
  { inputs: [], name: 'InvalidInitialization', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'NotAnOrganization',
    type: 'error'
  },
  { inputs: [], name: 'NotHub', type: 'error' },
  { inputs: [], name: 'NotInitializing', type: 'error' },
  { inputs: [], name: 'NotProfileOwner', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'publicationId', type: 'uint256' }
    ],
    name: 'OpportunityDoesNotExist',
    type: 'error'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'status', type: 'uint256' }],
    name: 'UnknownStatus',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orgProfileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'publicationId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'organizationAddress',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'applicant',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'enum JobsActionModule.Status',
        name: 'newStatus',
        type: 'uint8'
      }
    ],
    name: 'ApplicantStatusChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orgProfileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'publicationId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'organizationAddress',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'applicant',
        type: 'address'
      }
    ],
    name: 'ApplicationCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orgProfileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'publicationId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'organizationAddress',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'applicant',
        type: 'address'
      }
    ],
    name: 'ApplicationWithdrawn',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orgProfileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'publicationId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'organizationAddress',
        type: 'address'
      }
    ],
    name: 'OpportunityCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orgProfileId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'publicationId',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'organizationAddress',
        type: 'address'
      }
    ],
    name: 'OpportunityDeleted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32'
      }
    ],
    name: 'RoleAdminChanged',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'role', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ORGANIZATION_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'addOrganization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' }
    ],
    name: 'deleteOpportunity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: 'applicant', type: 'address' }
    ],
    name: 'getApplicantStatus',
    outputs: [
      { internalType: 'enum JobsActionModule.Status', name: '', type: 'uint8' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getModuleMetadataURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'applicant', type: 'address' }],
    name: 'getOpportunitiesAppliedToBy',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
          { internalType: 'uint256', name: 'publicationId', type: 'uint256' }
        ],
        internalType: 'struct JobsActionModule.OpportunityKey[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'organization', type: 'address' }
    ],
    name: 'getOpportunitiesCreatedBy',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
          { internalType: 'uint256', name: 'publicationId', type: 'uint256' }
        ],
        internalType: 'struct JobsActionModule.OpportunityKey[]',
        name: '',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' }
    ],
    name: 'getOpportunityInfo',
    outputs: [
      { internalType: 'address', name: 'organization', type: 'address' },
      { internalType: 'uint256', name: 'applicantCount', type: 'uint256' },
      { internalType: 'address[]', name: 'applicants', type: 'address[]' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'role', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' }
    ],
    name: 'hasRole',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'defaultAdmin', type: 'address' },
      { internalType: 'address', name: 'pauser', type: 'address' },
      { internalType: 'address', name: 'lensHubAddress', type: 'address' }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'profileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: 'transactionExecutor', type: 'address' },
      { internalType: 'bytes', name: '', type: 'bytes' }
    ],
    name: 'initializePublicationAction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'isOrganization',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lensHub',
    outputs: [{ internalType: 'contract ILensHub', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'publicationActedProfileId',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'publicationActedId',
            type: 'uint256'
          },
          { internalType: 'uint256', name: 'actorProfileId', type: 'uint256' },
          {
            internalType: 'address',
            name: 'actorProfileOwner',
            type: 'address'
          },
          {
            internalType: 'address',
            name: 'transactionExecutor',
            type: 'address'
          },
          {
            internalType: 'uint256[]',
            name: 'referrerProfileIds',
            type: 'uint256[]'
          },
          {
            internalType: 'uint256[]',
            name: 'referrerPubIds',
            type: 'uint256[]'
          },
          {
            internalType: 'enum Types.PublicationType[]',
            name: 'referrerPubTypes',
            type: 'uint8[]'
          },
          { internalType: 'bytes', name: 'actionModuleData', type: 'bytes' }
        ],
        internalType: 'struct Types.ProcessActionParams',
        name: 'params',
        type: 'tuple'
      }
    ],
    name: 'processPublicationAction',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'removeOrganization',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'callerConfirmation', type: 'address' }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'role', type: 'bytes32' },
      { internalType: 'address', name: 'account', type: 'address' }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' },
      { internalType: 'address', name: 'applicant', type: 'address' },
      {
        internalType: 'enum JobsActionModule.Status',
        name: 'newStatus',
        type: 'uint8'
      }
    ],
    name: 'setApplicantStatus',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'string', name: '_metadataURI', type: 'string' }],
    name: 'setModuleMetadataURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'orgProfileId', type: 'uint256' },
      { internalType: 'uint256', name: 'pubId', type: 'uint256' }
    ],
    name: 'withdrawApplication',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
