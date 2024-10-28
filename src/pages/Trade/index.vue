<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <h5 class="receive">收件人信息</h5>
      <div class="address clearFix" v-for="user in useraddress" :key="user.id">
        <span class="username" :class="{ selected: user.isDefault == 1 }">{{ user.consignee }}</span>
        <p @click="changDefault(user, useraddress)">
          <!-- 点击谁 展示谁的信息 -->
          <span class="s1">{{ user.fullAddress }}</span>
          <span class="s2">{{ user.phoneNum }}</span>
          <span class="s3" v-show="user.isDefault == 1">{{ user.userAddress }}</span>
        </p>
      </div>
      <div class="line"></div>
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username " style="margin-left:5px;">货到付款</span>

      </div>
      <div class="line"></div>
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <div class="detail">
        <h5>商品清单</h5>
        <ul class="list clearFix" v-for="detail in detailArrayList" :key="detail.skuId">
          <li>
            <img :src="detail.imgUrl" style="width: 50px; height: 50px;">
          </li>
          <li>
            <p>{{ detail.skuName }}</p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{ detail.orderPrice }}.00</h3>
          </li>
          <li>X{{ detail.skuNum }}</li>
          <li>有货</li>
        </ul>
      </div>
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea placeholder="建议留言前先与商家沟通确认" class="remarks-cont" v-model="message"></textarea>
      </div>
      <div class="line"></div>
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <div class="money clearFix">
      <ul>
        <li>
          <b>共<i>{{ gettradelist.totalNum }}</i>件商品，总商品金额</b>
          <span>¥{{ gettradelist.totalAmount }}.00</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <div class="trade">
      <div class="price">应付金额:　<span>¥{{ gettradelist.totalAmount }}.00</span></div>
      <div class="receiveInfo">
        寄送至:
        <span>{{ useNameAddress.fullAddress }}</span>
        收货人：<span>{{ useNameAddress.consignee }}</span>
        <span>{{ useNameAddress.phoneNum }}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <a class="subBtn" @click="SubmitOrder">提交订单</a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'trade',
  data() {
    return {
      //留言信息
      message: '',
      //提交订单的结果信息,订单号信息
      orderId:'',

    }
  },
  /**
   *
    orderPrice: 2424
    skuId: 21
    skuName:"vivo S10 5G手机 8GB+256GB 青柠 超轻薄机身  6nm旗舰芯片 拍照手机 青色"
    skuNum: 3
    imgUrl
   */
  computed: {
    ...mapGetters(['detailArrayList']),
    ...mapState({
      useraddress: state => state.trade.useraddress,
      gettradelist: state => state.trade.gettradelist
    }),
    //提交时发送的地址和用户名
    useNameAddress() {
      return this.useraddress.find(item => item.isDefault == 1) || []
    },
  },
  //使用声明周期函数，在挂载时直接调用
  mounted() {
    this.$store.dispatch('getUserAddress');
    this.$store.dispatch('getTradeInfo');
  },
  methods: {
    changDefault(user, useraddress) {
      //展示默认地址，点击谁展示谁的默认地址
      //在上面写了谁=1，就把样式添加给谁
      //下面的表达了，上来点击的时候把全部的状态都变成0(0:全都不展示)，只给你点击的那一个置为1(1:表示展示)
      useraddress.forEach(item => {
        item.isDefault = 0
      });
      user.isDefault = 1
    },
    //提交订单
    async SubmitOrder() {
      // 在工作中，有vuex使用vuex，没有vuex使用this,$API的方式引入
      //在此发起请求。获取提交订单的数据,需要带有参数
      //参数一 交易编码
      let { tradeNo } = this.gettradelist;
      //其余的6个参数
      let data = {
        "consignee": this.useraddress.consignee, //用户名字
        "consigneeTel": this.useraddress.phoneNum, //用户手机号
        "deliveryAddress": this.useraddress.fullAddress, //用户地址
        "paymentWay": "ONLINE", //支付方式
        "orderComment": this.message, //留言信息
        "orderDetailList":this.detailArrayList //将要提交的商品列表信息
      }
      let result = await this.$API.reqSubmitOrder(tradeNo,data); //请求发起之后需要接收返回数据，使用await和ansync接收
      console.log('订单返回结果',result);
      /**
       * result 返回的结果
       * code: 200
        data: 17407
        message: "成功"
        ok: true
       */
      if (result.code == 200) { //表示提交成功，然后代参进行路由跳转
        //没有commit提交数据，我们需要写一个数据进行保存返回的结果
        this.orderId = result.data;
        this.$router.push('/pay?orderid='+ this.orderId); //带一个query参数
      } else {
        //如果提交失败，返回提交失败的信息
        console.log('提交失败',result.data);
      }
    }
  },
}
</script>

