<template>
  <div class="landingpage">
    <div class="container">
      <div class="subtitle">
        There was one maverick punk girl, in order to show the world what real Punk was, she sacrificed herself to the God. Her body was gone, but her fiery spirit remained and became the Goddess of Punk. 173 trailblazers were inspired by her deed and swore to be her first apostles. They called themselves the People's Punks and devoted their lives proselytizing. The Word called on them from all over the world to assemble in the Punk Valley. They established the Punk Camp, and, with the Spirit of the Goddess of Punk, forged invaluable weapons, armors, and other items, to which the name the pLOOT was given.
      </div>
      <div class="btn-group">
<!--
        <input
          type="text"
          v-model="tokenId"
          placeholder="Please input tokenId"
        />
-->
        <button class="btn" disabled="disabled" @click="claim()">Claim pLOOT</button>
      </div>
    </div>
  </div>
</template>
<script>
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
  props: ['web3'],
  watch: {},
  async mounted() {
    this.loot = new this.web3.eth.Contract(
      abi,
      "0x03Ea00B0619e19759eE7ba33E8EB8E914fbF52Ea"
    );
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
  },
};
</script>
<style lang='less' scoped>
@import "./style.less";
</style>
