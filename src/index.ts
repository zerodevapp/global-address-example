import {
  createMagicAddress,
  createAction,
  ActionType,
  FLEX,
  type TOKEN_TYPE,
} from '@zerodev/magic-address';
import { erc20Abi, type Address } from 'viem';
import { sepolia, baseSepolia } from 'viem/chains';


async function run() {
  const owner = '0x9775137314fe595c943712b0b336327dfa80ae8a';
  // Source tokens (ETH on Base Sepolia)
  const srcTokens: Address[] = [
    '0x4200000000000000000000000000000000000006',
  ];

  const srcChains = [baseSepolia];
  const executionChain = sepolia;
  const slippage = 5000;
  const tokenAddress: Address =
    '0xfff9976782d46cc05630d1f6ebab18b2324d6b14' // WETH address

  const to = tokenAddress;
  const action = createAction({
    target: to,
    value: 0n,
    // data
    abi: erc20Abi,
    functionName: 'transfer',
    args: [owner, FLEX],
    // call type
    actionType: ActionType.CALL,
    shouldNotFail: true,
  });

  const magicAddress = await createMagicAddress({
    executionChain,
    owner,
    slippage,
    tokenActions: [
      {
        tokenType: 'ERC20' as TOKEN_TYPE,
        tokenAddress,
        actions: [action],
      }
    ],
    srcChains,
    srcTokens,
    config: {
      baseUrl: 'http://127.0.0.1:4000',
    },
  });
  console.log('magicAddress', magicAddress);
}

run().catch((error) => console.error('Error:', error));