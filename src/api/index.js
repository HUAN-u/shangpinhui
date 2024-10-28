// 引入axios二次封装好的requests模块，api进行统一管理
import requests from "./request";
//引入mock接口文件
import mockRequests from './mockAjax'
/*
三级联动的接口管理
    通过一个函数的方式进行接口数据的获取
*/

/*
reqCategoryList  reqGetbannerList 这两个请求的格式，只是采用不同的写法
*/

//reqCategoryList商品请求   地址：product/getBaseCategoryList
export const reqCategoryList = ()=>{
    return requests({url:'/product/getBaseCategoryList',method:'get'})
}
//Home首页轮播图的请求
export const reqGetbannerList = ()=> mockRequests.get('/banner')

//获取floor数据
export const reqFloorList = () => mockRequests.get('/floor')

//获取search组件的数据  请求的地址/api/list 请求的方式:post 请求时候带有参数
/*
参数例如
{
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}
*/
//(params)得给一个默认的参数[至少是一个空对象]
export const reqGetSearchInfo = (params)=> requests({url:"/list",method:"post",data:params})

//获取detail组件的数据 请求地址/api/item/{ skuId } 请求的方式：GET  请求的参数-商品id-skuid
export const reqGoodInfo = (skuId)=> requests({url:`/item/${skuId}`,method:"get"})

//获取购物车的产品数据
//请求地址 /api/cart/addToCart/{ skuId }/{ skuNum }
//请求方式 post
export const reqAddorUpdate = (skuId,skuNum) => requests({url:`/cart/addToCart/${ skuId }/${ skuNum }`,method:'post'})

//获取ShopCart组件的购买商品数据
//请求地址 /api/cart/cartList
//请求方式 get
export const reqShopCartsList = ()=> requests({url:'/cart/cartList',method:'get'})

//删除购物车的数据
//地址 /api/cart/deleteCart/{skuId}
//请求方式 DELETE
//带有参数 商品id
export const reqShopDelete = (skuId) => requests({url:`/cart/deleteCart/${skuId}`,method:'delete'})

//切换商品选中状态
//地址 /api/cart/checkCart/{skuId}/{isChecked}
//请求方式 GET
//带有参数 商品id 商品选中状态:0代表取消选中,1代表选中
export const reqShopCheckCart = (skuId,isChecked) => requests({url:`/cart/checkCart/${skuId}/${isChecked}`,method:'get'})

//获取验证码的接口
//地址 /api/user/passport/sendCode/{phone}
//请求方式 get
//带有参数 phone电话号码
export const reqGetCode = (phone)=> requests({url:`/user/passport/sendCode/${phone}`,method:'get'})

//注册身份信息的接口  像这种路径中没有带有参数的，但是如果要带有参数的话，我们应该用data代替
//地址 /api/user/passport/register
//请求方式 post
export const reqRegisterData = (data)=> requests({url:'/user/passport/register',data,method:'post'})

//获取用户登录的接口信息
//地址 /api/user/passport/login
//参数phone password
//请求方式 post
export const reqLoginData = (data)=> requests({url:'/user/passport/login',data,method:'post'})

//token校验的对比接口-那用户的登录信息token跟服务器中的token进行对比
//地址 /api/user/passport/auth/getUserInfo
//请求方式 get
export const reqGetUserInfo = ()=> requests({url:'/user/passport/auth/getUserInfo',method:'get'})

//获取退出登录的接口信息
//地址 /api/user/passport/logout
export const reqLogoutInfo = ()=> requests({url:'/user/passport/logout',method:'get'})

//获取用户信息
//地址/api/user/userAddress/auth/findUserAddressList
//请求方式 get
export const reqUserAddress = () => requests({url:'/user/userAddress/auth/findUserAddressList',method:'get'})

//获取订单交易页信息
//地址 /api/order/auth/trade
//请求方式 get
export const reqGetTradeInfo = ()=> requests({url:'/order/auth/trade',method:'get'})

//获取提交订单的接口信息
//地址 /api/order/auth/submitOrder?tradeNo={tradeNo}
//请求方式 post
//请求参数 tradeNo
//此接口我们不使用vuex进行数据管理，直接在组件中进行数据的获取,存储在组件身上
export const reqSubmitOrder = (tradeNo,data) => requests({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,data,method:'post'})

//获取订单支付信息
//地址 /api/payment/weixin/createNative/{orderId}
//请求方式 get 
//请求参数 orderId 支付订单ID(通过提交订单得到)
export const reqGetCrestePayment = (orderId) => requests({url:`/payment/weixin/createNative/${orderId}`,method:'get'})

//查询支付订单状态
//地址/api/payment/weixin/queryPayStatus/{orderId}
//请求方式 get
//请求参数 orderId 支付订单ID
export  const reqPayStatus = (orderId) => requests({url:`payment/weixin/queryPayStatus/${orderId}`,method:'get'})

//获取我的订单列表
//地址  /api/order/auth/{page}/{limit}
//请求方式 get 
//请求参数 
/*
page   页码
limit  每页显示数量
*/
export const reqMyOrderInfo = (page,limit) => requests({url:`/order/auth/${page}/${limit}`,method:'get'})