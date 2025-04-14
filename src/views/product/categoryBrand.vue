<script setup>

    import {ref,onMounted} from 'vue'
    import {FindByPage,AddBrandCategory,GetIdList,UpdateCategoryBrand,DeleteById} from '@/api/categoryBrand'
    import {FindAll} from '@/api/brand'
    import {FindListByParentId} from '@/api/category'
    import { ElMessage } from 'element-plus'


    //定义PageInfo的属性 list和total
    const list = ref([])
    const total = ref(0)//总记录数
    const selectValue = ref([]) //存3个级别分类的id集合
    //定义分页参数
    const pageParam = ref({
        pageNum:1,
        pageSize:5
    })
    //定义categoryBrandDto
    const categoryBrandDto = ref({
        brandId:'',
        categoryId:''
    })
    
    //定义brandList
    const brandList = ref([])

    
    //------------级联选择器
    

    const props = {
        lazy: true,
        label:'name',//每个节点显示分类对象的name属性
        value:'id',//将选择的节点的id属性赋值给v-model绑定的变量
        leaf: 'hasChildren',//是否是叶子节点，是叶子节点，没有下级
        //true：当前是叶子节点，没有下级，没有 > ; 
        //false：当前不是叶子节点，有下级，有 > . 
        //node： 当前点击的节点（分类），resolve：用于选择下级
        //页面初始化之后，该方法默认会被调用一次（此时应该去查询一级分类列表）
        //该方法两个情况会被调用：1、页面初始化（查询一级分类列表）  2、点击某个非叶子节点时（根据当前分类id查询下级分类列表）
        async lazyLoad(node, resolve) {
            console.log('级联')
            console.log(node.data)//当前几点的json数据值


            let {data} = await FindListByParentId(node.data.id?node.data.id:0)
            data.map(item=>{
                item.hasChildren = !item.hasChildren
            })
            resolve(data)
        },
    }


    //----------方法
    onMounted (()=>{
        fetchData();
        findBrandList();
    }) 
    const fetchData = async()=>{

        //判断id数组长度等于3时，才有第三级分类id
        if(selectValue.value.length == 3){
            categoryBrandDto.value.categoryId = selectValue.value[2]
        }   

        let {data} =  await FindByPage(pageParam.value.pageNum,pageParam.value.pageSize,categoryBrandDto.value) //如果没有参数就是查询所有
        list.value = data.list
        total.value = data.total
    }
    //查询所有品牌
    const findBrandList = async()=>{
        let {data} = await FindAll()
        brandList.value = data
    }
    //重置按钮
    const reset = ()=>{
        selectValue.value = []
        categoryBrandDto.value = {
            brandId:'',
            categoryId:''
        }
    }
    //弹窗上绑定的变量
    const categoryBrand = ref({
        brandId:'', //弹窗上的品牌
        categoryId:[] //弹窗上的分类
    })
    //添加按钮 打开弹窗
    const addShow = ()=>{
        dialogVisible.value = true
        //清空数据
        categoryBrand.value = {
            brandId:'', 
            categoryId:[] 
        }
    }
    //修改按钮
    const editShow = async(row)=>{
        console.log("看看row");
        console.log(row);
        dialogVisible.value = true
        
        //回显
        categoryBrand.value = row
        //categoryBrand.value.brandId = row.brandId

        let {data} = await GetIdList(row.categoryId) //第三级分类id
        console.log(data);
        //categoryId []
        categoryBrand.value.categoryId = data

    }
    //弹窗
    const dialogVisible = ref(false)
    //弹窗的提交
    const saveOrUpdate = async()=>{
        //未选择品牌
        if(!categoryBrand.value.brandId){
            ElMessage.warning('请选择品牌')
        }
        //未选择第3级分类
        if(categoryBrand.value.categoryId.length !=3){
            ElMessage.warning('请选择第三级分类')
        }
        //添加的是第三级分类id 
        //js是弱类型语言 categoryId从[] 变成 ''
        categoryBrand.value.categoryId = categoryBrand.value.categoryId[2]

        //没有id就是添加
        if(!categoryBrand.value.id){
            let {code,message} = await AddBrandCategory(categoryBrand.value)
			if(code==200){
				ElMessage.success('建立成功')
				dialogVisible.value = false
				fetchData()
			}else{
				ElMessage.warning('建立失败，' + message)
			}
        }else{
            let {code,message} = await UpdateCategoryBrand(categoryBrand.value)
			if(code==200){
				ElMessage.success('修改成功')
				dialogVisible.value = false
				fetchData()
			}else{
				ElMessage.warning('修改失败，' + message)
			}
        }
       
    }
    //deleteById
    const deleteById = async(id)=>{
        console.log(id);
       let{code} =  await DeleteById(id)
       if(code==200)
       ElMessage.success('删除成功')
       fetchData()

    }

    
 
        
</script>

<template>
    	<div>
		{{categoryBrandDto}}
		<br />
		<el-select
			v-model="categoryBrandDto.brandId"
			class="m-4"
			placeholder="请选择品牌"
			size="middle"
		>
			<el-option
				v-for="item in brandList"
				:key="item.id"
				:label="item.name"
				:value="item.id"
			/>
		</el-select>

		&nbsp;

		<!--分类的级联 -->
        {{selectValue}}
        <el-cascader :props="props" v-model="selectValue" />
 
		<br />
		<br />
		<el-button type="primary" size="small" @click="fetchData">搜索</el-button>
		<el-button size="small" @click="reset">重置</el-button>
		<br />
		<br />

        <el-button type="success" size="small" @click="addShow">添加</el-button>

        <br />
		<br />
    

            <!-- 表格数据 -->
            <el-table :data="list" style="width: 100%">
                <el-table-column prop="categoryName" label="分类" />
                <el-table-column prop="brandName" label="品牌" />
                <el-table-column prop="logo" label="品牌图标" #default="scope">
                    <img :src="scope.row.logo" width="50" />
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" />
                <el-table-column label="操作" align="center" width="200" #default="scope">
                    <el-button type="primary" size="small" @click="editShow(scope.row)">
                        修改
                    </el-button>
                    <el-button type="danger" size="small" @click="deleteById(scope.row.id)">
                        删除
                    </el-button>
                </el-table-column>
            </el-table>

            <!-- 分页控件 -->
            <el-pagination
                v-model:current-page="pageParam.pageNum" 
                v-model:page-size="pageParam.pageSize"
                :page-sizes="[3,5,10]"
         
                layout="sizes, prev, pager, next,jumper"
                :total="total"
                @size-change="fetchData"
                @current-change="fetchData"
            />


        <!-- 弹窗 -->
        <el-dialog v-model="dialogVisible" title="建立品牌分类关系数据" width="30%" :before-close="closeDialog">
			{{categoryBrand}}
            <el-form label-width="120px">

				<!-- 和表格上边的两个控件是一样的，只是绑定给不同的对象 -->
                <!-- 品牌下拉框 -->
                <el-select
                    v-model="categoryBrand.brandId"
                    class="m-4"
                    placeholder="请选择品牌"
                    size="middle"
                >
                    <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>


                <br>
                <br>

                <!-- 分类的级联选择器 -->
                <el-cascader :props="props" v-model="categoryBrand.categoryId" placeholder="请选择分类" />

                <br>
                <br>
                <el-form-item>
                    <el-button type="primary" @click="saveOrUpdate">提交</el-button>
                    <el-button @click="dialogVisible = false ; fetchData()">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        </div>
</template>

<style scoped>

</style>