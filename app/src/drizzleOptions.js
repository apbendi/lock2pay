import Lock2Pay from "./contracts/Lock2Pay.json";
import LockNFT from "./contracts/LockNFT.json";

const options = {
  web3: {
    block: false,
    // fallback: {
    //   type: "ws",
    //   url: "ws://127.0.0.1:8545",
    // },
  },
  contracts: [Lock2Pay, LockNFT],
  events: {
  },
  polls: {
    accounts: 1500,
  },
};

export default options;
