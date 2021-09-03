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
                <input type="text" v-model='tokenId' placeholder="Please input tokenId">
                <div class="btn" @click="claim">Claim People's Loot</div>

            </div>
            <div class="bottom-group">
<!--               这个地方展示image list-->
                <div v-for="x in tokenIds">
                   <img :src="getImage(x)" alt="">
                </div>
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
                tokenIds: []
            };
        },
        created() {
            let self = this
            let tokenIds = localStorage.getItem('tokenIds') || "[]"
            tokenIds = JSON.parse(tokenIds)
            self.tokenIds = tokenIds
        },
        watch:{
            tokenIds(){
                let self = this
                console.log("tokenIds",self.tokenIds)
            }
        },
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
                "0x18aE59Bb86a1a5460629c9C837038D878df76458"
            );
            window.ethereum.on("networkChanged", (chainId) => {
                this.checkChain(chainId);
            });
        },
        methods: {
            getImage(tokenId){
                let self = this
               let image =  self.loot.methods.tokenURI(tokenId).call().then(res=>{
                   console.log(res)
               })
            },
           
            /**
             * @description claim a loot
             */
            claim() {
                let self = this
                let tokenId = self.tokenId
                if (tokenId) {
                    self.loot.methods
                        .claim(tokenId)
                        .send({
                            from: self.address
                        })
                        .on("receipt", function(receipt) {
                            self.$message({
                                message: "Mint Success",
                                type: "success",
                            });
                            let tokenIds = localStorage.getItem('tokenIds') || "[]"
                            tokenIds = JSON.parse(tokenIds)
                            tokenIds.push(tokenId)
                            localStorage.setItem('tokenIds', JSON.stringify(tokenIds))
                            self.tokenIds = tokenIds
                            console.log(receipt);
                        })
                        .on("error", function(error, receipt) {
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
                console.log('当前chainId', chainId)
                if (chainId !== 5) {
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
