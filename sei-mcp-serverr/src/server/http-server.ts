import { config } from "dotenv";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import startServer from "./server.js";
import express, { Request, Response } from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getBalance, isNFTOwner } from "../core/services/balance.js"; // Only getBalance, isNFTOwner endpoints are present
import { getBlockByNumber, getBlockByHash, getBlockNumber, getLatestBlock } from "../core/services/blocks.js";
import { getPublicClient, getWalletClient, getAddressFromPrivateKey } from "../core/services/clients.js";
import { readContract, writeContract, isContract } from "../core/services/contracts.js";
import { getSupportedNetworks, getChainInfo, getNetworkStatus } from "../core/services/network.js";
import { getNFTCollection, getNFTOwnership, getNFTMetadata, getNFTHistory, getUserNFTs, getNFTBalance, checkNFTOwnership } from "../core/services/nfts.js";
import { getTransaction, getTransactionReceipt, getTransactionCount, estimateGas, getChainId, getTransactionHistory, getWalletActivity } from "../core/services/transactions.js";
import { transferSei } from "../core/services/transfer.js";
import { analyzeWallet } from "../core/services/wallet.js";
import { handleGeminiFunctionCall } from "../core/services/geminiService.js";
import { utils } from "../core/services/utils.js";
import { GoogleGenAI } from "@google/genai";
config();

const PORT = 3004;
const HOST = "0.0.0.0";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Session-ID"],
    credentials: true,
    exposedHeaders: ["Content-Type", "Access-Control-Allow-Origin"]
  })
);



app.options("*", cors());

const connections = new Map<string, SSEServerTransport>();

let server: McpServer | null = null;
startServer()
  .then((s) => {
    server = s;
    console.error("MCP Server initialized successfully");
  })
  .catch((error) => {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  });

app.get("/sse", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Session-ID");

  if (!server) return res.status(503).send("Server not initialized");

  let sessionId = req.query.sessionId?.toString() || generateSessionId();
  console.error(`SSE connection for sessionId: ${sessionId}`);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const transport = new SSEServerTransport("/messages", res);
  connections.set(sessionId, transport);

  req.on("close", () => {
    connections.delete(sessionId);
  });

  server.connect(transport).then(() => {
    res.write(`data: ${JSON.stringify({ type: "session_init", sessionId })}\n\n`);
  }).catch((error: Error) => {
    connections.delete(sessionId);
  });
});

