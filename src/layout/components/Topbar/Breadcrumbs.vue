<template>
  <el-breadcrumb
    separator-class="el-icon-arrow-right"
    class="breadcrumb"
    :class="{
      mobile: device === 'mobile',
      show: isHorizontalMenu,
      hide: breadcrumbs.length <= 1,
    }"
  >
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumbs"
      :key="index"
      :class="{ no_link: index === breadcrumbs.length - 1 }"
      :to="index < breadcrumbs.length - 1 ? item.path : ''"
    >
      {{ item.meta && item.meta.title ? $t(item.meta.title) : '' }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
import { useApp } from '@/pinia/modules/app'
import { useLayoutsettings } from '@/pinia/modules/layoutSettings'
import { storeToRefs } from 'pinia'
import {
  defineComponent,
  computed,
  ref,
  onBeforeMount,
  watch,
  getCurrentInstance,
} from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance()
    const { device } = storeToRefs(useApp())
    const router = useRouter()
    const route = router.currentRoute // 这里不使用useRoute获取当前路由，否则下面watch监听路由的时候会有警告
    const breadcrumbs = ref([])
    const defaultSettings = useLayoutsettings()
    const isHorizontalMenu = computed(
      () => defaultSettings.menus.mode === 'horizontal'
    )

    const getBreadcrumbs = route => {
      // 确保首页使用安全的翻译方式
      const home = [{ path: '/', meta: { title: 'menu.homepage' } }]
      
      if (route.name === 'home') {
        return home
      } else {
        // 过滤有效的路由项
        const matched = route.matched.filter(
          item => item && item.meta && item.meta.title
        )

        return [...home, ...matched]
      }
    }

    onBeforeMount(() => {
      breadcrumbs.value = getBreadcrumbs(route.value)
    })

    watch(
      route,
      newRoute => {
        // 安全地获取面包屑
        breadcrumbs.value = getBreadcrumbs(newRoute)
        emit('on-breadcrumbs-change', breadcrumbs.value.length > 1)
      },
      {
        immediate: true,
      }
    )

    return {
      device,
      breadcrumbs,
      isHorizontalMenu,
    }
  },
})
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ::v-deep(a),
  ::v-deep(.is-link) {
    font-weight: normal;
  }
  // ::v-deep(.el-breadcrumb__item) {
  //   float: none;
  // }
  .no_link {
    ::v-deep(.el-breadcrumb__inner) {
      color: #97a8be !important;
    }
  }
  &.mobile {
    display: none;
  }
  &.show {
    display: block;
    margin: 0;
    padding: 16px;
    background: #f5f5f5;
  }
  &.hide {
    display: none;
  }
}
</style>
<style lang="scss">
.el-breadcrumb__inner {
  &.is-link,
  a {
    color: #5c5c5c;
  }
}
</style>
