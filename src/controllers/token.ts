import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import ethers from "ethers";
import { getAppControllers } from ".";

const sdk = new ThirdwebSDK(getAppControllers().wallet.getWallet());

export async function getSdkAddress() {
    try {
        const address = await sdk.getSigner()?.getAddress();
        console.log("SDK initialized by address:", address);
      } catch (err) {
        console.error("Failed to get apps from the sdk", err);
      }
}