app.post("/messages", (req: Request, res: Response) => {
  let sessionId = req.query.sessionId?.toString();
  if (!sessionId && connections.size === 1) {
    sessionId = Array.from(connections.keys())[0];
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (!server) return res.status(503).json({ error: "Server not initialized" });

  if (!sessionId) {
    return res.status(400).json({
      error: "No session ID provided. Please provide a sessionId query parameter or connect to /sse first.",
      activeConnections: connections.size
    });
  }

  const transport = connections.get(sessionId);
  if (!transport) {
    return res.status(404).json({ error: "Session not found" });
  }

  try {
    transport.handlePostMessage(req, res).catch((error: Error) => {
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    });
  } catch (error) {
    res.status(500).json({ error: `Internal server error: ${error}` });
  }
});

app.get("/getbalance", async (req: Request, res: Response) => {
  const { address, network } = req.query;
  if (typeof address !== "string" || typeof network !== "string") {
    return res.status(400).json({ error: "Missing address or network parameter" });
  }
  try {
    const result = await getBalance(address, network);
    res.status(200).json({
        // serialize BigInt as string
      sei: result.sei
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


/**
 * Check if an address owns a specific NFT
 * GET /isNFTOwner?tokenAddress=...&ownerAddress=...&tokenId=...&network=...
 */
app.get("/isNFTOwner", async (req: Request, res: Response) => {
  const { tokenAddress, ownerAddress, tokenId, network } = req.query;
  if (typeof tokenAddress !== "string" || typeof ownerAddress !== "string" || typeof tokenId !== "string" || typeof network !== "string") {
    return res.status(400).json({ error: "Missing one or more parameters" });
  }
  try {
    // Convert tokenId to bigint
    const tokenIdBigInt = BigInt(tokenId);
    const owns = await isNFTOwner(tokenAddress, ownerAddress, tokenIdBigInt, network);
    res.status(200).json({ owns });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// --------------------------------------------------------client functions --------------------------------------------------------------


app.get("/getAddressFromPrivateKey", (req: Request, res: Response) => {
  const { privateKey } = req.query;
  if (typeof privateKey !== "string") {
    return res.status(400).json({ error: "Missing privateKey parameter" });
  }
  try {
    // NOTE: This endpoint should NEVER be exposed in production without auth!
    const address = getAddressFromPrivateKey(privateKey as `0x${string}`);
    res.status(200).json({ address });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

/**
 * Get chain info for a network via public client
 * GET /getChainInfo?network=...
 */
app.get("/getChainInfo", (req: Request, res: Response) => {
  const { network } = req.query;
  if (typeof network !== "string") {
    return res.status(400).json({ error: "Missing network parameter" });
  }
  try {
    const client = getPublicClient(network);
    // Example info: chain id, name, rpc, etc.
    res.status(200).json({
      chain: client.chain,
      rpcUrl: client.transport.url
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

/**
 * Create a wallet client from private key and network (sensitive - for diagnostics only!)
 * POST /createWalletClient
 * Body: { privateKey: string, network: string }
 */
app.post("/createWalletClient", (req: Request, res: Response) => {
  const { privateKey, network } = req.body;
  if (typeof privateKey !== "string" || typeof network !== "string") {
    return res.status(400).json({ error: "Missing privateKey or network parameter" });
  }
  try {
    // DO NOT expose wallet client or private key in production!
    const client = getWalletClient(privateKey as `0x${string}`, network);
    res.status(200).json({
      address: client.account.address,
      chain: client.chain,
      rpcUrl: client.transport.url
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

//----------------------------------------------------------------blocks--------------------------------------------------------------


/**
 * Get the current block number
 * GET /getBlockNumber?network=sei
 */
app.get("/getBlockNumber", async (req: Request, res: Response) => {
  const { network } = req.query;
  try {
    const blockNumber = await getBlockNumber(typeof network === "string" ? network : undefined);
    res.status(200).json({
      blockNumber: blockNumber.toString() // BigInt to string
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.get("/getBlockByNumber", async (req: Request, res: Response) => {
  const blockNumber = Number(req.query.blockNumber);
  const network = typeof req.query.network === "string" ? req.query.network : undefined;
  if (!blockNumber || isNaN(blockNumber)) {
    return res.status(400).json({ error: "Missing or invalid blockNumber parameter" });
  }
  try {
    const block = await getBlockByNumber(blockNumber, network);
    // Deeply convert BigInt values to strings
    res.status(200).json(serializeBigInt(block));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.get("/getBlockByHash", async (req: Request, res: Response) => {
  const blockHash = req.query.blockHash as string;
  const network = typeof req.query.network === "string" ? req.query.network : undefined;
  if (!blockHash || typeof blockHash !== "string") {
    return res.status(400).json({ error: "Missing or invalid blockHash parameter" });
  }
  try {
    const block = await getBlockByHash(blockHash as `0x${string}`, network);
    // Deeply convert BigInt values to strings
    res.status(200).json(serializeBigInt(block));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});
app.get("/getLatestBlock", async (req: Request, res: Response) => {
  const { network } = req.query;
  try {
    const block = await getLatestBlock(typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(block));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});
// Utility function to deeply serialize BigInt values
function serializeBigInt(obj: any): any {
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (obj && typeof obj === 'object') {
    const res: any = {};
    for (const key in obj) res[key] = serializeBigInt(obj[key]);
    return res;
  }
  return obj;
}
//-------------------------------------------------contract---------------------------------------------------------



app.post("/readContract", async (req: Request, res: Response) => {
  const { network, ...params } = req.body;
  try {
    const result = await readContract(params as any, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Write to a contract
app.post("/writeContract", async (req: Request, res: Response) => {
  const { network } = req.body;
  const params = req.body.params;
  if (!params) {
    return res.status(400).json({ error: "Missing contract parameters" });
  }
  try {
    const txHash = await writeContract(params, typeof network === "string" ? network : undefined);
    res.status(200).json({ txHash });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


// Check if address is a contract
app.get("/isContract", async (req: Request, res: Response) => {
  const { address, network } = req.query;
  if (typeof address !== "string") {
    return res.status(400).json({ error: "Missing address parameter" });
  }
  try {
    const result = await isContract(address, typeof network === "string" ? network : undefined);
    res.status(200).json({ isContract: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});



// -----------------------------------------------------network --------------------------------------------------

app.get("/getSupportedNetworks", async (req: Request, res: Response) => {
  try {
    const result = await getSupportedNetworks();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.get("/getChainInfo", async (req: Request, res: Response) => {
  const { network } = req.query;
  try {
    const result = await getChainInfo(typeof network === "string" ? network : undefined);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

app.get("/getNetworkStatus", async (req: Request, res: Response) => {
  const { network } = req.query;
  try {
    const result = await getNetworkStatus(typeof network === "string" ? network : undefined);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// --------------------------------------------------------nfts-----------------------------------------------------------------


app.get("/getNFTCollection", async (req: Request, res: Response) => {
  const { contractAddress, network } = req.query;
  if (typeof contractAddress !== "string") return res.status(400).json({ error: "Missing contractAddress" });
  try {
    const result = await getNFTCollection(contractAddress, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get NFT ownership info
app.get("/getNFTOwnership", async (req: Request, res: Response) => {
  const { contractAddress, tokenId, network } = req.query;
  if (typeof contractAddress !== "string" || typeof tokenId !== "string") return res.status(400).json({ error: "Missing contractAddress or tokenId" });
  try {
    const result = await getNFTOwnership(contractAddress, tokenId, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get NFT metadata
app.get("/getNFTMetadata", async (req: Request, res: Response) => {
  const { contractAddress, tokenId, network } = req.query;
  if (typeof contractAddress !== "string" || typeof tokenId !== "string") return res.status(400).json({ error: "Missing contractAddress or tokenId" });
  try {
    const result = await getNFTMetadata(contractAddress, tokenId, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get NFT history/transfers
app.get("/getNFTHistory", async (req: Request, res: Response) => {
  const { contractAddress, tokenId, network } = req.query;
  if (typeof contractAddress !== "string") return res.status(400).json({ error: "Missing contractAddress" });
  try {
    const result = await getNFTHistory(contractAddress, typeof tokenId === "string" ? tokenId : undefined, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get user's NFT holdings
app.get("/getUserNFTs", async (req: Request, res: Response) => {
  const { address, network } = req.query;
  if (typeof address !== "string") return res.status(400).json({ error: "Missing address" });
  try {
    const result = await getUserNFTs(address, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});



// Check NFT ownership
app.get("/checkNFTOwnership", async (req: Request, res: Response) => {
  const { contractAddress, tokenId, ownerAddress, network } = req.query;
  if (typeof contractAddress !== "string" || typeof tokenId !== "string" || typeof ownerAddress !== "string")
    return res.status(400).json({ error: "Missing contractAddress, tokenId, or ownerAddress" });
  try {
    const result = await checkNFTOwnership(contractAddress, tokenId, ownerAddress, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get NFT balance for an address
app.get("/getNFTBalance", async (req: Request, res: Response) => {
  const { contractAddress, ownerAddress, network } = req.query;
  if (typeof contractAddress !== "string" || typeof ownerAddress !== "string")
    return res.status(400).json({ error: "Missing contractAddress or ownerAddress" });
  try {
    const result = await getNFTBalance(contractAddress, ownerAddress, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


//-------------------------------------------------------token-----------------------------------------------------------------



//------------------------------------------transactions----------------------------------------------------------------------




app.get("/getTransaction", async (req, res) => {
  const { hash, network } = req.query;
  if (typeof hash !== "string") return res.status(400).json({ error: "Missing hash" });
  try {
    const result = await getTransaction(hash, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get a transaction receipt by hash
app.get("/getTransactionReceipt", async (req, res) => {
  const { hash, network } = req.query;
  if (typeof hash !== "string") return res.status(400).json({ error: "Missing hash" });
  try {
    const result = await getTransactionReceipt(hash, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get transaction count for an address
app.get("/getTransactionCount", async (req, res) => {
  const { address, network } = req.query;
  if (typeof address !== "string") return res.status(400).json({ error: "Missing address" });
  try {
    const count = await getTransactionCount(address, typeof network === "string" ? network : undefined);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Estimate gas for a transaction (POST, as params can be complex)
app.post("/estimateGas", async (req, res) => {
  const { params, network } = req.body;
  if (!params) return res.status(400).json({ error: "Missing params" });
  try {
    const result = await estimateGas(params, typeof network === "string" ? network : undefined);
    res.status(200).json({ gas: result.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get chain ID
app.get("/getChainId", async (req, res) => {
  const { network } = req.query;
  try {
    const chainId = await getChainId(typeof network === "string" ? network : undefined);
    res.status(200).json({ chainId });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get transaction history for an address
app.get("/getTransactionHistory", async (req, res) => {
  const { address, network, limit } = req.query;
  if (typeof address !== "string") return res.status(400).json({ error: "Missing address" });
  try {
    const result = await getTransactionHistory(
      address,
      typeof network === "string" ? network : undefined,
      limit ? Number(limit) : 10
    );
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Get wallet activity summary
app.get("/getWalletActivity", async (req, res) => {
  const { address, network } = req.query;
  if (typeof address !== "string") return res.status(400).json({ error: "Missing address" });
  try {
    const result = await getWalletActivity(address, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


//----------------------------------------------------transfer----------------------------------------------------------------

app.post("/transferSei", async (req, res) => {
  const { toAddress, amount, network } = req.body;
  if (typeof toAddress !== "string" || typeof amount !== "string")
    return res.status(400).json({ error: "Missing toAddress or amount" });
  try {
    const txHash = await transferSei(toAddress, amount, typeof network === "string" ? network : undefined);
    res.status(200).json({ txHash });
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Transfer ERC20 tokens
app.post("/transferERC20", async (req, res) => {
  const { tokenAddress, toAddress, amount, network } = req.body;
  if (typeof tokenAddress !== "string" || typeof toAddress !== "string" || typeof amount !== "string")
    return res.status(400).json({ error: "Missing tokenAddress, toAddress or amount" });
  try {
    const result = await transferERC20(tokenAddress, toAddress, amount, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Approve ERC20 tokens
app.post("/approveERC20", async (req, res) => {
  const { tokenAddress, spenderAddress, amount, network } = req.body;
  if (typeof tokenAddress !== "string" || typeof spenderAddress !== "string" || typeof amount !== "string")
    return res.status(400).json({ error: "Missing tokenAddress, spenderAddress or amount" });
  try {
    const result = await approveERC20(tokenAddress, spenderAddress, amount, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Transfer ERC721 (NFT)
app.post("/transferERC721", async (req, res) => {
  const { tokenAddress, toAddress, tokenId, network } = req.body;
  if (typeof tokenAddress !== "string" || typeof toAddress !== "string" || typeof tokenId !== "string")
    return res.status(400).json({ error: "Missing tokenAddress, toAddress or tokenId" });
  let tokenIdBigInt: bigint;
  try {
    tokenIdBigInt = BigInt(tokenId);
  } catch {
    return res.status(400).json({ error: "tokenId must be a valid integer string" });
  }
  try {
    const result = await transferERC721(tokenAddress, toAddress, tokenIdBigInt, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});

// Transfer ERC1155 tokens
app.post("/transferERC1155", async (req, res) => {
  const { tokenAddress, toAddress, tokenId, amount, network } = req.body;
  if (typeof tokenAddress !== "string" || typeof toAddress !== "string" || typeof tokenId !== "string" || typeof amount !== "string")
    return res.status(400).json({ error: "Missing tokenAddress, toAddress, tokenId or amount" });
  let tokenIdBigInt: bigint;
  try {
    tokenIdBigInt = BigInt(tokenId);
  } catch {
    return res.status(400).json({ error: "tokenId must be a valid integer string" });
  }
  try {
    const result = await transferERC1155(tokenAddress, toAddress, tokenIdBigInt, amount, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result));
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


//------------------------------------------------------------Wallet-------------------------------------------------------------



app.get("/analyzeWallet", async (req, res) => {
  const { address, network } = req.query;
  if (typeof address !== "string")
    return res.status(400).json({ error: "Missing address" });
  try {
    const result = await analyzeWallet(address, typeof network === "string" ? network : undefined);
    res.status(200).json(serializeBigInt(result)); // <-- Use helper here!
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});


//--------------------------------------------------------GeminiIntigration----------------------------------------------------



app.post("/gemini", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const result = await handleGeminiFunctionCall(prompt);

    if (result.functionName) {
      let output;

      switch (result.functionName) {
        case "get_balance":
          output = await getBalance(result.args.address, result.args.network);
          break;
        case "is_nft_owner":
          output = await isNFTOwner(result.args.tokenAddress, result.args.ownerAddress, result.args.tokenId, result.args.network);
          break;
        case "get_address_from_private_key":
          output = await getAddressFromPrivateKey(result.args.privateKey);
          break;
        case "get_chain_info":
          output = await getChainInfo(result.args.network);
          break;
        case "create_wallet_client":
          output = await getWalletClient(result.args.privateKey, result.args.network);
          break;
        case "get_block_number":
          output = await getBlockNumber(result.args.network);
          break;
        case "get_block_by_number":
          output = await getBlockByNumber(result.args.blockNumber, result.args.network);
          break;
        case "get_block_by_hash":
          output = await getBlockByHash(result.args.blockHash, result.args.network);
          break;
        case "get_latest_block":
          output = await getLatestBlock(result.args.network);
          break;
        case "read_contract":
          output = await readContract(result.args.network /* , other contract params */);
          break;
        case "write_contract":
          output = await writeContract(result.args.network, result.args.params /* , other params */);
          break;
        case "is_contract":
          output = await isContract(result.args.address, result.args.network);
          break;
        case "get_supported_networks":
          output = await getSupportedNetworks();
          break;
        case "get_network_status":
          output = await getNetworkStatus(result.args.network);
          break;
        case "get_nft_collection":
          output = await getNFTCollection(result.args.contractAddress, result.args.network);
          break;
        case "get_nft_ownership":
          output = await getNFTOwnership(result.args.contractAddress, result.args.tokenId, result.args.network);
          break;
        case "get_nft_metadata":
          output = await getNFTMetadata(result.args.contractAddress, result.args.tokenId, result.args.network);
          break;
        case "get_nft_history":
          output = await getNFTHistory(result.args.contractAddress, result.args.tokenId, result.args.network);
          break;
        case "get_user_nfts":
          output = await getUserNFTs(result.args.address, result.args.network);
          break;
        
        
          break;
        case "check_nft_ownership":
          output = await getNFTOwnership(result.args.contractAddress, result.args.tokenId, result.args.ownerAddress, result.args.network);
          break;
        case "get_nft_balance":
          output = await getNFTBalance(result.args.contractAddress, result.args.ownerAddress, result.args.network);
          break;
        case "get_transaction":
          output = await getTransaction(result.args.hash, result.args.network);
          break;
        case "get_transaction_receipt":
          output = await getTransactionReceipt(result.args.hash, result.args.network);
          break;
        case "get_transaction_count":
          output = await getTransactionCount(result.args.address, result.args.network);
          break;
        case "estimate_gas":
          output = await estimateGas(result.args.params, result.args.network);
          break;
        case "get_chain_id":
          output = await getChainId(result.args.network);
          break;
        case "get_transaction_history":
          output = await getTransactionHistory(result.args.address, result.args.network, result.args.limit);
          break;
        case "get_wallet_activity":
          output = await getWalletActivity(result.args.address, result.args.network);
          break;
        case "transfer_sei":
          output = await transferSei(result.args.toAddress, result.args.amount, result.args.network);
          break;
        case "analyze_wallet":
          output = await analyzeWallet(result.args.address, result.args.network);
          break;
        default:
          return res.status(400).json({ error: "Unknown function" });
      }

      const oldOutput = {
        functionName: result.functionName,
        args: result.args,
        output: serializeBigInt(output)
      };

      // Send to client
      const geminiPrompt = `Summarize the following wallet JSON for the user:\n${JSON.stringify(oldOutput, null, 2)}`;

      // Call Gemini
      const ai = new GoogleGenAI({});
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: geminiPrompt,
      });

      res.json({
        summary: geminiResponse.text
      });

    } else {
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || String(error) });
  }
});
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    server: server ? "initialized" : "initializing",
    activeConnections: connections.size,
    connectedSessionIds: Array.from(connections.keys())
  });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    name: "MCP Server",
    version: "1.0.0",
    endpoints: {
      sse: "/sse",
      messages: "/messages",
      health: "/health",
      getbalance: "/getbalance",
      isNFTOwner: "/isNFTOwner",
      getAddressFromPrivateKey: "/getAddressFromPrivateKey",

      createWalletClient: "/createWalletClient",
      getBlockNumber: "/getBlockNumber",
      getBlockByNumber: "/getBlockByNumber",
      getBlockByHash: "/getBlockByHash",
      getLatestBlock: "/getLatestBlock",
      readContract: "/readContract",
      writeContract: "/writeContract",
      isContract: "/isContract",
      getSupportedNetworks: "/getSupportedNetworks",
      getChainInfo: "/getChainInfo",
      getNetworkStatus: "/getNetworkStatus",
      getNFTCollection: "/getNFTCollection",
      getNFTMetadata: "/getNFTMetadata",
      getNFTBalance: "/getNFTBalance",
      getNFTHistory: "/getNFTHistory",
      getUserNFTs: "/getUserNFTs",
      checkNFTOwnership: "/checkNFTOwnership",
      getTransaction: "/getTransaction",
      getTransactionReceipt: "/getTransactionReceipt",
      getTransactionCount: "/getTransactionCount",
      estimateGas: "/estimateGas",
      getChainId: "/getChainId",
      getTransactionHistory: "/getTransactionHistory",
      getWalletActivity: "/getWalletActivity",
      transferSei: "/transferSei",
      analyzeWallet: "/analyzeWallet",
      gemini: "/gemini",

    },
    status: server ? "ready" : "initializing",
    activeConnections: connections.size
  });
});

function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

process.on("SIGINT", () => {
  connections.forEach((transport, sessionId) => { });
  process.exit(0);
});

app.listen(PORT, HOST, () => {
  console.error(
    `MCP Server running at http://${HOST}:${PORT}
Endpoints:
- SSE: /sse
- Messages: /messages
- Health: /health
- GetBalance: /getbalance
- isNFTOwner: /isNFTOwner
- getAddressFromPrivateKey: /getAddressFromPrivateKey
- createWalletClient: /createWalletClient
- getBlockNumber: /getBlockNumber
- getBlockByNumber: /getBlockByNumber
- getBlockByHash: /getBlockByHash
- getLatestBlock: /getLatestBlock
- readContract: /readContract
- writeContract: /writeContract
- getLogs: /getLogs
- isContract: /isContract
- getSupportedNetworks: /getSupportedNetworks
- getChainInfo: /getChainInfo
- getNetworkStatus: /getNetworkStatus
- getNFTCollection: /getNFTCollection
- getNFTMetadata: /getNFTMetadata
- getNFTHistory: /getNFTHistory
- getUserNFTs: /getUserNFTs
- checkNFTOwnership: /checkNFTOwnership
- getTransaction: /getTransaction
- getTransactionReceipt: /getTransactionReceipt
- getTransactionCount: /getTransactionCount
- estimateGas: /estimateGas
- getChainId: /getChainId
- getTransactionHistory: /getTransactionHistory
- getWalletActivity: /getWalletActivity
- transferSei: /transferSei
- analyzeWallet: /analyzeWallet
- gemini: /gemini`
  );
}).on("error", (err: Error) => {
  console.error(`Server error: ${err}`);
});