<script setup>
import { ref, onMounted } from 'vue'
import { FindByPage, AddSysUser, UpdateSysUser,DeleteById,DeleteByIds } from '@/api/sysUser'
import {FindRoleList,FindRoleIdListByUserId,GetRoleListAndRoleIdList,DoAssign} from '@/api/sysRole'

import { ElMessage } from 'element-plus'
import { getItem } from '@/utils/storage'

// 表格数据模型
const list = ref([
  {
    id: 1,
    userName: 'admin',
    name: 'admin',
    phone: '13121034567',
    status: 1,
    createTime: '2023-05-11',
  },
  {
    id: 2,
    userName: 'admin',
    name: 'admin',
    phone: '13121034567',
    status: 1,
    createTime: '2023-05-11',
  },
])

// 分页条数据模型
const total = ref(0)

//定义分页参数 对象
const pageParam = ref({
  pageNum: 1,
  pageSize: 3,
})

//查询条件
const sysUserDto = ref({
  keyword: '',
  createTimeBegin: '',
  createTimeEnd: '',
})

//时间选择器组件 绑定的变量
const value1 = ref([]) //定义一个数组,两个日期字符串

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  //处理两个日期字符串
  if (value1.value.length == 2) {
    sysUserDto.value.createTimeBegin = value1.value[0]
    sysUserDto.value.createTimeEnd = value1.value[1]
  }

  let { code, message, data } = await FindByPage(
    pageParam.value.pageNum,
    pageParam.value.pageSize,
    sysUserDto.value
  )
  list.value = data.list
  total.value = data.total
}
//重置按钮
const reset = () => {
  sysUserDto.value = {
    keyword: '',
    createTimeBegin: '',
    createTimeEnd: '',
  }
  value1.value = []
  fetchData()
}
//-------------修改
//添加或者修改的弹窗变量
const dialogVisible = ref(false)

//定义sysUser对象,用于弹窗控件的绑定
const sysUser = ref({})
//添加按钮的点击
const addUser = () => {
  //添加按钮就打开弹窗
  dialogVisible.value = true
  //打开弹窗,还原数据
  sysUser.value = {}
}
//弹窗中的提交按钮
const submit = async () => {
  //如果id有值就是修改,没有值就是添加
  if (sysUser.value.id) {
    let { code, message } = await UpdateSysUser(sysUser.value)
    if (code == 200) {
      //显示提示信息
      ElMessage.success('修改成功')
      //刷新页面关闭弹窗
      fetchData()
      dialogVisible.value = false
    } else {
      ElMessage.warning('修改失败,' + message)
    }
  } else {
    //添加
    let { code, message } = await AddSysUser(sysUser.value)
    if (code == 200) {
      //显示提示信息
      ElMessage.success('添加成功')
      //刷新页面关闭弹窗
      fetchData()
      dialogVisible.value = false
    } else {
      ElMessage.warning('添加失败,' + message)
    }
  }
}
//修改按钮的点击事件
const editShow = row => {
  //打开弹窗
  dialogVisible.value = true
  //回显数据
  sysUser.value = row
}

//点击右上角的X
const handleClose = () => {
  //关闭弹窗,刷新数据
  dialogVisible.value = false
  fetchData()
}

//删除
const deleteById = async (id)=>{
    let {code} = await DeleteById(id)
    if(code = 200){
        ElMessage.success('删除成功')
        fetchData()
    }else{
        //不用加message,因为不可能删除失败
        ElMessage.warning('删除失败')
    }
}
//table表格绑定的方法
const handleSelectionChange = (val)=>{
    multipleSelection.value = val
}
//复选框使用的变量
const multipleSelection = ref([])

//批量删除的方法
const deleteBatch = async ()=>{
    //要多选了才能点批量删除
    //判断是否选择数据
    if(multipleSelection.value.length == 0){
        ElMessage.warning('请选择要删除的数据')
        return
    }
    //对数组中的每一个json对象item遍历,获得id形成一个数组
    let ids = multipleSelection.value.map(item=>{
    return item.id
    })
    let {code} = await DeleteByIds(ids)
    if(code == 200){
        ElMessage.success('批量删除成功')
        fetchData()
    }else{
        ElMessage.warning('批量删除失败')
    }
}
//----分配角色 scope.row 该行的对象数据

//分配角色的弹窗
const dialogRoleVisible = ref(false)

//保存选中的角色id.形成数组
const userRoleIds = ref([])

//角色列表(后端加载的)
const allRoles = ref([{id:1,roleName:'超级管理员'},{id:2,roleName:'普通管理员'}])

