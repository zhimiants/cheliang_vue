<script setup>
import { FindByPage, AddRole, UpdateRole, DeleteRole } from '@/api/sysRole'

import {
  FindMenuList,
  AssignMenuForRole,
  FindMenuIdListByRoleId,
} from '@/api/sysMenu'
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 分页条总记录数
let total = ref(0)

// 定义表格数据模型
let list = ref([
  {
    id: 9,
    roleName: '系统管理员',
    roleCode: 'xtgly',
    createTime: '2023-07-31',
  },
  {
    id: 10,
    roleName: '商品管理员',
    roleCode: 'spgly',
    createTime: '2023-07-31',
  },
])

//定义,默认的分页参数
let pageParam = ref({
  pageNum: 1,
  pageSize: 3,
})
//定义查询条件对象
let searchObj = ref({
  roleName: '',
})

onMounted(() => {
  fetchData() //重新加载数据
})

const fetchData = async () => {
  let { code, message, data } = await FindByPage(
    pageParam.value.pageNum,
    pageParam.value.pageSize,
    searchObj.value
  )
  list.value = data.list //当前页的结果集
  total.value = data.total //总记录数
}

const reset = () => {
  console.log('重置按钮')
  searchObj.value.roleName = ''
  pageParam.value.pageNum = 1
  pageParam.value.pageSize = 3
  //刷新数据
  fetchData()
}
//------------------------添加
//弹窗是否打开
let dialogVisible = ref(false)
//弹窗绑定的变量
//该js对象必须声明,但是属性可以不声明
let sysRole = ref({})

//添加按钮的点击事件
const addShowDialog = () => {
  //打开添加的弹窗,清空数据
  ;(sysRole.value = {}), (dialogVisible.value = true)
}

//弹窗的提交按钮
const submitForm = async () => {
  //前端页面参数的非空校验
  if (sysRole.value.roleName == '' || sysRole.value.roleName == undefined) {
    ElMessage.info('请输入角色名称')
    return
  }
  if (sysRole.value.roleCode == '' || sysRole.value.roleCode == undefined) {
    ElMessage.info('请输入角色编号')
    return
  }
  //判断弹窗的业务是添加还是修改?
  //if成立 说明有值
  if (sysRole.value.id) {
    updateRole()
  } else {
    addRole()
  }
}
//---------------修改
//每行的修改按钮都绑定这个方法
const editShow = row => {
  //console.log(row);
  sysRole.value = { ...row }
  //显示弹窗
  dialogVisible.value = true
}

//提取出来的方法
const addRole = async () => {
  //调用后端接口
  let { code, message } = await AddRole(sysRole.value)
  console.log(code, message)

  if (code == 200) {
    dialogVisible.value = false
    ElMessage.success('添加成功!')
    //重新加载页面
    fetchData()
  } else {
    ElMessage.warning('添加失败,' + message)
  }
}
const updateRole = async () => {
  //调用后端接口
  let { code, message } = await UpdateRole(sysRole.value)
  console.log(code, message)

  if (code == 200) {
    dialogVisible.value = false
    ElMessage.success('修改成功!')
    //重新加载页面
    fetchData()
  } else {
    ElMessage.warning('修改失败,' + message)
  }
}

//删除按钮的点击事件
const deleteRole = roleId => {
  ElMessageBox.confirm('是否确定删除?', '注意~', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      //点击确认
      let { code, message } = await DeleteRole(roleId)
      if (code == 200) {
        ElMessage.success('删除成功')
        //刷新页面
        fetchData()
      } else {
        ElMessage.warning('删除失败', +message)
      }
    })
    .catch(() => {
      ElMessage.info('已取消删除')
    })
}
//为角色分配菜单的弹窗变量
const dialogRoleMenuVisible = ref(false)
//树组件绑定的对象，可以通过该对象操作树组件，例如：让某些节点被选中； 获取已选中的节点...
const treeRef = ref()
//树绑定的数据
const treeData = ref([])
//封装的数据
const roleMenuDto = ref({
  roleId: 0,
  menuIdList: [],
})

