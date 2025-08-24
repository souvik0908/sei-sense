import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini client
const ai = new GoogleGenAI({});

export const getBalanceFunctionDeclaration = {
  name: 'get_balance',
  description: 'Gets the wallet balance for a specified address and network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'Wallet address to check.' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['address', 'network'],
  },
};

export const getERC20BalanceFunctionDeclaration = {
  name: 'get_erc20_balance',
  description: 'Gets the ERC20 token balance for an address on the specified network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC20 token contract address.' },
      ownerAddress: { type: Type.STRING, description: 'Owner’s wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['tokenAddress', 'ownerAddress', 'network'],
  },
};

export const isNFTOwnerFunctionDeclaration = {
  name: 'is_nft_owner',
  description: 'Checks if an address owns a specific NFT tokenId on a given contract and network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'NFT contract address.' },
      ownerAddress: { type: Type.STRING, description: 'Owner’s wallet address.' },
      tokenId: { type: Type.STRING, description: 'NFT token ID (as a string).' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['tokenAddress', 'ownerAddress', 'tokenId', 'network'],
  },
};

export const getERC721BalanceFunctionDeclaration = {
  name: 'get_erc721_balance',
  description: 'Gets the number of ERC721 NFTs owned by an address for a collection on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC721 NFT contract address.' },
      ownerAddress: { type: Type.STRING, description: 'Owner’s wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['tokenAddress', 'ownerAddress', 'network'],
  },
};

export const getERC1155BalanceFunctionDeclaration = {
  name: 'get_erc1155_balance',
  description: 'Gets the ERC1155 token balance for an address and tokenId on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC1155 token contract address.' },
      ownerAddress: { type: Type.STRING, description: 'Owner’s wallet address.' },
      tokenId: { type: Type.STRING, description: 'ERC1155 token ID (as a string).' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['tokenAddress', 'ownerAddress', 'tokenId', 'network'],
  },
};

export const getAddressFromPrivateKeyFunctionDeclaration = {
  name: 'get_address_from_private_key',
  description: 'Gets the wallet address corresponding to a private key.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      privateKey: { type: Type.STRING, description: 'Private key (hex string, 0x...)' },
    },
    required: ['privateKey'],
  },
};

export const getChainInfoFunctionDeclaration = {
  name: 'get_chain_info',
  description: 'Gets chain info (chain id, name, rpc URL) for a specified network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['network'],
  },
};

export const createWalletClientFunctionDeclaration = {
  name: 'create_wallet_client',
  description: 'Creates a wallet client from a private key and network (for diagnostics).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      privateKey: { type: Type.STRING, description: 'Private key (hex string, 0x...)' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['privateKey', 'network'],
  },
};

export const getBlockNumberFunctionDeclaration = {
  name: 'get_block_number',
  description: 'Gets the current block number for a given network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['network'],
  },
};

export const getBlockByNumberFunctionDeclaration = {
  name: 'get_block_by_number',
  description: 'Gets a block by its number from a specified network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      blockNumber: { type: Type.STRING, description: 'Block number as a string.' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['blockNumber', 'network'],
  },
};

export const getBlockByHashFunctionDeclaration = {
  name: 'get_block_by_hash',
  description: 'Gets a block by its hash from a specified network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      blockHash: { type: Type.STRING, description: 'Block hash (0x...).' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['blockHash', 'network'],
  },
};

export const getLatestBlockFunctionDeclaration = {
  name: 'get_latest_block',
  description: 'Gets the latest block on a specified network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['network'],
  },
};

export const readContractFunctionDeclaration = {
  name: 'read_contract',
  description: 'Reads data from a smart contract (parameters depend on contract).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
      // Add other contract-specific parameters as needed
    },
    required: ['network'],
  },
};

export const writeContractFunctionDeclaration = {
  name: 'write_contract',
  description: 'Writes data to a smart contract (parameters depend on contract).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
      // Add other contract-specific parameters as needed
      params: { type: Type.OBJECT, description: 'Contract method parameters.' },
    },
    required: ['network', 'params'],
  },
};

export const getLogsFunctionDeclaration = {
  name: 'get_logs',
  description: 'Gets logs from a smart contract (parameters depend on contract).',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
      // Add other contract-specific parameters as needed
    },
    required: ['network'],
  },
};

export const isContractFunctionDeclaration = {
  name: 'is_contract',
  description: 'Checks if an address is a contract on a given network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'Address to check.' },
      network: { type: Type.STRING, description: 'Blockchain network to query.' },
    },
    required: ['address', 'network'],
  },
};

export const getSupportedNetworksFunctionDeclaration = {
  name: 'get_supported_networks',
  description: 'Gets the list of supported blockchain networks.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
    required: [],
  },
};


