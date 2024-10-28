//引入路由组件
// import Home from '@/pages/Home'
// import Refister from '@/pages/Refister'
// import Search from '@/pages/Search'
// import login from '@/pages/login'
// import Detail from '@/pages/Detail'
// import AddCartSuccess from '@/pages/AddCartSuccess'
// import ShopCart from '@/pages/ShopCart'
// import Trade from '@/pages/Trade'
// import Pay from '@/pages/Pay'
// import PaySuccess from '@/pages/PaySuccess'
// import Center from '@/pages/Center'
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'
// const foo = ()=>{
//     console.log(111111)
//     return import('@/pages/Home')
// }
export default [
    {
        path: "/home",  //需要跳转路由的路径
        component: ()=>import('@/pages/Home') ,  //需要跳转路由的组件 //使用按需加载的模式
        name:'home',
        meta:{show:true}
    },
    {
        path: "/refister",  //注册
        component: ()=>import('@/pages/Refister'), //使用按需加载的模式,
        meta:{show:false}
    },
    {
        path: "/search/:keyword?",  //搜索  :keyworld 给参数占位 通过路由跳转的方式给search模块传递参数
        component: ()=>import('@/pages/Search'), //使用按需加载的模式
        meta:{show:true},
        name: "search",
        // props:['a','b']
        // props:true
    },
    {
        path: "/login",  //登录
        component: ()=>import('@/pages/login'), //使用按需加载的模式
        name:'login',
        meta:{show:false} //用来控制Footer(底部)组件是否显示的配置属性
    },
    //重定向，在项目跑起来的时候，立马重定向到首页
    {
        path: '/',
        redirect: "/home",
    },
    {
        path: '/detail/:skuId',
        component: ()=>import('@/pages/Detail'), //使用按需加载的模式
        name:'Detail',
        meta:{show:true}
    },
    {
        path:'/addcartsuccess',
        component:()=>import('@/pages/AddCartSuccess'), //使用按需加载的模式
        name:'addcartsuccess',
        meta:{show:true}
    },
    {
        path:'/shopcart',
        component: ()=>import('@/pages/ShopCart'), //使用按需加载的模式
        meta:{show:true}
    },
    {
        path:'/trade',
        component:()=>import('@/pages/Trade'), //使用按需加载的模式
        name:'trade',
        meta:{show:true},
        //路由独享守卫
        beforeEnter: (to, from, next) => {
            //想去交易页面trade，必须从shopcart页面来
            if (from.path == '/shopcart') {
                next();
            } else {
                //如果不是从shopcart页面来，不允许跳转，直接停留在当前页面
                //next(false):终端当前导航，如果浏览器的url发生变化,那么URL地址会重置到from路由对应的地址
                //也就是shopcart页面,（从哪来到哪去）
                next(false);
            }
        }
    },
    {
        path:'/pay',
        component:()=>import('@/pages/Pay'), //使用按需加载的模式
        name:'pay',
        meta:{show:true},
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next();
            } else {
                next(false)
            }
        }
    },
    {
        path:'/paysuccess',
        component:()=>import('@/pages/PaySuccess'), //使用按需加载的模式
        name:'PaySuccess'
    },
    {
        path:'/center',
        component:()=>import('@/pages/Center'), //使用按需加载的模式
        name:'Center',
        children:[
            {
                path:"myorder",
                component:MyOrder,
            },
            {
                path:"grouporder",
                component:GroupOrder,
            },
            {
                //路由重定向
                path:'/center',
                redirect:'/center/myorder'
            }
        ]
    }
    
]