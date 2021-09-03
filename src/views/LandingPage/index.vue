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
      <div class="btn-group">
        <input
          type="text"
          v-model="tokenId"
          placeholder="Please input tokenId"
        />
        <div class="btn" @click="claim">Claim People's Loot</div>
      </div>
      <div class="bottom-group">
        <!--               这个地方展示image list-->
          <img v-for="i in images" :key="i" :src="i"  class='nft'/>
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
    };
  },
  created() {
    let self = this;
    let tokenIds = localStorage.getItem("tokenIds") || "[]";
    tokenIds = JSON.parse(tokenIds);
    self.tokenIds = tokenIds;
  },
  watch: {
    tokenIds() {
      let self = this;
        
      console.log("tokenIds", self.tokenIds);
    },
  },
  async mounted() {
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
    this.loot = new this.web3.eth.Contract(
      abi,
      "0x7334120f91d35340C70AD9d229D3205e6C569433"
    );
    window.ethereum.on("networkChanged", (chainId) => {
      this.checkChain(chainId);
    });
    this.getImages();
  },
  methods: {
    getImages() {
      console.log('this.loot',this.loot);
      this.tokenIds.map((tokenId, i) => {
        this.loot.methods
          .tokenURI(tokenId)
          .call()
          .then((res) => {
            let data=JSON.parse(window.atob((res.slice(29))))
            this.images.push(data.image)
          });
      });
      console.log(this.images);
    },

    /**
     * @description claim a loot
     */
    claim() {
      let self = this;
      let tokenId = self.tokenId;
      if (tokenId) {
        self.loot.methods
          .claim(tokenId)
          .send({
            from: self.address,
          })
          .on("receipt", function (receipt) {
            self.$message({
              message: "Mint Success",
              type: "success",
            });
            let tokenIds = localStorage.getItem("tokenIds") || "[]";
            tokenIds = JSON.parse(tokenIds);
            tokenIds.push(tokenId);
            localStorage.setItem("tokenIds", JSON.stringify(tokenIds));
            self.tokenIds = tokenIds;
            
            self.getImages()
            console.log(receipt);
          })
          .on("error", function (error, receipt) {
            self.$message({
              message: error,
              type: "error",
            });
          });
      } else {
        self.$message({
          message: "Please Input TokenId",
          type: "error",
        });
      }
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
      console.log("当前chainId", chainId);
      if (chainId !== 4) {
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
