import { ConnectExtension } from "@magic-ext/connect";
import { InstanceWithExtensions, SDKBase } from "@magic-sdk/provider";
import { ChainId, ThirdwebSDKProvider } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { useState } from "react";
import App from "./App";
import { supabase } from "./controllers/supabase";

export interface IWrappedAppProps {
  provider: ethers.providers.Web3Provider;
  magic: InstanceWithExtensions<SDKBase, ConnectExtension[]>;
}

export const WrappedApp = (props: IWrappedAppProps) => {

  const { provider, magic } = props;
  // Set the initial state of the signer as the signer that Magic Connect provider can get
  // If the user has previously logged in, the Magic Connect provider should have stored the user's signer, and can return the signer
  // If the user has not logged in previously, it will return nothing
  const [signer, setSigner] = useState(
    undefined as ethers.Signer | undefined
  );
  const [userInfo, setUserInfo] = useState({} as any);
  const activeChainId = ChainId.Goerli;
  const INFURA_KEY = String(process.env.REACT_APP_INFURA_PROJECT_ID);
  const _rpcUrl =
    "https://goerli.infura.io/v3/54a166cf013f4904933008024da4f925";

  // Login with Magic Connect
  const magicLogin = async () => {
    await provider?.send("eth_accounts", []);
    // getSigner() decides whether the Magic Connect login modal pops up
    // If getSigner() does not return a signer, then that means no wallet is authenticated, and the login modal will pop up
    // If getSigner() returns a signer, that means a wallet is connected and no need to show login modal
    const _signer = await provider?.getSigner();
    let _userInfo;
    try {
      _userInfo = await props.magic.connect.requestUserInfo();
    } catch (err) {
      _userInfo = {email:""};
    }
    
    setUserInfo(_userInfo);
    setSigner(_signer);
    console.log(userInfo.email);
    await updateUserSupabase(await provider.getSigner().getAddress(), userInfo.email)
  };

  // Logout with Magic Connect
  const magicLogout = async () => {
    await magic.connect.disconnect().catch((e) => console.log(e));
    setSigner(undefined);
  };

  // Write the user's address and email into the user database in Supabase
  const updateUserSupabase = async (
    _walletAddress: string,
    _email: string = ""
  ) => {
    const { data, error } = await supabase
      .from("user")
      .select()
      .eq("wallet_address", _walletAddress);
    if (error) {
      const { data, error } = await supabase
        .from("user")
        .insert({ wallet_address: _walletAddress, email: _email })
        .select();
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    } else {
      const { data, error } = await supabase
        .from("user")
        .update({ wallet_address: _walletAddress, email: _email })
        .eq("wallet_address", _walletAddress)
        .select();
      if (error) {
        console.log(error);
      }
      if (data) {
        console.log(data);
      }
    }
  };

  return (
    <>
      <div>
        <p>Magic Connect</p>
        <button onClick={() => magicLogin()}>Login</button>
        <button
          onClick={() =>
            magic.connect.showWallet().catch((e) => console.log(e))
          }
        >
          Show wallet
        </button>
        <button onClick={() => magicLogout()}>Log out</button>
      </div>
      {signer && (
        <ThirdwebSDKProvider
          desiredChainId={activeChainId}
          provider={provider}
          signer={signer}
          sdkOptions={{
            readonlySettings: {
              rpcUrl: _rpcUrl,
              chainId: ChainId.Goerli,
            },
          }}
        >
          <App />
        </ThirdwebSDKProvider>
      )}
    </>
  );
};
