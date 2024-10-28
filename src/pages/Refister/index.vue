<template>
  <div class="register-container">
    <!-- 注册内容 -->
    <div class="register">
      <h3>注册新用户
        <span class="go">我有账号，去 <a href="login.html" target="_blank">登陆</a>
        </span>
      </h3>
      <div class="content">
        <label>手机号:</label>
        <input placeholder="请输入你的手机号" v-model="phone" name="phone" v-validate="{ required: true, regex: /^1\d{10}$/ }"
          :class="{ invalid: errors.has('phone') }">
        <span class="error-msg">{{ errors.first("phone") }}错误提示信息</span>
      </div>
      <div class="content">
        <label>验证码:</label>
        <input placeholder="请输入验证码" v-model="code" name="code" v-validate="{ required: true, regex: /^1\d{6}$/ }"
          :class="{ invalid: errors.has('code') }">
        <span class="error-msg">{{ errors.first("code") }}错误提示信息</span>
        <button style="width: 100px; height: 38px;" @click="getcode(phone)">获取验证码</button>
      </div>
      <div class="content">
        <label>登录密码:</label>
        <input placeholder="请输入你的登录密码" v-model="password" name="password"
          v-validate="{ required: true, regex: /^[0-9A-Za-z]{8,20}$/ }" :class="{ invalid: errors.has('password') }">
        <span class="error-msg">{{ errors.first("password") }}错误提示信息</span>
      </div>
      <div class="content">
        <label>确认密码:</label>
        <input placeholder="请输入确认密码" v-model="password1" name="password1" v-validate="{ required: true, is:password }"
          :class="{ invalid: errors.has('password1') }">
        <span class="error-msg">{{ errors.first("password1") }}错误提示信息</span>
      </div>
      <div class="controls">
        <input type="checkbox" v-model="agree" name="agree" v-validate="{ required: true, 'tongyi': true }"
          :class="{ invalid: errors.has('agree') }">
        <span>同意协议并注册《尚品汇用户协议》</span>
        <span class="error-msg">{{ errors.first("agree") }}错误提示信息</span>
      </div>
      <div class="btn">
        <button @click="getPhoneCodePasswd">完成注册</button>
      </div>
    </div>

    <!-- 底部 -->
    <div class="copyright">
      <ul>
        <li>关于我们</li>
        <li>联系我们</li>
        <li>联系客服</li>
        <li>商家入驻</li>
        <li>营销中心</li>
        <li>手机尚品汇</li>
        <li>销售联盟</li>
        <li>尚品汇社区</li>
      </ul>
      <div class="address">地址：北京市昌平区宏福科技园综合楼6层</div>
      <div class="beian">京ICP备19006430号
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Register',
  data() {
    return {
      //定义手机号
      phone: '',
      code: '',
      password: '',
      password1: '',
      agree: true
    }
  },
  methods: {
    //派发action，获取验证码
    async getcode(phone) {
      if (phone) {
        await this.$store.dispatch("getCode", phone)
        this.code = this.$store.state.refister.code
      } else {
        alert("请输入必填手机号:")
      }
    },
    //获取用户的手机号、验证码、密码，来判断是否注册成功
    async getPhoneCodePasswd() {
      //确认所有的输入都正确才会发起请求
      const success = await this.$validator.validateAll();
      if (success) {
        try {
          const { phone, code, password, password1 } = this;
          await this.$store.dispatch('getRegisterData', { phone, code, password });
          this.$router.push({ name: 'login' })
        } catch (error) {
          console.log(error.message);
        }
      }
      //收集手机号、验证码、密码
      //const { phone, code, passwd, passwd1 } = this; 这句话是对象解构赋值的语法，用来从 this 对象中提取特定的属性，并将它们赋值给变量 phone、code、passwd 和 passwd1。
      // try {
      //   //如果注册成功，跳转路由到登录页面
      //   console.log('111')
      //   const { phone, code, password, password1 } = this;
      //   // if (phone) {
      //   //   if (code) {
      //   //     if (password == password1) {
      //   //       //如果两次密码一样，则成功注册
      //   //       //完成上面三次判断才能完成注册，有一个不通过，则完成不了
      //   //       //上面三次验证成功之后，发起请求将数据交给服务器，接着在完成路由跳转
      //   //       await this.$store.dispatch('getRegisterData', { phone, code, password });
      //   //       this.$router.push('/login')
      //   //     }
      //   //   }
      //   // }
      //   (phone&&code&& password==password1) && await this.$store.dispatch('getRegisterData', { phone, code, password });
      //   this.$router.push({name:'login'})
      // } catch (error) {
      //   //如果注册失败，跳转路由到登录页面
      //   console.log(error.message);
      // }
    }
  }
}
</script>

<style lang="less" scoped>
.register-container {
  .register {
    width: 1200px;
    height: 445px;
    border: 1px solid rgb(223, 223, 223);
    margin: 0 auto;

    h3 {
      background: #ececec;
      margin: 0;
      padding: 6px 15px;
      color: #333;
      border-bottom: 1px solid #dfdfdf;
      font-size: 20.04px;
      line-height: 30.06px;

      span {
        font-size: 14px;
        float: right;

        a {
          color: #e1251b;
        }
      }
    }

    div:nth-of-type(1) {
      margin-top: 40px;
    }

    .content {
      padding-left: 390px;
      margin-bottom: 18px;
      position: relative;

      label {
        font-size: 14px;
        width: 96px;
        text-align: right;
        display: inline-block;
      }

      input {
        width: 270px;
        height: 38px;
        padding-left: 8px;
        box-sizing: border-box;
        margin-left: 5px;
        outline: none;
        border: 1px solid #999;
      }

      img {
        vertical-align: sub;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .controls {
      text-align: center;
      position: relative;

      input {
        vertical-align: middle;
      }

      .error-msg {
        position: absolute;
        top: 100%;
        left: 495px;
        color: red;
      }
    }

    .btn {
      text-align: center;
      line-height: 36px;
      margin: 17px 0 0 55px;

      button {
        outline: none;
        width: 270px;
        height: 36px;
        background: #e1251b;
        color: #fff !important;
        display: inline-block;
        font-size: 16px;
      }
    }
  }

  .copyright {
    width: 1200px;
    margin: 0 auto;
    text-align: center;
    line-height: 24px;

    ul {
      li {
        display: inline-block;
        border-right: 1px solid #e4e4e4;
        padding: 0 20px;
        margin: 15px 0;
      }
    }
  }
}
</style>