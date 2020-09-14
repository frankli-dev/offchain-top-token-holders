require("dotenv").config();

const { web3 } = require("./lib");
const { EthplorerClient } = require("./api_clients");
const { KOVAN_CONTRACT_ABI } = require("./contract_abis");

const contract = new web3.eth.Contract(
  KOVAN_CONTRACT_ABI,
  process.env.KOVAN_HELP_TOKEN_ADDRESS,
  { from: process.env.KOVAN_DEPLOYER_ADDRESS }
);

const updateTopHolders = async () => {
  try {
    const topHolders = await EthplorerClient.getTopHolders(
      process.env.KOVAN_HELP_TOKEN_ADDRESS
    );
    console.log(topHolders);

    await contract.methods
      .updateTopHolders(topHolders)
      .send()
      .on("transactionHash", function () {
        console.log("Hash");
      })
      .on("receipt", function () {
        console.log("Receipt");
      })
      .on("error", async function () {
        console.log("Error");
      });
  } catch (e) {
    console.error("EthplorerClient: error", e);
  }
};

updateTopHolders();
