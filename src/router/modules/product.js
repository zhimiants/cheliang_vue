const Layout = () => import('@/layout/index.vue')
const category = () => import('@/views/product/category.vue')
const brand = () => import('@/views/product/brand.vue')
const categoryBrand = () => import('@/views/product/categoryBrand.vue')
const productSpec = () => import('@/views/product/productSpec.vue')
const product = () => import('@/views/product/product.vue')

export default [
  {
    path: '/product',
    component: Layout,
    name: 'product',
    meta: {
      title: '车辆管理',
    },
    icon: 'Histogram',
    children: [
      {
        path: '/category',
        name: 'category',
        component: category,
        meta: {
          title: '车辆分类管理',
        },
      },
      {
        path: '/brand',
        name: 'brand',
        component: brand,
        meta: {
          title: '车辆品牌管理',
        },
      },
      {
        path: '/categoryBrand',
        name: 'categoryBrand',
        component: categoryBrand,
        meta: {
          title: '车辆分类品牌管理',
        },
      },
      {
        path: '/productSpec',
        name: 'productSpec',
        component: productSpec,
        meta: {
          title: '车辆规格管理',
        },
      },
      {
        path: '/product',
        name: 'product',
        component: product,
        meta: {
          title: '车辆详情管理',
        },
      },
    ],
  },
]