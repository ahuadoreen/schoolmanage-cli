<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getStudents">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="students" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="sno" label="学号" width="80" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" sortable>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="100" :formatter="formatgender" sortable>
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="100" sortable>
      </el-table-column>
      <el-table-column prop="classes" label="班级" min-width="180" :formatter="formatclass" sortable>
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
        <el-form-item label="学号" prop="sno">
          <el-input v-model="editForm.sno"></el-input>
        </el-form-item>
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
        <el-form-item label="班级">
          <el-select v-model="editForm.classId" placeholder="请选择">
            <el-option
              v-for="c in classes"
              :key="c.id"
              :label="formatClass(c)"
              :value="c.id">
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
        <el-form-item label="学号" prop="sno">
          <el-input v-model="addForm.sno"></el-input>
        </el-form-item>
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
        <el-form-item label="班级">
          <el-select v-model="addForm.classId" placeholder="请选择">
            <el-option
              v-for="c in classes"
              :key="c.id"
              :label="formatClass(c)"
              :value="c.id">
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
        students: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列
        classes: [],

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          sno: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          sno: '',
          name: '',
          gender: -1,
          age: 0,
          classId: ''
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          sno: [
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          sno: '',
          name: '',
          gender: -1,
          age: 0,
          classId: ''
        }

      }
    },
    methods: {
      //性别显示转换
      formatgender: function (row, column) {
        return row.gender == 1 ? '男' : row.gender == 0 ? '女' : '未知';
      },
      formatclass: function (row, column) {
        let str = ''
        if(row.classes != undefined){
          switch (row.classes.grade) {
            case 1:
              str = '一年级'
              break
            case 2:
              str = '二年级'
              break
          }
          str = str + row.classes.className;
        }
        return str;
      },
      formatClass: function (classes) {
        console.log(classes);
        let str = ''
        switch (classes.grade) {
          case 1:
            str = '一年级'
            break
          case 2:
            str = '二年级'
            break
        }
        return str + classes.className;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getStudents();
      },
      //获取用户列表
      getStudents() {
        let para = {
          index: this.page - 1,
          size: 5,
          name: this.filters.name
        };
        this.listLoading = true;
        //NProgress.start();
        getApi(para,'student/students').then((res) => {
          console.log(res);
          let { message, code, data } = res;
          if (code !== 200) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            console.log(JSON.stringify(data.students));
            this.total = data.total;
            this.students = data.students;
            this.listLoading = false;
          }
          //NProgress.done();
        });
      },
      getClasses() {
        let para = {
          index: 0,
          size: 1000,
          name: ''
        };
        //NProgress.start();
        getApi(para,'class/classes').then((res) => {
          console.log(res);
          let { message, code, data } = res;
          if (code !== 200) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            console.log(JSON.stringify(data));
            this.classes = data.classes;
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
          postApi(qs.stringify(para),'student/deleteStudent').then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getStudents();
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
        this.editForm.sno = row.sno;
        this.editForm.name = row.name;
        this.editForm.age = row.age;
        this.editForm.gender = row.gender;
        if(row.classes != undefined){
          this.editForm.classId = row.classes.id;
        }
      },
      //显示新增界面
      handleAdd: function () {
        this.addFormVisible = true;
        this.addForm = {
          sno: '',
          name: '',
          gender: -1,
          age: 0,
          classId: ''
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
              postApi(qs.stringify(para, { indices: false }),'student/editStudent').then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getStudents();
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
              postApi(qs.stringify(para, { indices: false }),'student/addStudent').then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getStudents();
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
            this.getStudents();
          });
        }).catch(() => {

        });
      }
    },
    mounted() {
      this.getStudents();
      this.getClasses();
    }
  }

</script>

<style scoped>

</style>
