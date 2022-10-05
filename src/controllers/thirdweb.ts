import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import { getAppControllers } from ".";

export class ThirdWebController {
  public sdk: ThirdwebSDK;
  public dropTokenAddress: string;

  constructor(wallet: ethers.Wallet){
    this.sdk = this.init(wallet);
    this.dropTokenAddress = "";
  }

  public init(wallet: ethers.Wallet): ThirdwebSDK {
    if (!this.sdk) {
       const sdk = new ThirdwebSDK(wallet);
       this.sdk = sdk
    }
    return this.sdk
  }

  public async getSdkAddress(): Promise<void> {
    try {
        const address = await this.sdk.getSigner()?.getAddress();
        console.log("👋 SDK initialized by address:", address);
      } catch (err) {
        console.error("Failed to get apps from the sdk", err);
      }
  }

  // Deploy the drop token contract with the name and symbol as params
  // RETURN none: it will set the dropTokenAddress var as the deployed contract address
  public async getClubTokenAddress(name_input: string, symbol_input:string, primary_sale_recipient_input?:string): Promise<void> {
    try {
      const contractAddress = await this.sdk.deployer.deployTokenDrop({
        name: name_input,
        symbol: symbol_input,
        primary_sale_recipient: getAppControllers().wallet.getWallet().address,
      });
      this.dropTokenAddress = contractAddress;
      console.log(
        "✅ Successfully deployed token module, address:",
        contractAddress,
      );
    } catch (error) {
      console.error("failed to deploy token module", error);
    }
  }
}

export function getThirdWebController(wallet: ethers.Wallet) {
  return new ThirdWebController(wallet);
}