const assginRole = async (row)=>{
    //userRoleIds.value = []
    dialogRoleVisible.value = true
    sysUser.value = row

    const {data} = await GetRoleListAndRoleIdList(row.id)
    allRoles.value = data.roleList
    userRoleIds.value = data.roleIdList

    //打开弹窗后,查询角色列表
    // fetchRoleList()

    // //查询已分配的角色id集合
    // fetchRoleIdList(row.id)
}
// const fetchRoleList = async()=>{
//     let {data} = await FindRoleList()
//     //查询所有角色列表
//     allRoles.value= data
// }

// const fetchRoleIdList = async(userId)=>{
//   const {data} = await FindRoleIdListByUserId(userId)
//   //查询已分配的角色id列表
//   userRoleIds.value = data
// }
// 分配角色封装的数据
const assginDto = ref({
  userId:'',
  roleIdList:[]
})

//分配角色的弹窗 的提交
const submitDoAssgin = async()=>{
  assginDto.value.userId = sysUser.value.id
  assginDto.value.roleIdList = userRoleIds.value

  let {code} = await DoAssign(assginDto.value)
    if(code == 200){
      ElMessage.success('分配成功')
      dialogRoleVisible.value = false
    }else{
      ElMessage.warning('分配失败')
    }
}
//设置请求头token
const headers = {
  "token":getItem('VEA-TOKEN').token
}
//上传头像成功后的钩子函数 response 后端接口的返回值
const handleAvatarSuccess = (response,uploadFile)=>{
  sysUser.value.avatar = response.data

}
</script>

<template>
  <!---搜索表单-->
  <div class="search-div">
    <el-form label-width="70px" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="关键字">
            <el-input
              v-model="sysUserDto.keyword"
              style="width: 100%"
              placeholder="用户名、姓名、手机号码"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="value1"
              type="daterange"
              range-separator="To"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="display:flex">
        <el-button type="primary" size="small" @click="fetchData">
          搜索
        </el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-row>
    </el-form>
  </div>

  <!--添加按钮-->
  <div class="tools-div">
    <el-button type="success" size="small" @click="addUser">添 加</el-button>
    <el-button type="warning" size="small" @click="deleteBatch">批量删除</el-button>
  </div>

  <!---数据表格-->
  <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="userName" label="用户名" />
    <el-table-column prop="name" label="姓名" />
    <el-table-column prop="phone" label="手机" />
    <el-table-column prop="avatar" label="头像" #default="scope">
      <img :src="scope.row.avatar" width="50" />
    </el-table-column>
    <el-table-column prop="description" label="描述" />
    Failed to execute 'setAttribute' on 'Element': 'fetchData()' is not a valid
    attribute name.
    <el-table-column prop="status" label="状态" #default="scope">
      {{ scope.row.status == 1 ? '正常' : '停用' }}
    </el-table-column>

    <el-table-column prop="createTime" label="创建时间" />
    <el-table-column label="操作" align="center" width="280" #default="scope">
      <el-button type="primary" size="small" @click="editShow(scope.row)">
        修改
      </el-button>
      <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
        删除
      </el-button>
      <el-button type="warning" size="small" @click="assginRole(scope.row)">
        分配角色
      </el-button>
    </el-table-column>
  </el-table>

  <el-pagination
    v-model:current-page="pageParam.pageNum"
    v-model:page-size="pageParam.pageSize"
    @size-change="fetchData"
    @current-change="fetchData"
    :page-sizes="[3, 5, 10]"
    layout="total, sizes, prev, pager, next"
    :total="total"
  />

  <el-dialog
    v-model="dialogVisible"
    title="添加或修改"
    width="40%"
    :before-close="handleClose"
  >
    <el-form label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="sysUser.userName" />
      </el-form-item>
      <!--弹窗的密码框是否显示-->
      <el-form-item v-if="sysUser.id == null" label="密码">
        <el-input type="password" show-password v-model="sysUser.password" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="sysUser.name" />
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="sysUser.phone" />
      </el-form-item>

      <!--头像（文件上传控件）action="http://localhost:8501/admin/system/file/uploadFile" ， :on-success， :headers -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8501/admin/system/file/uploadFile"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
        >
          <img v-if="sysUser.avatar" :src="sysUser.avatar" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="描述">
        <el-input v-model="sysUser.description" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="dialogVisible = false;fetchData()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

  <el-dialog v-model="dialogRoleVisible" title="分配角色" width="40%">
    {{userRoleIds}}
    <el-form label-width="80px">
      <el-form-item label="用户名">
        <el-input disabled :value="sysUser.userName"></el-input>
      </el-form-item>

      <el-form-item label="角色列表">
        <el-checkbox-group v-model="userRoleIds">
          <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitDoAssgin">提交</el-button>
        <el-button @click="dialogRoleVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
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
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
