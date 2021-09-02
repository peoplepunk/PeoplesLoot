<template>
    <div class="landingpage">
        <div class="wallet">
            <div v-if='address' class='addr'>
                Wallet {{getAddr(address)}}
            </div>
            <div v-else>
                点击连接Metamask
            </div>
        </div>
        <div class="container">

            <div class="logo-block">
                <img class="icon svg-tiktok" src="../../assets/image/dddd.svg" alt="">
                <div class='name'>People's Loot</div>
            </div>
            <div class="subtitle">
                People's Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret.

                Feel free to use Loot in any way you want.
            </div>
            <div class="btn" @click="buidl">Mint People's Loot</div>
        </div>
    </div>
</template>
<script>
    import Web3 from 'web3'
    import abi from '@/assets/abi/ddloot.json';
    export default {
        data() {
            return {
                address: "",
                chainId: 0,
            loot:null,
            }
        },
        created() {
            let self = this
        },
        async mounted() {
            let self = this
            var web3Provider;
            if (window.ethereum) {
                web3Provider = window.ethereum;
                try {
                    // 请求用户授权
                    await window.ethereum.enable();
                } catch (error) {
                    //用户不授权时，这里处理异常情况，同时可以设置重试等机制
                    console.log(error)
                }
            } else if (window.web3) { // 老版 MetaMask Legacy dapp browsers...
                web3Provider = window.web3.currentProvider;
            } else {
                self.$message({
                    message: '请在metamask环境使用',
                    type: 'error'
                });
            }
            this.web3 = new Web3(web3Provider);
            let address = await self.web3.eth.getCoinbase()
            let chainId = await self.web3.eth.getChainId()
            console.log("获取账户地址Coinbase", address, chainId)
            self.chainAlert(chainId)

            self.address = address
            self.chainId = chainId
            window.ethereum.on("networkChanged", chainId => {
                self.chainAlert(chainId)
            })
            self.loot = new self.web3.eth.Contract(abi, "0xf1d07f1475a4264AA90408c62bb8b04ab3706362")
            console.log(self.loot)
        },
        methods: {
            buidl() {
                this.$message({
                    message: 'Buidling',
                    type: 'warning'
                });
            },
            getAddr(addr) {
                let self = this
                return `${addr.slice(0,5)}...${addr.substr(addr.length-5, 5)}`
            },
            chainAlert(id) {
                if (id != 3) {
                    self.$message({
                        message: '请切换到Rposten环境',
                        type: 'error'
                    });
                }
            }
        }
    }

</script>
<style lang='less'>
    @import './style.less';

</style>
