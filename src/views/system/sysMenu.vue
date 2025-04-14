<script setup>
import {ref,onMounted} from 'vue'
import {FindMenuList,AddMenu,DeleteMenu,UpdateMenu} from '@/api/sysMenu'
import {ElMessage, ElMessageBox} from 'element-plus'

onMounted(()=>{
    fetchData()
})

//重新加载数据
const fetchData = async ()=>{
    //调用这个方法访问后端接口 返回菜单列表集合
    let {data} = await FindMenuList()
    tableData.value = data
}

//菜单列表绑定的集合
const tableData = ref([])
//-------------添加
//弹窗控件绑定的对象
const sysMenu = ref({})

//控制弹窗的显示
const dialogMenuVisible = ref(false)


//弹窗上的提交按钮
const submitMenu = async()=>{
    //这是修改
    if(sysMenu.value.id){
        updateMenu();
    }else{
        //这是添加
        let {code} = await AddMenu(sysMenu.value)
        if(code == 200){
            ElMessage.success('添加成功')
            dialogMenuVisible.value = false
            fetchData()
        }else{
            ElMessage.warning('添加失败')
        }
    }

}

//添加
const addMenu = async(parentId)=>{
      //菜单弹窗开启
    dialogMenuVisible.value = true
    sysMenu.value = {'parentId':parentId}
    

}
//-----修改菜单
const updateMenu = async()=>{
   
 let {code,message} = await UpdateMenu(sysMenu.value)
 if(code == 200){
    //关闭弹窗
    dialogMenuVisible.value = false
    ElMessage.success('修改成功')
    //刷新页面
    fetchData()
 }else{
    ElMessage.warning('修改失败,' + message)
 }
}

//每行的修改按钮都绑定这个方法
const editShow = (row)=>{
    //回显
    sysMenu.value = {...row}
    //显示弹窗
    dialogMenuVisible.value = true
}


//删除按钮绑定
const deleteMenu = (menuId)=>{
    ElMessageBox.confirm('是否确认删除该菜单?','注意~',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
    }).then( async()=>{
        let {code,message} = await DeleteMenu(menuId)
        if(code == 200){
            ElMessage.success('删除菜单成功!')
            fetchData()
        }else{
            ElMessage.warning('删除菜单失败,' + message)
        }
    }).catch(()=>{
        ElMessage.info("取消成功")
    })
}

</script>

<template>
    <!-- 弹窗 -->
    <el-button type="success" size="small" @click="addMenu(0)">添 加</el-button>

    <el-dialog v-model="dialogMenuVisible" :title="添加菜单" width="30%">{{sysMenu}}
        <el-form label-width="120px">
            <el-form-item label="菜单标题">
                <el-input v-model="sysMenu.title"/>
            </el-form-item>
            <el-form-item label="路由名称">
                <el-input v-model="sysMenu.component"/>
            </el-form-item>
            <el-form-item label="排序" >
                <el-input v-model="sysMenu.sortValue"/>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="sysMenu.status">
                    <el-radio :label="1">正常</el-radio>
                    <el-radio :label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitMenu">提交</el-button>
                <el-button @click="dialogMenuVisible = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!-- 页面 -->
    <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="id"
        border
    >
        <el-table-column prop="title" label="菜单标题" />
        <el-table-column prop="component" label="路由名称" />
        <el-table-column prop="sortValue" label="排序" />
        <el-table-column prop="status" label="状态" #default="scope">
          {{ scope.row.status == 1 ? '正常' : '停用' }}
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />

        <el-table-column label="操作" align="center" width="280" #default="scope" >
            <el-button type="success" size="small" @click="addMenu(scope.row.id)">
                添加下级节点
            </el-button>
            <el-button type="primary" size="small" @click="editShow(scope.row)">
                修改
            </el-button>
            <el-button type="danger" size="small" @click="deleteMenu(scope.row.id)">
                删除
            </el-button>
        </el-table-column>
  	</el-table>
</template>