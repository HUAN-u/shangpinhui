<template>
    <!-- 头部 -->
    <header class="header">
        <!-- 头部的第一行 -->
        <div class="top">
            <div class="container">
                <div class="loginList">
                    <p>尚品汇欢迎您！</p>
                    <p v-if="!userName"> 
                        <!-- v-if="!userName  判断userName是否存在，存在则改变为用户信息，不存在则不改变-->
                        <span>请</span>
                        <router-link to="/login">登录</router-link>
                        <router-link to="/refister" class="register">免费注册</router-link>
                    </p>
                    <p v-else>
                        <a>{{ userName }}</a>
                        <a class="register" @click="getLogout">退出登录</a>
                    </p>
                </div>
                <div class="typeList">
                    <router-link to="/center/myorder">我的订单</router-link>
                    <router-link to="/center/grouporder">我的购物车</router-link>
                    <a href="###">我的尚品汇</a>
                    <a href="###">尚品汇会员</a>
                    <a href="###">企业采购</a>
                    <a href="###">关注尚品汇</a>
                    <a href="###">合作招商</a>
                    <a href="###">商家后台</a>
                </div>
            </div>
        </div>
        <!--头部第二行 搜索区域-->
        <div class="bottom">
            <h1 class="logoArea">
                <router-link class="logo" title="尚品汇" to="/home" target="_blank">
                    <img src="./inages/logo.png" alt="">
                </router-link>
            </h1>
            <div class="searchArea">
                <form action="###" class="searchForm">
                    <input type="text" id="autocomplete" class="input-error input-xxlarge" v-model="keyword" />
                    <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch">搜索</button>
                </form>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            keyword: ''
        }
    },
    methods: {
        //当点击搜索按钮时，跳转到search路由中
        goSearch() {
            //第一种传参  字符串传参 ”“ + ”“ 这种形式
            // this.$router.push('/search/' + this.keyword + '?k=' + this.keyword.toUpperCase())   //this.keyword[params参数]  '?k=' [query参数]
            //第二种传参  模版字符串传参 ` ` 这种形式
            //简写 注意上双引号
            // this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)
            // 第三种传参 对象传参
            // this.$router.push({
            //     name:"search",
            //     params:{keyword:this.keyword || undefined}
            // })
            if (this.$route.query) {
                let location = { name: "search", params: { keyword: this.keyword || undefined } }
                location.query = this.$route.query
                this.$router.push(location)
                // console.log('a',location)   //name: "search", params: keyword: "华为",query:{}
            }
        },
        //获取退出登录的用户信息,仓库不需要知道是否成功退出，但是用户需要知道是否成功退出
        async getLogout(){
            try {
                //退出成功后，
                //1.需要清空用户信息
                //2.继续跳转到home首页
                await this.$store.dispatch('getLogoutInfo')
                this.$router.push({name:'home'})
            } catch (error) {
                alert(error.message)
            }
        }
    },
    mounted() {
        //通过全局事件总线清楚关键字
        this.$bus.$on("clear", () => {  // ()=>{} 返回一个回调函数，函数内部就是需要处理的问题
            this.keyword = '';
            console.log("header中的keyword数据已被置空")
        })
    },
    computed: {
        //计算得到用户信息
        userName(){
            return this.$store.state.refister.usermessage.name
        }
    }
};
</script>

<style scoped lang="less">
.header {
    &>.top {
        background-color: #eaeaea;
        height: 30px;
        line-height: 30px;

        .container {
            width: 1200px;
            margin: 0 auto;
            overflow: hidden;

            .loginList {
                float: left;

                p {
                    float: left;
                    margin-right: 10px;

                    .register {
                        border-left: 1px solid #b3aeae;
                        padding: 0 5px;
                        margin-left: 5px;
                    }
                }
            }

            .typeList {
                float: right;

                a {
                    padding: 0 10px;

                    &+a {
                        border-left: 1px solid #b3aeae;
                    }
                }

            }

        }
    }

    &>.bottom {
        width: 1200px;
        margin: 0 auto;
        overflow: hidden;

        .logoArea {
            float: left;

            .logo {
                img {
                    width: 175px;
                    margin: 25px 45px;
                }
            }
        }

        .searchArea {
            float: right;
            margin-top: 35px;

            .searchForm {
                overflow: hidden;

                input {
                    box-sizing: border-box;
                    width: 490px;
                    height: 32px;
                    padding: 0px 4px;
                    border: 2px solid #ea4a36;
                    float: left;

                    &:focus {
                        outline: none;
                    }
                }

                button {
                    height: 32px;
                    width: 68px;
                    background-color: #ea4a36;
                    border: none;
                    color: #fff;
                    float: left;
                    cursor: pointer;

                    &:focus {
                        outline: none;
                    }
                }
            }
        }
    }
}
</style>