// 导入组件

//布局组件
const Layout = () => import('@/layout/index.vue')

const orderInfo = () => import('@/views/order/order.vue') //订单列表页面
const orderStatistics = () => import('@/views/order/ordersta.vue') //订单统计页面
const orderBrand =  () => import('@/views/order/orderBrand.vue')
// 导出该组件
export default([
    {
        path: "/order",
        component: Layout,
        name: 'order',
        meta: {
            title: '订单统计管理',
        },
        icon: 'Location',
        children: [
            {
                path: '/orderInfo',
                name: 'orderInfo',
                component: orderInfo,
                meta: {
                    title: '订单成交量趋势',
                },
                hidden: false
            },
            {
                path: '/orderSta',
                name: 'orderStatistics',
                component: orderStatistics,
                meta: {
                    title: '订单交易额统计',
                },
                hidden: false
            },
            {
                path: '/orderBrand',
                name: 'orderBrand',
                component: orderBrand,
                meta: {
                    title: '订单品牌统计',
                },
                hidden: false
            }
        ]
    }
])