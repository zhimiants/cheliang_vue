<script setup>
    import { ref,onMounted } from 'vue';
    import {FindListByParentId,ExportCategoryData} from '@/api/category'
import { getItem } from '@/utils/storage';
import { ElMessage } from 'element-plus';

    // 定义list属性模型
    const tableData = ref([
        // {"id":1 , "name":"数码" , "orderNum":"1" , "status":1 , "createTime":"2023-05-22" , "hasChildren": true},
        // {"id":2 , "name":"手机" , "orderNum":"1",  "status":1 , "createTime":"2023-05-22" ,"hasChildren": false},
    ])

    // 加载数据的方法
    const load = async (row, treeNode, resolve) => {
        
        // 向后端发送请求获取数据 resolve([{},{}])
        // const data = [
        //     {"id":3 , "name":"智能设备" , "orderNum":"1" , "status":1 , "createTime":"2023-05-22" },
        //     {"id":4 , "name":"电子教育" , "orderNum":"2" , "status":1 , "createTime":"2023-05-22" },
        // ]
        //返回category类型的list
        let {data} = await FindListByParentId(row.id)

        // 返回数据
        resolve(data)
    }
    //挂载之后
    onMounted(()=>{
        fetchData()
    })
    //更新数据
    const fetchData = async()=>{
        //加载一级分类
        let {data} = await FindListByParentId(0)
        tableData.value = data
    }
    //----导出/文件下载的按钮
    const excelExport = ()=>{
        //方法一:相当于直接访问文件下载的路径
        //window.location = `http://localhost:8501//admin/system/category/download`

        //方法二:
        ExportCategoryData().then(res => {
            //res:后端接口的二进制响应流
            //利用流数据,创建Blob对象
            const blob = new Blob([res])

            const link = document.createElement('a'); //创建一个a标签  <a href=""></a>
            link.href = window.URL.createObjectURL(blob); //设置a标签的href属性 相当于把下载地址给href??
            link.download = '商品分类数据.xlsx'; //下载的文件名
            link.click(); //模拟点击事件

        })
    }
    //导入部分所需变量和方法
    //文件上传时的请求头
    const headers = {
        token:getItem('VEA-TOKEN').token
    }

    //文件导入sql的弹窗
    const excelDialogVisible = ref(false)

    //点击导入按钮
    const importExcle = ()=>{
        excelDialogVisible.value = true
    }
    //后端接口调用成功后执行的
    //response 表示后端接口的返回值
    const uploadSuccess = (response)=>{
        console.log(response);
        if(response.code = 200){
            ElMessage.success('导入成功')
            excelDialogVisible.value = false
            fetchData()
        }else{
            ElMessage.warning('导入失败')
        }
    }


</script>

<template>
  
      <div >
      <el-button type="success" size="small" @click="excelExport">导出</el-button>
      <el-button type="primary" size="small" @click="importExcle">导入</el-button>
    </div>

    <!---懒加载的树形表格  默认只展示一级分类-->
    <!-- 点击箭头的:load 是查询该分类的下级 -->
    <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        lazy
        
        :load="load"
        :tree-props="{hasChildren: 'hasChildren' }"
    >
        <el-table-column prop="name" label="分类名称" />

        <el-table-column prop="imageUrl" label="图标" #default="scope">
            <img :src="scope.row.imageUrl" width="50" />
        </el-table-column>

        <el-table-column prop="orderNum" label="排序" />

        <el-table-column prop="status" label="状态" #default="scope">
        {{ scope.row.status == 1 ? '正常' : '停用' }}
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
    </el-table>

    <el-dialog v-model="excelDialogVisible" title="导入" width="30%">
    <el-form label-width="120px">
        <el-form-item label="分类文件">
            <el-upload
                       class="upload-demo"
                       action="http://localhost:8501/admin/system/category/importFile"
                       :headers="headers"
                       :on-success="uploadSuccess"
                       >
                <el-button type="primary">选择你要导入的文件</el-button>
            </el-upload>
        </el-form-item>
    </el-form>
</el-dialog>
</template>

<style scoped>

</style>