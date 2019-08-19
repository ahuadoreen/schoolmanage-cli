<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getTeachers">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="teachers" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" sortable>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="100" :formatter="formatgender" sortable>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="100" sortable>
      </el-table-column>
      <el-table-column prop="subjectNames" label="科目" min-width="180" :formatter="formatSubject" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="editForm.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="subject in subjects"
              :key="subject.id"
              :label="subject.name"
              :value="subject.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.gender">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="科目">
          <el-select v-model="addForm.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="subject in subjects"
              :key="subject.id"
              :label="subject.name"
              :value="subject.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import util from '../../common/util'
  //import NProgress from 'nprogress'
  import { getApi, postApi } from '../../api/api';
  const qs = require('qs');
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        teachers: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列
        subjects: [],

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          name: '',
          gender: -1,
          age: 0,
          subjectIds: []
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          gender: -1,
          age: 0,
          subjectIds: []
        }

      }
    },
    methods: {
      //性别显示转换
      formatgender: function (row, column) {
        return row.gender == 1 ? '男' : row.gender == 0 ? '女' : '未知';
      },
      formatSubject: function (row, column) {
        //for mybatis
        if(row.subjectNames != undefined){
          return row.subjectNames;
        }
        //for jpa
        let str = '';
        let array = row.subjects;
        for(let i=0;i<array.length;i++){
          if(i == array.length - 1){
            str = str + array[i].name
          }else{
            str = str + array[i].name + ', ';
          }
        }
        return str;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getTeachers();
      },
      //获取用户列表
      getTeachers() {
        let para = {
          index: this.page - 1,
          size: 5,
          name: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        getApi(para,'teacher/teachers').then((res) => {
          console.log(res);
          let { message, code, data } = res;
          if (code !== 200) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            console.log(JSON.stringify(data));
            this.total = data.total;
            this.teachers = data.teachers;
            this.listLoading = false;
          }
          //NProgress.done();
        });
      },
      getSubjects() {
        let para = {
          index: 0,
          size: 1000,
          name: ''
        };
        //NProgress.start();
        getApi(para,'subject/subjects').then((res) => {
          console.log(res);
          let { message, code, data } = res;
          if (code !== 200) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            console.log(JSON.stringify(data));
            this.subjects = data.subjects;
          }
          //NProgress.done();
        });
      },
      //删除
      handleDel: function (index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { id: row.id };
          postApi(qs.stringify(para),'teacher/deleteTeacher').then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getTeachers();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        // this.editForm = Object.assign({}, row);
        // this.editForm.subjectIds = [];
        this.editForm.id = row.id;
        this.editForm.name = row.name;
        this.editForm.age = row.age;
        this.editForm.gender = row.gender;
        this.editForm.subjectIds = [];
        if(row.subjectIds != undefined){
          //for mybatis
          let array = row.subjectIds.split(",")
          for(let i=0;i<array.length;i++){
            this.editForm.subjectIds[i] = Number(array[i]);
          }
        }else{
          //for jpa
          let array = row.subjects;
          for(let i=0;i<array.length;i++){
            this.editForm.subjectIds[i] = array[i].id;
          }
        }
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          name: '',
          gender: -1,
          age: 0,
          subjectIds: []
        };
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              postApi(qs.stringify(para, { indices: false }),'teacher/editTeacher').then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getTeachers();
              });
            });
          }
        });
      },
      //新增
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.addLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.addForm);
              console.log(this.addForm)
              // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              postApi(qs.stringify(para, { indices: false }),'teacher/addTeacher').then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getTeachers();
              });
            });
          }
        });
      },
      selsChange: function (sels) {
        this.sels = sels;
      },
      //批量删除
      batchRemove: function () {
        var ids = this.sels.map(item => item.id).toString();
        this.$confirm('确认删除选中记录吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          //NProgress.start();
          let para = { ids: ids };
          batchRemoveUser(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getTeachers();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getTeachers();
      this.getSubjects();
    }
  }

</script>

<style scoped>

</style>
