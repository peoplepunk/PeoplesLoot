<template>
    <div class="landingpage">




        <div class="container">

            <div class="logo-block">


                <img class="icon svg-tiktok" src="../../assets/image/dddd.svg" alt="">

                <div>People's Loot</div>
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
export default {
    data(){
        return {}
    },
    methods:{
        buidl(){
            this.$message({
          message: 'Buidling',
          type: 'warning'
        });
        }
    }
}</script>
<style lang='less'>


    html {
        background-color: black;
        background-color: #111;
        width: 18.75rem;
        margin:0.8rem;
        box-sizing: border-box;
    }


    .landingpage {
        width:100%;
        height: 100vh;
        max-width:40rem;
        margin:0px auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;

        .btn {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 2rem;
            color: #ffffff;
            display: inline-block;
            font-size: 1rem;
            letter-spacing: 2px;
            margin: 0.5rem;
            overflow: hidden;
            position: relative;
            padding: 12px 36px;
            text-decoration: none;
            cursor: pointer;
        }

        .subtitle {
            width: 800px;
            text-align: center;
            color: white;
            font-size: 1rem;
            margin-bottom: 1rem;
        }

        .logo-block {
            justify-content: center;
            font-size: 28px;
            line-height: 6rem;
            font-family: "Trebuchet MS", sans-serif;
            color: #fff;
            animation: shaking .3s steps(6, end) infinite;
            white-space: nowrap;
            mix-blend-mode: screen;
            margin-bottom: 20px;

            .svg-tiktok {
                fill: #fff;
                width: 5rem;
/*                height: 6rem;*/
                transform: translateY(2rem);
            }
        }
    }





    @keyframes shaking {
        0% {
            filter: drop-shadow(3px 3px 0px #0ff) drop-shadow(-3px -3px 0px #f00);
            transform: translate(1px, 1px);
        }

        20% {
            filter: drop-shadow(-3px 3px 0px #0ff) drop-shadow(3px -3px 0px #f00);
            transform: translate(-2px, 1px);
        }

        40% {
            filter: drop-shadow(3px -3px 0px #0ff) drop-shadow(3px -3px 0px #f00);
            transform: translate(1px, -1px);
        }

        60% {
            filter: drop-shadow(-3px -3px 0px #0ff) drop-shadow(3px 3px 0px #f00);
            transform: translate(-1px, -1px);
        }

        80% {
            filter: drop-shadow(-2px 3px 0px #0ff) drop-shadow(-3px 2px 0px #f00);
            transform: translate(2px, 0px);
        }

        100% {
            filter: drop-shadow(-3px 1px 0px #0ff) drop-shadow(1px -3px 0px #f00);
            transform: translate(1px, 1px);
        }
    }

    

    @keyframes animate {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }

</style>
