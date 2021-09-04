<template>
  <div class="airdrop-page">
    <div v-if="!address" class="tips">Please connect your wallet</div>
    <div v-else class="container">
      <div class="nfts"  v-loading="loading">
        <div class="item" v-for="item in list" :key="item.id">
          <img class="img" :src="item.json.image"/>
          <h3>{{item.json.name}}</h3>
          <button class="btn">Claim</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { range, flatten } from "lodash";
import abi from "@/assets/abi/ddloot.json";
import { CONTRACT_COINFIG } from "@/constants";

export default {
  data() {
    return {
      list: [],
      loading: false
    };
  },
  props: ['web3', 'address'],
  watch: {
    address(value) {
      if(value) {
        this.loadNFT()
      }
    }
  },
  async mounted() {
    this.loot = new this.web3.eth.Contract(abi, CONTRACT_COINFIG.LOOT);
    this.xloot = new this.web3.eth.Contract(abi, CONTRACT_COINFIG.XLOOT);
    this.ploot = new this.web3.eth.Contract(abi, CONTRACT_COINFIG.PLOOT);
    this.loadNFT()
  },
  methods: {
    async loadNFT() {
      if(!this.address) {
        return;
      }
      this.loading = true
      const list = flatten(await Promise.all([
        this.loadLoot(this.loot),
        this.loadLoot(this.xloot),
        this.loadLoot(this.ploot),
      ]))
      this.list =list
      this.loading = false
    },
    async loadLoot(contract) {
      const address = this.address
      const count = await contract.methods.balanceOf(address).call()
      console.log(count);
      const arr = range(count)
      const list = (await Promise.all(arr.map(async (index) => {
        console.log(index, address);
        const id = await contract.methods.tokenOfOwnerByIndex(address, index).call()
        const uri = await contract.methods.tokenURI(id).call()
        const json = JSON.parse(window.atob(uri.replace('data:application/json;base64,', '')))
        return {
          id,
          json
        }
      })));
      return list
    }
  },
};
</script>
<style lang='less' scoped>
@import "./style.less";
</style>
