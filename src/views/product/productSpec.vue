<template>
  <div class="tools-div">
      <el-button type="success" size="small" @click="addShow">添 加</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
      <el-table-column prop="specName" label="规格名称" />
      <el-table-column label="规格值" #default="scope"  width="300px">
          
          <div
              v-for="(item1, index1) in scope.row.specValue"
              :key="index1"
              style="padding: 5px; margin: 0;width: 150%;"
          >
              {{ item1.key }}：
              <span
                  v-for="(item2, index2) in item1.valueList"
                  :key="index2"
                  class="div-atrr"
                  >
                  {{ item2 }}
              </span>
          </div>
          
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" align="center" width="200" #default="scope">
          <el-button type="primary" size="small" @click="editShow(scope.row)">
              修改
          </el-button>
          <el-button type="danger" size="small" @click="remove(scope.row.id)">
              删除
          </el-button>
      </el-table-column>
  </el-table>

  <el-pagination
             v-model:current-page="pageParams.pageNum"
             v-model:page-size="pageParams.pageSize"
             :page-sizes="[3, 5, 10]"
             layout="total, sizes, prev, pager, next"
             :total="total"
             @size-change="fetchData"
             @current-change="fetchData"
          />

<el-dialog v-model="dialogVisible" title="添加或修改" width="40%">{{ productSpec }}
  <el-form label-width="120px">
      <el-form-item label="规格名称">
          <el-input v-model="productSpec.specName"/>
      </el-form-item>
      <el-form-item>
              <el-button size="default" type="success" @click="addSpec">
                  添加新规格
          </el-button>
      </el-form-item>
      
      <el-form-item label="" v-for="(item , index) in productSpec.specValue" :key="index">
          <el-row>
              <el-col :span="10">
                  <el-input
                            v-model="item.key"
                            placeholder="规格"
                            style="width: 90%;"
                            />
              </el-col>
              <el-col :span="10">
                  <el-input
                            v-model="item.valueList"
                            placeholder="规格值(如:白色,红色)"
                            style="width: 90%;"
                            />
              </el-col>
              <el-col :span="4">
                  <el-button size="default" type="danger" @click="delSpec(index)">删除</el-button>
              </el-col>
          </el-row>  
      </el-form-item>
      
      <el-form-item align="right">
              <el-button type="primary" @click="saveOrUpdate">提交</el-button>
              <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
  </el-form>
</el-dialog>

</template>

<script setup>
import { ref , onMounted } from 'vue'
import { AddProductSpec, FindByPage ,UpdateProductSpec ,DeleteProductSpec} from '@/api/productSpec'
import { ElMessage, ElMessageBox } from 'element-plus'

// 规格表格数据模型
const list = ref([{}])

// 分页条数据模型
const total = ref(0)

//分页条数据模型
const pageParams = ref({
    pageNum: 1, // 页码
    pageSize: 3, // 每页记录数
})

// 钩子函数
onMounted(()=> {
  fetchData()
})


// 分页查询
const fetchData = async () => {
    let { data } = await FindByPage(pageParams.value.pageNum , pageParams.value.pageSize) 
    //数据库中的spec_value是字符串，转成json数组
    data.list.forEach(item => {
        item.specValue = JSON.parse(item.specValue)       // 将规格字符串转换成规格js对象
    });
    list.value = data.list
    total.value = data.total
}


// 定义数据模型
const dialogVisible = ref(false)

// 添加表单数据模型
const productSpec = ref({
  id: '',
  specName: '',
  specValue: []
})

//进入修改
const editShow = row => {
  // productSpec.value = {...row}
  productSpec.value = JSON.stringify({...row})
  productSpec.value = JSON.parse(productSpec.value)
  dialogVisible.value = true
}

//进入添加
const addShow = () => {
  productSpec.value = {
      id: '',
      specName: '',
      specValue: []
  }
dialogVisible.value = true
}

// 页面添加规格操作
const addSpec = () => {
  productSpec.value.specValue.push({})
}

// 页面删除规格元素
const delSpec = (index) => {
  productSpec.value.specValue.splice(index , 1)
} 

// 提交表单
const saveOrUpdate = async () => {
   if(!productSpec.value.id)  {
       saveData()
   }else {
       updateData()
   }
}

// 保存修改
const updateData = async () => {
  productSpec.value.specValue.forEach(item=>{
      if(typeof item.valueList == 'string'){
          item.valueList = item.valueList.split(',')
      }
  })
  let temp = {...productSpec.value}
  temp.specValue = JSON.stringify(temp.specValue)

  let {code} =  await UpdateProductSpec(temp)
  if(code == 200){
      ElMessage.success('修改成功')
      dialogVisible.value = false
      fetchData()
  }else{
      ElMessage.warning('修改失败')
  }
}

// 保存数据
//{"specName":"测试","specValue":[{"key":"11","valueList":"1,1,2"},{"key":"22","valueList":"22,233,444" }]}
//要将valueList由字符串转成数组 ， "1,2,3" ===>  [1,2,3]  和数据库中的格式匹配上。
const saveData = async () => {
  productSpec.value.specValue.forEach(item=>{
          item.valueList = item.valueList.split(',')
  })

  //specValue由数组转成字符串
  let temp = {...productSpec.value}
  temp.specValue = JSON.stringify(productSpec.value.specValue)
  let {code} =  await AddProductSpec(temp)
  if(code == 200){
      ElMessage.success('添加成功')
      dialogVisible.value = false
      fetchData()
  }else{
      ElMessage.warning('添加失败')
  }
}

//删除
const remove = async id => {
  ElMessageBox.confirm('是否确认删除?', '注意', {
  confirmButtonText: '确认删除',
  cancelButtonText: '取消删除',
  type: 'warning',
  })
  .then(async () => {
      //点击了确认删除
      let { code, message } = await DeleteProductSpec(id)
      if (code == 200) {
          ElMessage.success('删除成功')
          fetchData()
      } else {
          ElMessage.warning('删除失败' + message)
      }
      })
  .catch(() => {
    //点击取消删除
    ElMessage.info('已取消删除!')
  })
}


</script>

<style scoped>
.tools-div {
margin: 10px 0;
padding: 10px;
border: 1px solid #ebeef5;
border-radius: 3px;
background-color: #fff;
}
  
.div-atrr {
padding: 5px 10px;
margin: 0 10px;
background-color: powderblue;
border-radius: 10px;
}

</style>