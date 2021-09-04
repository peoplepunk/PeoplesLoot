<template>

    <div class="airdrop-page">
       
        <div v-if="!address" class="tips">Please connect your wallet</div>
        <div v-else class="container">
            <div class="nfts" v-loading="loading">
                <div class="item" v-for="item in list" :key="item.id">
                    <img class="img" :src="item.json.image" />
                    <h3>{{item.json.name}}</h3>
                    <button class="btn">Claim</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import claimabi from "@/assets/abi/gao.json";
    import merkledata from "@/assets/other/merkledata.json"

    import {
        range,
        flatten
    } from "lodash";
    import abi from "@/assets/abi/ddloot.json";
    import {
        CONTRACT_COINFIG
    } from "@/constants";

    export default {
        data() {
            return {
                list: [],
                loading: false,
                merkleDistributor: null

            };
        },
        props: ['web3', 'address'],
        watch: {
            address(value) {
                if (value) {
                    this.loadNFT()
                }
            }
        },
        async mounted() {
            this.loot = new this.web3.eth.Contract(abi, CONTRACT_COINFIG.LOOT);
            this.xloot = new this.web3.eth.Contract(abi, CONTRACT_COINFIG.XLOOT);
            this.ploot = new this.web3.eth.Contract(abi, CONTRACT_COINFIG.PLOOT);
            this.loadNFT()
            this.merkleDistributor = new this.web3.eth.Contract(
                claimabi,
                "0x03Ea00B0619e19759eE7ba33E8EB8E914fbF52Ea"
            );
        },
        async created() {
            let self = this
            await this.checkChain();
            window.ethereum.on("networkChanged", (chainId) => {
                this.checkChain(chainId);
            });
        },

        methods: {
            async loadNFT() {
                if (!this.address) {
                    return;
                }
                this.loading = true
                const list = flatten(await Promise.all([
                    this.loadLoot(this.loot),
                    this.loadLoot(this.xloot),
                    this.loadLoot(this.ploot),
                ]))
                this.list = list
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
            },
            claim(tokenId) {
                let self = this
                let account = self.address
                //这里需要一个服务获取proof
                console.log(account)
                let account_key = this.web3.utils.toChecksumAddress(
                    '0x' + ("" + this.web3.utils.toHex(tokenId)).slice(2).padStart(40, 0)
                )

                let m = merkledata.claims[account_key]
                console.log(m)
                let amount = parseInt(m.amount)
                let proof = m.proof
                let index = m.index
                console.log(index, account_key, amount, proof)
                //此处存在的问题是amount和proof的类型并不是uint(int)和bytes
                //                self.merkleDistributor.claim(index, account, amount, proof).then(res => {
                //                    console.log(res)
                //                })

            },
          
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
