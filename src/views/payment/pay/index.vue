<template>
    <div class="pay-warppe">
        <div class="content">
             需支付：
            <span class="amount">100.00</span>
            <label class="col">
                 （含手续费：<span class="charge">4.70</span>）
            </label>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style lang="less" scoped>
    .pay-warppe{
        .content {
            padding: 0.14rem 0.15rem 0.36rem;
            font-size: 0.16rem;
            color: #333;
            background: #fff url('../../../assets/images/title_bg.png') repeat-x 0
            bottom;
            background-size: auto 0.15rem;
            .amount {
                font-size: 0.18rem;
                color: #ee3f44;
            }
            .col {
                font-size: 0.12rem;
                color: #999;
                .charge {
                    color: #ee3f44;
                }
            }
        }
    }
</style>