// Network Status
export const getNetworkStatusFunctionDeclaration = {
  name: 'get_network_status',
  description: 'Gets the status of a specified blockchain network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network to query.' }
    },
    required: ['network'],
  },
};

// NFT Endpoints
export const getNFTCollectionFunctionDeclaration = {
  name: 'get_nft_collection',
  description: 'Gets information about an NFT collection for a contract address and network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'NFT contract address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'network'],
  },
};

export const getNFTOwnershipFunctionDeclaration = {
  name: 'get_nft_ownership',
  description: 'Gets ownership info for a specific NFT tokenId in a contract.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'NFT contract address.' },
      tokenId: { type: Type.STRING, description: 'NFT token ID.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'tokenId', 'network'],
  },
};

export const getNFTMetadataFunctionDeclaration = {
  name: 'get_nft_metadata',
  description: 'Gets metadata for a specific NFT tokenId in a contract.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'NFT contract address.' },
      tokenId: { type: Type.STRING, description: 'NFT token ID.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'tokenId', 'network'],
  },
};

export const getNFTHistoryFunctionDeclaration = {
  name: 'get_nft_history',
  description: 'Gets history/transfers for a specific NFT tokenId in a contract.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'NFT contract address.' },
      tokenId: { type: Type.STRING, description: 'NFT token ID.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'tokenId', 'network'],
  },
};

export const getUserNFTsFunctionDeclaration = {
  name: 'get_user_nfts',
  description: 'Gets NFTs owned by a user address on a specific network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'User wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['address', 'network'],
  },
};

export const getERC721TokenMetadataFunctionDeclaration = {
  name: 'get_erc721_token_metadata',
  description: 'Gets metadata for a specific ERC721 token.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'ERC721 contract address.' },
      tokenId: { type: Type.STRING, description: 'ERC721 token ID.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'tokenId', 'network'],
  },
};

export const getERC1155TokenURIFunctionDeclaration = {
  name: 'get_erc1155_token_uri',
  description: 'Gets the URI for a specific ERC1155 token.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'ERC1155 contract address.' },
      tokenId: { type: Type.STRING, description: 'ERC1155 token ID.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'tokenId', 'network'],
  },
};

export const checkNFTOwnershipFunctionDeclaration = {
  name: 'check_nft_ownership',
  description: 'Checks if an address owns a specific NFT tokenId in a contract.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'NFT contract address.' },
      tokenId: { type: Type.STRING, description: 'NFT token ID.' },
      ownerAddress: { type: Type.STRING, description: 'Owner wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'tokenId', 'ownerAddress', 'network'],
  },
};

export const getNFTBalanceFunctionDeclaration = {
  name: 'get_nft_balance',
  description: 'Gets the NFT balance for an owner address and contract.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      contractAddress: { type: Type.STRING, description: 'NFT contract address.' },
      ownerAddress: { type: Type.STRING, description: 'Owner wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['contractAddress', 'ownerAddress', 'network'],
  },
};



// ERC20 Token Info
export const getERC20TokenInfoFunctionDeclaration = {
  name: 'get_erc20_token_info',
  description: 'Gets information about an ERC20 token for a contract address and network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC20 token contract address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['tokenAddress', 'network'],
  },
};
export const getTransactionFunctionDeclaration = {
  name: 'get_transaction',
  description: 'Gets transaction details by hash and network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      hash: { type: Type.STRING, description: 'Transaction hash (0x...)' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['hash', 'network'],
  },
};

export const getTransactionReceiptFunctionDeclaration = {
  name: 'get_transaction_receipt',
  description: 'Gets a transaction receipt by hash and network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      hash: { type: Type.STRING, description: 'Transaction hash (0x...)' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['hash', 'network'],
  },
};

export const getTransactionCountFunctionDeclaration = {
  name: 'get_transaction_count',
  description: 'Gets transaction count for an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'Wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['address', 'network'],
  },
};

export const estimateGasFunctionDeclaration = {
  name: 'estimate_gas',
  description: 'Estimates gas usage for a transaction on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      params: { type: Type.OBJECT, description: 'Transaction parameters.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['params', 'network'],
  },
};

export const getChainIdFunctionDeclaration = {
  name: 'get_chain_id',
  description: 'Gets the chain ID for a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['network'],
  },
};

export const getTransactionHistoryFunctionDeclaration = {
  name: 'get_transaction_history',
  description: 'Gets transaction history for an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'Wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
      limit: { type: Type.STRING, description: 'Number of transactions to retrieve.' },
    },
    required: ['address', 'network'],
  },
};

export const getWalletActivityFunctionDeclaration = {
  name: 'get_wallet_activity',
  description: 'Gets wallet activity summary for an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'Wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['address', 'network'],
  },
};

