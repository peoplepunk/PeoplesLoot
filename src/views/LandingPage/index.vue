<template>
  <div class="landingpage">
    <div class="container">
      <div class="subtitle">
        People's Punk is a next-gen social network co-sponsored by 173 genesis founders. <br><br>

$DDDD is the fractionalized token of Cryptopunk#173 meanwhile the social token of People's Punk community, which is a indicator that measures the social capital of this social network. <br><br>

People's Punk is also the name of Cryptopunk#173 


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
      tokenId: null,
      tokenIds: [],
      images: [],
      approved: false,
      dddd_address:"0x8ca9a0fbd8db501f013f2e9e33a1b9dc129a48e0",
      ppunk_address:"0x35c59B6b0a2415C5937C26e683784D15617046b3"
    };
  },
  props: ['web3'],
  watch: {},
  async mounted() {
    let self = this
    
    this.dddd = new this.web3.eth.Contract(
      ddddABI,
      self.dddd_address
    );
    this.punk = new this.web3.eth.Contract(
      abi,
      self.ppunk_address
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
    
    async checkAllowance() {
      let self = this
      if (!this.web3) return ;
      const allowance = await this.dddd.methods.allowance( this.address, self.ppunk_address).call()
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
          .approve(self.ppunk_address, self.web3.utils.toWei("100000000000000000").toString())
          .send({
            from: self.address,
          })
          .on("receipt", function (receipt) {
            self.$message({
              message: "Approve Success",
              type: "success",
            });

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
