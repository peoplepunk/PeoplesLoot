<template>
  <div class="landingpage">
    <div v-if="address" class="wallet address">
      Wallet {{ getAddress(address) }}
    </div>
    <a v-else @click="connect" class="wallet address"> 点击连接Metamask </a>
    <div class="container">
      <div class="logo-block">
        <img class="icon svg-tiktok" src="../../assets/image/dddd.svg" alt="" />
        <div class="name">People's Loot</div>
      </div>
      <div class="subtitle">
        People's Loot is randomized adventurer gear generated and stored on
        chain. Stats, images, and other functionality are intentionally omitted
        for others to interpret. Feel free to use Loot in any way you want.
      </div>
      <div class="btn" @click="claim">Claim People's Loot</div>
    </div>
  </div>
</template>
<script>
import Web3 from "web3";
import abi from "@/assets/abi/ddloot.json";
export default {
  data() {
    return {
      address: null,
      chainId: null,
      loot: null,
    };
  },
  created() {},
  async mounted() {
    let web3Provider;
    if (window.ethereum) {
      web3Provider = window.ethereum;
    } else if (window.web3) {
      // 老版 MetaMask Legacy dapp browsers...
      web3Provider = window.web3.currentProvider;
    } else {
      this.$message({
        message: "Please use metamask",
        type: "error",
      });
    }
    this.web3 = new Web3(web3Provider);
    this.setAddress();
    await this.checkChain();
    this.loot = new this.web3.eth.Contract(
      abi,
      "0xf1d07f1475a4264AA90408c62bb8b04ab3706362"
    );
    window.ethereum.on("networkChanged", (chainId) => {
      this.checkChain(chainId);
    });
  },
  methods: {
    buidl() {
      this.$message({
        message: "Buidling",
        type: "warning",
      });
    },
    /**
     * @description claim a loot
     */
    claim() {
      this.loot.methods
        .claim(3)
        .send({ from: this.address })
        .on("receipt", function (receipt) {
          console.log(receipt);
        })
        .on("error", function (error, receipt) {
          console.log(error);
        });
    },
    getAddress(address) {
      return `${address.slice(0, 5)}...${address.substr(address.length - 5, 5)}`;
    },
    async setAddress() {
      const accounts = await this.web3.eth.getAccounts();
      if (accounts[0]) {
        this.address = accounts[0];
      }
    },
    async connect() {
      try {
        await window.ethereum.enable();
        await this.setAddress();
        await this.checkChain();
      } catch (error) {
        console.log(error);
      }
    },
    async disconnect() {},
    async checkChain(id) {
      const chainId = id || (await this.web3.eth.getChainId());
      if (chainId !== 3) {
        this.$message({
          message: "Please switch Rposten",
          type: "error",
        });
      }
    },
  },
};
</script>
<style lang='less'>
@import "./style.less";
</style>
