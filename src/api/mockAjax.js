// 对于axios的二次封装
//为什么进行二次封装,我们需要使用axios的响应器和拦截器
import axios from 'axios';
//创建接口文件
//1.利用axios对象的方法create，创建一个axios实例
//2.request就是axios，只不过需要配置一下
const requests = axios.create({
    //配置对象
    baseURL: "/mock", //基础路径，发送请求的时候，路径当中会出现/api
    timeout:5000,  //代表请求超时的时间
})

//配置请求拦截器
requests.interceptors.request.use((config)=>{
    //进度条启动
    // nProgress.start();
    //config: 配置对象，对象里面有一个属性很重要，headers请求头
    return config;
})
//配置响应拦截器
requests.interceptors.response.use((res)=>{  
    //成功的回调函数： 服务器相应的数据回来之后，拦截器就可以拦截数据，我们可以对拦截之后的数据进行处理
    //进度条结束
    // nProgress.done();
    // console.log(res.data)
    return res.data;
}),(error)=>{   //拦截失败
    return Promise.reject(new Error('faile'));   //终止这个promise 或者 打印一些错误信息
}
export default requests;