// Transfer-related
export const transferSeiFunctionDeclaration = {
  name: 'transfer_sei',
  description: 'Transfers SEI tokens to an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      toAddress: { type: Type.STRING, description: 'Recipient wallet address.' },
      amount: { type: Type.STRING, description: 'Amount to transfer (as string).' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['toAddress', 'amount', 'network'],
  },
};

export const transferERC20FunctionDeclaration = {
  name: 'transfer_erc20',
  description: 'Transfers ERC20 tokens to an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC20 contract address.' },
      toAddress: { type: Type.STRING, description: 'Recipient wallet address.' },
      amount: { type: Type.STRING, description: 'Amount to transfer (as string).' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['tokenAddress', 'toAddress', 'amount', 'network'],
  },
};

export const approveERC20FunctionDeclaration = {
  name: 'approve_erc20',
  description: 'Approves ERC20 tokens for a spender address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC20 contract address.' },
      spenderAddress: { type: Type.STRING, description: 'Spender wallet address.' },
      amount: { type: Type.STRING, description: 'Amount to approve (as string).' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['tokenAddress', 'spenderAddress', 'amount', 'network'],
  },
};

export const transferERC721FunctionDeclaration = {
  name: 'transfer_erc721',
  description: 'Transfers an ERC721 token (NFT) to an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC721 contract address.' },
      toAddress: { type: Type.STRING, description: 'Recipient wallet address.' },
      tokenId: { type: Type.STRING, description: 'Token ID (as string).' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['tokenAddress', 'toAddress', 'tokenId', 'network'],
  },
};

export const transferERC1155FunctionDeclaration = {
  name: 'transfer_erc1155',
  description: 'Transfers an ERC1155 token to an address on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      tokenAddress: { type: Type.STRING, description: 'ERC1155 contract address.' },
      toAddress: { type: Type.STRING, description: 'Recipient wallet address.' },
      tokenId: { type: Type.STRING, description: 'Token ID (as string).' },
      amount: { type: Type.STRING, description: 'Amount to transfer (as string).' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['tokenAddress', 'toAddress', 'tokenId', 'amount', 'network'],
  },
};

// Wallet analysis
export const analyzeWalletFunctionDeclaration = {
  name: 'analyze_wallet',
  description: 'Analyzes a wallet address to provide a summary and insights on a network.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      address: { type: Type.STRING, description: 'Wallet address.' },
      network: { type: Type.STRING, description: 'Blockchain network.' },
    },
    required: ['address', 'network'],
  },
};

export const functionDeclarations = [
  getBalanceFunctionDeclaration,
  getERC20BalanceFunctionDeclaration,
  isNFTOwnerFunctionDeclaration,
  getERC721BalanceFunctionDeclaration,
  getAddressFromPrivateKeyFunctionDeclaration,
  getChainInfoFunctionDeclaration,
  createWalletClientFunctionDeclaration,
  getBlockNumberFunctionDeclaration,
  getBlockByNumberFunctionDeclaration,
  getBlockByHashFunctionDeclaration,
  getLatestBlockFunctionDeclaration,
  readContractFunctionDeclaration,
  writeContractFunctionDeclaration,
  getLogsFunctionDeclaration,
  isContractFunctionDeclaration,
  getSupportedNetworksFunctionDeclaration,
  getNetworkStatusFunctionDeclaration,
  getNFTCollectionFunctionDeclaration,
  getNFTOwnershipFunctionDeclaration,
  getNFTMetadataFunctionDeclaration,
  getNFTHistoryFunctionDeclaration,
  getUserNFTsFunctionDeclaration,
  getERC721TokenMetadataFunctionDeclaration,
  getERC1155TokenURIFunctionDeclaration,
  checkNFTOwnershipFunctionDeclaration,
  getNFTBalanceFunctionDeclaration,
  getERC1155BalanceFunctionDeclaration,
  getERC20TokenInfoFunctionDeclaration,
  getTransactionFunctionDeclaration,
  getTransactionReceiptFunctionDeclaration,
  getTransactionCountFunctionDeclaration,
  estimateGasFunctionDeclaration,
  getChainIdFunctionDeclaration,
  getTransactionHistoryFunctionDeclaration,
  getWalletActivityFunctionDeclaration,
  transferSeiFunctionDeclaration,
  transferERC20FunctionDeclaration,
  approveERC20FunctionDeclaration,
  transferERC721FunctionDeclaration,
  transferERC1155FunctionDeclaration,
  analyzeWalletFunctionDeclaration,
];
export async function handleGeminiFunctionCall(userPrompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite', // or 'gemini-2.5-flash' or 'gemini-2.5-pro'
    contents: userPrompt,
    config: {
      tools: [{
        functionDeclarations
      }],
    },
  });

  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0];
    return {
      functionName: functionCall.name,
      args: functionCall.args,
    };
  } else {
    return { text: response.text };
  }
}