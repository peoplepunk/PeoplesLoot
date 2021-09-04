<template>
    <div class="landingpage">
        <div class="container">
            <div class="bottom-group">
                <button @click="claim">test</button>
            </div>
        </div>
    </div>
</template>
<script>
    import claimabi from "@/assets/abi/gao.json";
    import merkledata from "@/assets/other/merkledata.json"

    function padding1(num, length) {
        for (var len = (num + "").length; len < length; len = num.length) {
            num = "0" + num;
        }
        return num;
    }
    export default {
        data() {
            return {
                address: null,
                merkleDistributor: null
            };
        },
        props: ['web3'],
        async created() {
            let self = this
            this.setAddress();
            await this.checkChain();
            window.ethereum.on("networkChanged", (chainId) => {
                this.checkChain(chainId);
            });
        },
        async mounted() {
            this.merkleDistributor = new this.web3.eth.Contract(
                claimabi,
                "0x03Ea00B0619e19759eE7ba33E8EB8E914fbF52Ea"
            );
        },

        methods: {
            claim(tokenId) {
                let self = this
                let account = self.address
                //这里需要一个服务获取proof
                console.log(account)
                let account_key = this.web3.utils.toChecksumAddress(
                    '0x' + (""+this.web3.utils.toHex(tokenId)).slice(2).padStart(40, 0)
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
                        message: "Please switch MainNet",
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
