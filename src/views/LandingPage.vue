<template>
    <div class="landingpage">




        <div class="container">

            <div class="logo-block">


                <img class="icon svg-tiktok" src="../assets/image/dddd.svg" alt="">

                <div>People's Loot</div>
            </div>

            <div class="subtitle">
                People's Loot is randomized adventurer gear generated and stored on chain. Stats, images, and other functionality are intentionally omitted for others to interpret.

                Feel free to use Loot in any way you want.
            </div>
            <div class="btn" @click="buidl"> Mint People's Loot</div>




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
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    html {
        font-size: 62.5%;
    }

    body {
        font-size: 1.6rem;
        background-color: #111;
        position: relative;
    }

    .landingpage {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: black;
        text-align: center;

        .btn {
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 40px;
            color: #ffffff;
            display: inline-block;
            font-size: 18px;
            letter-spacing: 2px;
            margin: 10px;
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
            font-size: 20px;
            margin-bottom: 20px
        }

        .logo-block {
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
                width: 8rem;
                height: 8rem;
                transform: translateY(1.5rem);
            }
        }
    }





    @keyframes shaking {
        0% {
            /* Using filter cause text-shadow doesn't support svgs */
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

    .btn {}

    a {}

    /*

    span {
        animation: animate 1s linear infinite;
        background-color: #ffffff;
        border-radius: 50%;
        height: 500px;
        opacity: 0.2;
        pointer-events: none;
        position: absolute;
        transform: translate(-50%, -50%) scale(0);
        width: 500px;
    }
*/

    @keyframes animate {
        to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }

</style>
