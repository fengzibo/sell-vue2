<template>
  <span class="iconMap" :class="classMap[iconType]"></span>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styl/mixin.styl"
  .iconMap
    display inline-block
    vertical-align top
    width 16px
    height 16px
    background-size 100% 100%
    background-repeat no-repeat
    &.decrease
      bg-image('decrease_3')
    &.discount
      bg-image('discount_3')
    &.guarantee
      bg-image('guarantee_3')
    &.invoice
      bg-image('invoice_3')
    &.special
      bg-image('special_3')
</style>
<script type="text/ecmascript-6">
  export default {
    props: {
      iconType: Number
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    }
  };
</script>
