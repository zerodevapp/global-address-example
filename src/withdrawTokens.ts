import { getWithdrawTokensCalls } from "@zerodev/global-address";

async function main() {
    const calls = await getWithdrawTokensCalls({
        globalAddress: '0x80aD677493cA0b3A521E55aEEE3ad882be05E277', // global address
        tokens: [
            {
                chainId: 42161,
                token: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', // USDT on Arbitrum
            },
            {
                chainId: 42161,
                token: '0xaf88d065e77c8cc2239327c5edb3a432268e5831', // USDC on Arbitrum
            },
            {
                chainId: 8453,
                token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' // USDT on Base
            }
        ],
    });

    for (const withdrawData of calls.data) {
        console.log(`withdraw token from global address on chain ${withdrawData.chainId} with ${withdrawData.calls.length} calls`);
        console.log('calls', withdrawData.calls);
        // send calls from owner of global address
    }
}
main();