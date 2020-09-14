const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const AddrOwner = "0x21a2cf2b1e84d9e9a38389f797f6087d94ed3d86"; // 25%
const AddrReward = "0x3afc9db871b19f019a70199b57866147f9b5425d"; // 20%
const AddrBounce = "0x12bbcae80e237dbbba3cc4ef6271b8477d74058d"; // 20%
const AddrUniswap = "0x1fb4e05df7066bdbe4bbe97355ea9eb3f1a277ea"; // 20%
const AddrPresale = "0x9110eef60cc95d6b3d5fd0b5c2fd87562cadbaff"; // 10%
const AddrTeam = "0x43adead1ac5b3bc804a8509edf7f432591285078"; // 5%
const AddrZero = "0x0000000000000000000000000000000000000000";

const Blacklist = [
  AddrOwner,
  AddrReward,
  AddrBounce,
  AddrUniswap,
  AddrPresale,
  AddrTeam,
  AddrZero,
];

const getTopHolders = (tokenAddress) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `${process.env.ETHERSCAN_API_URL}/token/generic-tokenholders2?m=normal&a=${tokenAddress}&s=995431884029465031869971&sid=166cafeac6d2517e4d6ff670c703c1fc&p=1`
      )
      .then((res) => {
        var dom = new JSDOM(res.data);
        const elements = dom.window.document.querySelectorAll(
          "table tr td:nth-child(2) span a"
        );
        const ans = [];

        if (elements) {
          elements.forEach((holderElm) => {
            if (!Blacklist.includes(holderElm.textContent))
              ans.push(holderElm.textContent);
          });
        }
        resolve(ans.length > 40 ? ans.slice(0, 40) : ans);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// const getTopHolders = (tokenAddress) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(
//         `${process.env.ETHPLORER_API_URL}/getTopTokenHolders/${tokenAddress}?apiKey=freekey&limit=44`
//       )
//       .then((res) => {
//         const addresses = res.holders
//           .map((holder) => holder.address)
//           .filter((addr) => !Blacklist.includes(addr));
//         resolve(addresses.length > 40 ? addresses.slice(0, 40) : addresses);
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
// };

module.exports = {
  getTopHolders,
};
