// 对于axios的二次封装
//为什么进行二次封装,我们需要使用axios的响应器和拦截器
import axios from 'axios';
//引入nprogress进度条, 
// 在nprogress身上有两个属性表示进度条的开始和结束，分别是start和done
import nProgress from 'nprogress';
import "nprogress/nprogress.css"
// console.log(nProgress)
import store from '@/store'
//1.利用axios对象的方法create，创建一个axios实例
//2.request就是axios，只不过需要配置一下
const requests = axios.create({
    //配置对象
    baseURL: "/api", //基础路径，发送请求的时候，路径当中会出现/api
    timeout:5000,  //代表请求超时的时间
})

//配置请求拦截器
requests.interceptors.request.use((config)=>{
    // console.log(store)
    //config上一次请求的请求头
    //在此判断uuid_token是否存在，如果存在请求头在发起请求的时候，将这个参数带上
    if(store.state.detail.uuid_token){
        config.headers.userTempId = store.state.detail.uuid_token;
    }
    //在这里检测是否带有token，如果有则和服务器中的token进行对比
    if(store.state.refister.token){
        config.headers.token = store.state.refister.token;
    }
    //进度条启动
    nProgress.start();
    //config: 配置对象，对象里面有一个属性很重要，headers请求头
    return config;
})
//配置响应拦截器
requests.interceptors.response.use((res)=>{  
    //成功的回调函数： 服务器相应的数据回来之后，拦截器就可以拦截数据，我们可以对拦截之后的数据进行处理
    //进度条结束
    nProgress.done();
    // console.log(res.data)
    return res.data;
}),(error)=>{   //拦截失败
    return Promise.reject(new Error('faile'));   //终止这个promise 或者 打印一些错误信息
}
export default requests;