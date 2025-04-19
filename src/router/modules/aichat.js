// home.js
const Layout = () => import('@/layout/index.vue')
const aichat = () => import('@/views/aichat/index.vue')

export default [
  {
    path: '/aichat',
    component: Layout,
    name: 'aichat',
    meta: {
      title: 'AI汽车助手',
    },
    icon: 'Histogram',
    children: [
      {
        path: 'index',
        name: 'aichatIndex',
        component: aichat,
        meta: {
          title: 'AI汽车助手',
        },
      },
    ],
  },
]