//用于指定子集属性名 和 节点显示什么东西

const defaultProps = {
  children: 'children',
  label: 'title',
}
const menuIds = async roleId => {
  //data就是一个装这menuId的数组
  let { data } = await FindMenuIdListByRoleId(roleId)
  treeRef.value.setCheckedKeys(data)
}

//点击分配菜单按钮
const assignMenu = async roleId => {
  dialogRoleMenuVisible.value = true

  //查询菜单列表
  let { data } = await FindMenuList()
  treeData.value = data

  //回显已分配菜单
  // treeRef.value.setCheckedKeys([6])  这是写死的数据
  //改进 ↓
  menuIds(roleId)

  //提取当前行的roleId
  roleMenuDto.value.roleId = roleId
}

//为角色分配菜单的提交按钮
const submitRoleMenu = async () => {
  //每次提交,清空数组
  roleMenuDto.value.menuIdList = []
  //获取选中的节点
  treeRef.value.getCheckedNodes().map(item => {
    roleMenuDto.value.menuIdList.push({ menuId: item.id, isHalf: 0 })
  })
  //获取半选中节点
  treeRef.value.getHalfCheckedNodes().map(item => {
    roleMenuDto.value.menuIdList.push({ menuId: item.id, isHalf: 1 })
  })

  let { code, message } = await AssignMenuForRole(roleMenuDto.value)
  if (code == 200) {
    ElMessage.success('分配成功')
    dialogRoleMenuVisible.value = false
  } else {
    ElMessage.warning('分配失败,' + message)
  }
}
</script>

<template>
  <div class="search-div">
    <!-- 搜索表单 -->
    <el-form label-width="70px" size="small">
      <el-form-item label="角色名称">
        <el-input
          v-model="searchObj.roleName"
          style="width: 100%"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="fetchData">
          搜索
        </el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-form>

    <!-- 添加按钮 -->
    <div class="tools-div">
      <el-button type="success" size="small" @click="addShowDialog">
        添 加
      </el-button>
    </div>

    <!--- 角色表格数据 -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="roleName" label="角色名称" width="180" />
      <el-table-column prop="roleCode" label="角色code" width="180" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="280" #default="scope">
        <!-- 修改需要回显 scope.row 当前行的json -->
        <el-button type="primary" size="small" @click="editShow(scope.row)">
          修改
        </el-button>
        <!-- 修改也是根据id删除 -->
        <el-button type="danger" size="small" @click="deleteRole(scope.row.id)">
          删除
        </el-button>
        <!-- 分配菜单的按钮 assignMenu(scope.row.id) 要传入角色的id-->
        <el-button
          type="warning"
          size="small"
          @click="assignMenu(scope.row.id)"
        >
          分配菜单
        </el-button>
      </el-table-column>
    </el-table>

    <!--分页条  每页显示多少条/第几页改变 都要调用fetchData-->
    <el-pagination
      v-model:current-page="pageParam.pageNum"
      v-model:page-size="pageParam.pageSize"
      @size-change="fetchData"
      @current-change="fetchData"
      :page-sizes="[3, 5, 10]"
      layout="total, sizes, prev, pager, next"
      :total="total"
    />

    <el-dialog v-model="dialogVisible" title="添加或修改角色" width="30%">
      {{ sysRole }}
      <el-form label-width="120px">
        <el-form-item label="角色名称">
          <el-input v-model="sysRole.roleName" />
        </el-form-item>

        <el-form-item label="角色Code">
          <el-input v-model="sysRole.roleCode" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="sysRole.description" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 为角色分配菜单的弹窗 -->
    <el-dialog v-model="dialogRoleMenuVisible" title="分配菜单" width="40%">
      <el-form label-width="80px">
        <el-tree
          :data="treeData"
          show-checkbox
          node-key="id"
          default-expand-all
          :check-on-click-node="true"
          :props="defaultProps"
          ref="treeRef"
        />
        <el-form-item>
          <el-button type="primary" @click="submitRoleMenu">提交</el-button>
          <el-button @click="dialogRoleMenuVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.search-div {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}

.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>
