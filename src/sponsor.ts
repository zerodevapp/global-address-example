import {
  createGlobalAddress,
  createCall,
  FLEX,
  CreateGlobalAddressParams,
  GLOBAL_ADDRESS_SERVER_URL,
} from '@zerodev/global-address'
import { erc20Abi } from 'viem'
import { base, arbitrum, mainnet, optimism } from 'viem/chains'
import { config } from 'dotenv'

config()

const ZERODEV_PROJECT_ID = process.env.ZERODEV_PROJECT_ID

async function run() {
  // Replace this with an address you want to receive funds on
  const owner = '0xddED85de258cC7a33A61BC6215DD766E87a97070'

  // Source tokens (any ERC20 on arbitrum, ETH on mainnet, USDC on optimism)
  const srcTokens: CreateGlobalAddressParams["srcTokens"] = [
    {
      tokenType: 'ERC20',
      chain: arbitrum,
    },
    {
      tokenType: 'NATIVE',
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

  const erc20Call = createCall({
    target: FLEX.TOKEN_ADDRESS,
    value: 0n,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [owner, FLEX.AMOUNT],
  })

  const nativeCall = createCall({
    target: owner,
    value: FLEX.NATIVE_AMOUNT,
  })

  const { globalAddress, estimatedFees } = await createGlobalAddress({
    destChain,
    owner,
    slippage,
    actions: {
      'USDC': {
        action: [erc20Call],
        fallBack: [],
      },
      'WRAPPED_NATIVE': {
        action: [erc20Call],
        fallBack: [],
      },
      'NATIVE': {
        action: [nativeCall],
        fallBack: [],
      }
    },
    srcTokens,
    config: {
      baseUrl: `${GLOBAL_ADDRESS_SERVER_URL}/${ZERODEV_PROJECT_ID}`
    }
  })

  console.log('Estimated fee per token deposit', JSON.stringify(estimatedFees, null, 2));
  console.log('Global address', globalAddress)
  console.log('Try sending at least 1 USDC to the global address on any chain (say Arbitrum), and observe that the owner address receives funds on Base.')
}

run().catch((error) => console.error('Error:', error))
