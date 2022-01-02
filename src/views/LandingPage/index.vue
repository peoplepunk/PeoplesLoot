<template>
  <div class="landingpage">
    <div class="container">
      <div class="subtitle">
        There was one maverick punk girl, in order to show the world what real Punk was, she sacrificed herself to the God. Her body was gone, but her fiery spirit remained and became the Goddess of Punk. 173 trailblazers were inspired by her deed and swore to be her first apostles. They called themselves the People's Punks and devoted their lives proselytizing. The Word called on them from all over the world to assemble in the Punk Valley. They established the Punk Camp, and, with the Spirit of the Goddess of Punk, forged invaluable weapons, armors, and other items, to which the name the pLOOT was given.
      </div>
      <div class="btn-group">
        <button class="btn" v-if="!approved" @click="approve()">Approve</button>
        <button class="btn" v-if="approved" @click="mint()">Mint</button>
      </div>
    </div>
  </div>
</template>
<script>
import abi from "@/assets/abi/ddloot.json";
import ddddABI from "@/assets/abi/dddd.json";
import punkABI from "@/assets/abi/punk.json";

export default {
  data() {
    return {
      address: null,
      chainId: null,
      loot: null,
      tokenId: null,
      tokenIds: [],
      images: [],
      approved: false,
      dddd_address:"0x8ca9a0fbd8db501f013f2e9e33a1b9dc129a48e0"
    };
  },
  props: ['web3'],
  watch: {},
  async mounted() {
    this.loot = new this.web3.eth.Contract(
      abi,
      "0x03Ea00B0619e19759eE7ba33E8EB8E914fbF52Ea"
    );
    this.dddd = new this.web3.eth.Contract(
      ddddABI,
      "0x72Ba53EC08d9A16882935F222AB1DC7f29365203"
    );
    this.punk = new this.web3.eth.Contract(
      punkABI,
      "0x35c59B6b0a2415C5937C26e683784D15617046b3"
    );
    await this.connect()
    this.checkAllowance()
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
    async checkAllowance() {
      if (!this.web3) return ;
      const allowance = await this.dddd.methods.allowance( this.address, this.dddd_address).call()
      const allowanceBN = new this.web3.utils.BN(allowance)
      const required = new this.web3.utils.BN(this.web3.utils.toWei('10000'))
     
      if (required.lt(allowanceBN)) {
        this.approved = true
      } else {
        this.approved = false
      }
      console.log('allowance', allowance)
    },
    approve() {
      let self = this;
        self.dddd.methods
          .approve(self.dddd_address, self.web3.utils.toWei("10000000").toString())
          .send({
            from: self.address,
          })
          .on("receipt", function (receipt) {
            self.$message({
              message: "Approve Success",
              type: "success",
            });
//            let tokenIds = localStorage.getItem("tokenIds") || "[]";
//            tokenIds = JSON.parse(tokenIds);
//            tokenIds.push(tokenId);
//            localStorage.setItem("tokenIds", JSON.stringify(tokenIds));
//            self.tokenIds = tokenIds;
//            setTokenIds()
//            self.getImages()
            this.checkAllowance()
            console.log(receipt);
          })
          .on("error", function (error, receipt) {
            self.$message({
              message: error,
              type: "error",
            });
          });
    },
    /**
     * @description mint a nft
     */
    mint() {
      let self = this;
        self.punk.methods
          .mintNFT()
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
      console.log('address', accounts)
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
      console.log("chainId", chainId);
      if (chainId !== 1) {
        this.$message({
          message: "Please switch MainNet",
          type: "error",
        });
      }

    },
  },
};
</script>
<style lang='less' scoped>
@import "./style.less";
</style>
