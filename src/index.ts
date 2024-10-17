import {
  createMagicAddress,
  createCall,
  FLEX,
  CreateMagicAddressParams,
  TOKEN_ADDRESSES,
} from '@zerodev/magic-address'
import { erc20Abi } from 'viem'
import { base, arbitrum, mainnet, optimism } from 'viem/chains'

async function run() {
  // Replace this with an address you want to receive funds on
  const owner = '0xddED85de258cC7a33A61BC6215DD766E87a97070'

  // Source tokens (any ERC20 on arbitrum, ETH on mainnet, USDC on optimism)
  const srcTokens: CreateMagicAddressParams["srcTokens"] = [
    {
      tokenType: 'ERC20',
      chain: arbitrum,
    },
    {
      tokenType: 'NATIVE',
      chain: mainnet
    },
    {
      tokenType: 'USDC',
      chain: optimism
    },
  ]

  const destChain = base
  const slippage = 5000
  const tokenAddress = TOKEN_ADDRESSES[base.id]["USDC"]

  if (!tokenAddress) {
    throw new Error('Token address not found')
  }

  const to = tokenAddress
  const call = createCall({
    target: to,
    value: 0n,
    // data
    abi: erc20Abi,
    functionName: 'transfer',
    args: [owner, FLEX.AMOUNT],
  })

  const { magicAddress, estimatedFees } = await createMagicAddress({
    destChain,
    owner,
    slippage,
    actions: {
      'USDC': {
        action: [call],
        fallBack: [],
      }
    },
    srcTokens,
    config: {
      baseUrl: 'https://magic-address-server.onrender.com',
    },
  })

  console.log('Magic address', magicAddress)
  console.log('Estimated fee per token deposit', JSON.stringify(estimatedFees, null, 2));
  console.log('Try sending at least 1 USDC to the magic address on any chain (say Arbitrum), and observe that the owner address receives funds on Base.')
}

run().catch((error) => console.error('Error:', error))