<style lang="less" scoped>
.trade-container {
  .title {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 21px;
  }

  .content {
    width: 1200px;
    margin: 10px auto 0;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    box-sizing: border-box;

    .receive,
    .pay {
      line-height: 36px;
      margin: 18px 0;
    }

    .address {
      padding-left: 20px;
      margin-bottom: 15px;

      .username {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        position: relative;
      }

      .username::after {
        content: "";
        display: none;
        width: 13px;
        height: 13px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url(./images/choosed.png) no-repeat;
      }

      .username.selected {
        border-color: #e1251b;
      }

      .username.selected::after {
        display: block;
      }

      p {
        width: 610px;
        float: left;
        line-height: 30px;
        margin-left: 10px;
        padding-left: 5px;
        cursor: pointer;

        .s1 {
          float: left;

        }

        .s2 {
          float: left;
          margin: 0 5px;
        }

        .s3 {
          float: left;
          width: 56px;
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          background-color: #878787;
          color: #fff;
          margin-top: 3px;
          text-align: center;
        }
      }

      p:hover {
        background-color: #ddd;
      }
    }

    .line {
      height: 1px;
      background-color: #ddd;
    }

    .way {
      width: 1080px;
      height: 110px;
      background: #f4f4f4;
      padding: 15px;
      margin: 0 auto;

      h5 {
        line-height: 50px;
      }

      .info {
        margin-top: 20px;

        .s1 {
          float: left;
          border: 1px solid #ddd;
          width: 120px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-right: 10px;
        }

        p {
          line-height: 30px;
        }
      }
    }

    .detail {
      width: 1080px;

      background: #feedef;
      padding: 15px;
      margin: 2px auto 0;

      h5 {
        line-height: 50px;
      }

      .list {
        display: flex;
        justify-content: space-between;

        li {
          line-height: 30px;

          p {

            margin-bottom: 20px;
          }

          h4 {
            color: #c81623;
            font-weight: 400;
          }

          h3 {

            color: #e12228;
          }
        }
      }
    }

    .bbs {
      margin-bottom: 15px;

      h5 {
        line-height: 50px;
      }

      textarea {
        width: 100%;
        border-color: #e4e2e2;
        line-height: 1.8;
        outline: none;
        resize: none;
      }
    }

    .bill {
      h5 {
        line-height: 50px;
      }

      div {
        padding-left: 15px;
      }
    }
  }

  .money {
    width: 1200px;
    margin: 20px auto;

    ul {
      width: 220px;
      float: right;

      li {
        line-height: 30px;
        display: flex;
        justify-content: space-between;

        i {
          color: red;
        }
      }
    }
  }

  .trade {
    box-sizing: border-box;
    width: 1200px;
    padding: 10px;
    margin: 10px auto;
    text-align: right;
    background-color: #f4f4f4;
    border: 1px solid #ddd;

    div {
      line-height: 30px;
    }

    .price span {
      color: #e12228;
      font-weight: 700;
      font-size: 14px;
    }

    .receiveInfo {
      color: #999;
    }
  }

  .sub {
    width: 1200px;
    margin: 0 auto 10px;

    .subBtn {
      float: right;
      width: 164px;
      height: 56px;
      font: 700 18px "微软雅黑";
      line-height: 56px;
      text-align: center;
      color: #fff;
      background-color: #e1251b;

    }
  }

}
</style>