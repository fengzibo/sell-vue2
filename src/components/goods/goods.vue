<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text">
            <iconMap v-show="item.type>0" :iconType="item.type"></iconMap>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="sellCount">月售{{food.sellCount}}份</span>
                  <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="newPrice"><span class="unit">￥</span>{{food.price}}</span>
                  <span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :delivery-price="seller.deliverPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
  </div>
</template>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/styl/mixin"
  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        line-height 14px
        padding 0 12px
        &.current
          position relative
          background white
          font-weight 700
          margin-top -1px
        .text
          display table-cell
          vertical-align middle
          font-size 12px
          font-weight 200
          white-space normal
          line-height 14px
          .iconMap
            vertical-align middle
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background-color #f3f5f7
      .food-item
        display flex
        margin 0 18px
        padding 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          padding-bottom 0
        .icon
          flex 0 0 57px
        .content
          flex 1
          padding-left 10px
          h2
            margin 2px 0 8px 0
            font-size 14px
            line-height 14px
            height 14px
            font-weight 700
            color rgb(7, 17, 27)
          .extra, .desc
            font-size 10px
            color rgb(147, 153, 159)
            line-height 10px
            .sellCount
              margin-right 4px
          .desc
            font-size 10px
            margin-bottom 8px
            line-height: 12px
          .price
            font-size 10px
            font-weight 700
            line-height 24px
            .newPrice
              font-size 14px
              color rgb(240, 20, 20)
              .unit
                font-size 10px
                font-weight normal
            .oldPrice
              text-decoration line-through
              color rgb(147, 153, 159)
              padding-left 4px
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom 12px
            z-index 20
</style>
<script type="text/ecmascript-6">
  import iconMap from 'components/iconMap/iconMap';
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopCart/shopCart';
  import cartcontrol from 'components/cartControl/cartControl';
  import Vue from 'vue';
  const ERR_OK = 0;
  const eventHub = new Vue();
  export default {
    props: {
      seller: Object
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
      this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll(); // 初始化scroll
            this._calculateHeight(); // 初始化列表高度
          });
        }
      });
    },
    methods: {
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.querySelectorAll('.food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        }
        this.foodsScroll.scrollTo(0, -this.listHeight[index], 300);
      }
    },
    components: {
      iconMap,
      shopcart,
      cartcontrol
    }
  };
</script>
