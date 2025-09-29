import { getGlobalAddressStatus } from "@zerodev/global-address";

async function main() {
    const status = await getGlobalAddressStatus({
        globalAddress: '0x80aD677493cA0b3A521E55aEEE3ad882be05E277',
    });
    console.log(status);
}

main();