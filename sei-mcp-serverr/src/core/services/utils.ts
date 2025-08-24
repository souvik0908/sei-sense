import {
    parseEther,
    type Address
} from 'viem';

/**
 * Utility functions for formatting and parsing values
 */
export const utils = {
    // Convert ether to wei
    parseEther,

    // Format an object to JSON with bigint handling
    formatJson: (obj: unknown): string => JSON.stringify(obj, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value, 2),

    validateAddress: (address: string): string => {
    if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return address; // EVM
    }
    if (/^sei1[0-9a-z]{38}$/.test(address)) {
        return address; // Sei
    }
    throw new Error(`Invalid address: ${address}`);
}
};
