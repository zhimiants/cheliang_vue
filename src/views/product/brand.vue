<script setup>
import { ref,onMounted } from 'vue'
import { FindByPage,AddBrand,UpdateBrand,DeleteBrand } from '@/api/brand'
import {ElMessage,ElMessageBox}from 'element-plus'
import { getItem } from '@/utils/storage'

// 定义表格数据模型
const list = ref([])

// 分页条数据模型
const total = ref(0) //总记录数

//定义分页参数
const pageParam = ref({
    pageNum:1, //当前页码
    pageSize:5 //每页的记录数
})

//定义brand变量 有name 和 logo
const brand = ref({})

onMounted(()=>{
    fetchData()
})

const fetchData = async ()=>{
    let {data} = await FindByPage(pageParam.value.pageNum,pageParam.value.pageSize)
    list.value = data.list
    total.value = data.total
}
//------添加品牌相关
//获取token
const headers = {
    "token":getItem('VEA-TOKEN').token
}

//定义弹窗
const dialogBrandVisible = ref(false)
//点击添加按钮
const addShow = ()=>{
    //打开弹窗
    dialogBrandVisible.value = true
    //清空数据回显
    brand.value = {}
}
//提交按钮
const submit = ()=>{
    //即使添加[无id],修改[有id]
    if(!brand.value.id){
        //调用添加方法
        addBrand();
    }else{
        updateBrand();
    }
}
const addBrand = async()=>{
    let {code} = await AddBrand(brand.value)
    if(code == 200){
        ElMessage.success('添加成功!')
        dialogBrandVisible.value = false
        //刷新页面
        fetchData()
    }else{
        ElMessage.warning('添加失败!')
    }
}
const updateBrand = async()=>{
    let {code,message} = await UpdateBrand(brand.value)
    if(code == 200){
        ElMessage.success('修改成功')
        dialogBrandVisible.value = false
        fetchData()
    }else{
        ElMessage.warning('修改失败,' + message)
    }
}
//handleAvatarSuccess 上传文件执行的方法
//上传成功后的钩子函数 response 后端接口的返回值 url地址
const handleAvatarSuccess = (response)=>{
    brand.value.logo = response.data
}
//updateShow修改按钮 回显问题
const updateShow = (row)=>{
    brand.value = {...row}
    dialogBrandVisible.value = true
}
const deleteBrand = async(id)=>{
    ElMessageBox.confirm('是否确认删除该品牌?','注意',{
        confirmButtonText:'确认',
        cancelButtonText:'取消',
        type:'warning'
    }).then(async()=>{
        let {code,message} = await DeleteBrand(id)
        if(code == 200){
            ElMessage.success('删除成功!')
            //删除完更新数据
            fetchData()
        }else{
            ElMessage.warning('删除失败,'+message)
        }
    }).catch(()=>{
        ElMessage.info('取消成功~')
    })
   
}


</script>
<template>
    <div class="tools-div">
        <el-button type="success" size="small" @click="addShow">添 加</el-button>
    </div>

    <el-table :data="list" style="width: 100%">
        <el-table-column prop="name" label="品牌名称" />

        <el-table-column prop="logo" label="品牌图标" #default="scope">
            <img :src="scope.row.logo" width="50" />
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" />

        <el-table-column label="操作" align="center" width="200" #default="scope">
            <el-button type="primary" size="small" @click="updateShow(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="deleteBrand(scope.row.id)">删除</el-button>
        </el-table-column>
    </el-table>
    <!-- 分页条信息 -->
    <el-pagination
        v-model:current-page="pageParam.pageNum"
        v-model:page-size="pageParam.pageSize"
        
        @size-change="fetchData" 
        @current-change="fetchData"
        
        :page-sizes="[3,5,10]"
        layout="total, sizes, prev, pager, next,jumper"
        :total="total" 
    />

    <!-- 添加/修改的弹窗 -->
    <el-dialog v-model="dialogBrandVisible" title="添加或修改" width="30%">
    <el-form label-width="120px">
        <el-form-item label="品牌名称">
            <el-input v-model="brand.name"/>
        </el-form-item>
        <el-form-item label="品牌图标">

            <el-upload
                       class="avatar-uploader"
                       action="http://localhost:8501/admin/system/file/uploadFile"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :headers="headers"
                       >
                <img v-if="brand.logo" :src="brand.logo" class="avatar" width="30" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submit">提交</el-button>
            <el-button @click="dialogBrandVisible = false">取消</el-button>
        </el-form-item>
    </el-form>
</el-dialog>

</template>


<style scoped>
.tools-div {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 3px;
  background-color: #fff;
}
</style>