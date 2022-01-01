<template>
  <div class="frame">
    <div v-if="address" class="wallet address">
      Wallet {{ getAddress(address) }}
    </div>
    <a v-else @click="connect" class="wallet address"> Connect Metamask </a>
    <div class="container">
      <div class="logo-block">
        <img class="icon svg-tiktok" src="../../assets/image/dddd.svg" alt="" />
        <div class="name">pLOOT</div>
      </div>

      <router-view :web3="web3" :address="address"></router-view>

      <div class="link-group">
        <a href="https://twitter.com/peoplespunk">Twitter</a>
        <a href="https://discord.com/invite/EZUduaFDg9">Discord</a>
      </div>
      <div class="footer">
        $DDDD is the spirit fragment of the Goddess of Punk
      </div>
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
      tokenId: null,
      tokenIds: [],
      images: [],
      web3: null
    };
  },
  watch: {

  },
  async created() {
    let web3Provider;
    if (window.ethereum) {
      web3Provider = window.ethereum;
    } else if (window.web3) {
      // old version of MetaMask Legacy dapp browsers...
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
    window.ethereum.on("networkChanged", (chainId) => {
      this.checkChain(chainId);
    });
  },
  methods: {
    setTokenIds(tokenId){
        let self = this
        let old_info = localStorage.getItem('tokenInfo')||"{}"
        old_info = JSON.parse(old_info)
        let address_info = old_info[self.address]||[]
        address_info.push(tokenId)
        old_info[self.address] = address_info
        localStorage.setItem(JSON.stringify(old_info))
    },
    getImages() {

      this.tokenIds.map((tokenId, i) => {
        this.loot.methods
          .tokenURI(tokenId)
          .call()
          .then((res) => {
            let data=JSON.parse(window.atob((res.slice(29))))
            this.images.push(data.image)
          });
      });
    },
    /**
     * @description claim a loot
     */
    claim() {
      let self = this;
        self.loot.methods
          .claim()
          .send({
            from: self.address,
          })
          .on("receipt", function (receipt) {
            self.$message({
              message: "Mint Success",
              type: "success",
            });
//            let tokenIds = localStorage.getItem("tokenIds") || "[]";
//            tokenIds = JSON.parse(tokenIds);
//            tokenIds.push(tokenId);
//            localStorage.setItem("tokenIds", JSON.stringify(tokenIds));
//            self.tokenIds = tokenIds;
//            setTokenIds()
//            self.getImages()
            console.log(receipt);
          })
          .on("error", function (error, receipt) {
            self.$message({
              message: error,
              type: "error",
            });
          });

    },
    getAddress(address) {
      return `${address.slice(0, 5)}...${address.substr(
        address.length - 5,
        5
      )}`;
    },
    async setAddress() {
      const accounts = await this.web3.eth.getAccounts();
      if (accounts[0]) {
        this.address = accounts[0];
      }
    },
    async checkChain(id) {
      const chainId = id || (await this.web3.eth.getChainId());
      console.log("chainId", chainId);
      if (chainId !== 1) {
        this.$message({
          message: "Please switch to correct network",
          type: "error",
        });
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
  },
};
</script>
<style lang='less' scoped>
@import "./style.less";
</style>
