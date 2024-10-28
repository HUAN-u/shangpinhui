<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="cart in this.cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" :checked="cart.isChecked == 1" @change="updataChecked(cart,$event)">
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl">
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="handler('down', -1, cart)">-</a>
            <input autocomplete="off" type="text" minnum="1" class="itxt" :value="cart.skuNum"
              @change="handler('change', $event.target.value * 1, cart)">
            <a href="javascript:void(0)" class="plus" @click="handler('add', 1, cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuPrice * cart.skuNum }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deletecart(cart)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" @change="ShopChoose">
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deltetCheckShop">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>0</span>件商品
        </div>
        <div class="sumprice">
          <em>总价(不含运费): </em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <!-- 点击结算跳转到trade页面 -->
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import throttle from "lodash/throttle";
export default {
  name: 'shopcart',
  computed: {
    ...mapGetters(['shopcartlist']),
    //计算购物车的数据
    cartInfoList() {
      return this.shopcartlist.cartInfoList || [];
    },
    //计算总价
    totalPrice() {
      //总价=单价*数量
      //遍历数组，取出每组的单价和数量，进行求和
      let sum = 0;
      this.cartInfoList.forEach(item => {
        sum += item.skuPrice * item.skuNum
        console.log('shopcart中产品的数量', item.skuNum)
      });
      return sum
    },
  },
  mounted() {
    //购物车中有几个数据就展示几个数据，发送的请求次数比较多，因此使用this.getData()方法进行多次复用
    this.getShopCartData();
  },
  methods: {
    //获取个人购物车中的数据
    getShopCartData() {
      this.$store.dispatch('getShopCartList');
    },
    //修改某一个产品的个数 (使用throttle节流，防止高频时间发生)
    handler: throttle(async function (type, disnum, cart) {
      //handler绑定了3个地方 + - 用户输入
      //1、给这三个属性打标签，使其能分清点击的是谁，需要通过不同的参数来区分 type
      /*2、用什么来判断+1 -1？ 变化之后的数据  disnum
          点击- 传递-1，在页面中展示，-1后的值，在给服务器传递时，传递-1
          点击+ 传递1，在页面中展示，+1后的值，在给服务器传递时，传递+1
      */
      //3、cart 所要添加或删除产品的id，可以在数据库中精准修改,产品id在cartInfoList列表中
      //使用switch进行判断
      switch (type) {
        case 'add':
          disnum = 1;//带给服务器变换的量
          break;
        case 'down':
          //<1就不能再减了，直接=1
          // if (cart.skuNum > 1) { //修改后的数字是否小于修改前的，通过差值是否<-1 或者>1进行判断
          //   disnum = -1;
          // } else {
          //   disnum = 0;
          // }
          disnum = cart.skuNum > 1 ? -1 : 0;
          break;
        case 'change':
          if (isNaN(disnum || disnum < 1)) { //用户输入的是非法数据 例如1q 那么数据应该不变，而向服务器传递的数据应该是0，也就是disnum=0
            disnum = 0
          } else {
            disnum = parseInt(disnum) - cart.skuNum
          }
          break;
      }
      try {
        await this.$store.dispatch('addorUpdateShopCart', { skuId: cart.skuId, skuNum: disnum })
        this.getShopCartData();
      } catch (error) { }
    }, 500),
    //删除产品
    async deletecart(cart) {
      //获取 产品ID、数量、uuid
      //在此发请求，请求成功获取新的数据进行展示，请求失败，返回请求失败的信息
      try {
        await this.$store.dispatch('getShopDeleteList', cart.skuId);
        this.getShopCartData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改某一个产品的勾选状态
    async updataChecked(cart,event) {
      try {
        //如果修改成功，在此获取服务器数据
        let isChecked = event.target.checked? "1":"0";
        await this.$store.dispatch('getShopCheckCart',{ skuId:cart.skuId,isChecked });
        this.getShopCartData();
      } catch (error) {
        alert(error.message);
      }
      //带给服务器的isChecked参数不是布尔值，而是0或1
      // let isChecked = event.target.checked ? "1":"0";
      // if (event.target.checked) {
      //   return isChecked = 1;
      // } else {
      //   return isChecked = 0;
      // }
      // this.$store.dispatch('getShopCheckCart',{ skuId:cart.skuId,isChecked:isChecked })
      // console.log('请求发起失败',cart.skuId,isChecked)
    },
    //删除全部勾选的产品
    async deltetCheckShop(){
      try {
        //在此派发action,等待返回结果
        await this.$store.dispatch('getdeltetCheckShop');
        this.getShopCartData();
      } catch (error) {
        alert(error.message)
      }
      
    },
    //修改全选框的状态
    async ShopChoose(event){
      //判断当前全选状态是0是1,1全选0不全选
      let isChecked = event.target.checked?'1':'0';
      try {
        await this.$store.dispatch('getShopChoose',isChecked);
        this.getShopCartData();
      } catch (error) {
        alert(error.message)
      }
      //当我点击全选框时,派发一个action，获取当前购物车中的产品数据，在通过判断isChecked是0或1进行全选还是不全选
      // this.$store.dispatch('getShopChoose')
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;

        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>