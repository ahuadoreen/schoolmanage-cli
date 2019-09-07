<template>
  <section>
    <!--列表-->
    <el-table :data="gradeCourses" highlight-current-row v-loading="listLoading" style="width: 100%;">
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="120" :formatter="formatGrade" sortable>
      </el-table-column>
      <el-table-column prop="subject" label="科目" min-width="180" :formatter="formatSubject" sortable>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">重置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" ref="editForm">
        <el-form-item label="年级">
          <el-radio-group v-model="editForm.grade">
            <el-radio class="radio" :label="1">一年级</el-radio>
            <el-radio class="radio" :label="2">二年级</el-radio>
          </el-radio-group>
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
        gradeCourses: [],
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列
        subjects: [],

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        //编辑界面数据
        editForm: {
          grade: 0,
          subjectIds: []
        }

      }
    },
    methods: {
      formatGrade: function (row, column) {
        let str = ''
        switch (row.grade) {
          case 1:
            str = '一年级'
            break
          case 2:
            str = '二年级'
            break
        }
        return str;
      },
      formatSubject: function (row, column) {
        //for mybatis
        if(row.courses != undefined){
          return row.courses.subjectNames;
        }
        //for jpa
        let str = '';
        let array = row.course;
        if(array == undefined) return str;
        for(let i=0;i<array.length;i++){
          if(i == array.length - 1){
            str = str + array[i].subject.name
          }else{
            str = str + array[i].subject.name + ', ';
          }
        }
        return str;
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getGradeCourses();
      },
      //获取用户列表
      getGradeCourses() {
        let para = {

        };
        this.listLoading = true;
        //NProgress.start();
        getApi(para,'gradeCourse/gradeCourses').then((res) => {
          console.log(res);
          let { message, code, data } = res;
          if (code !== 200) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            console.log(JSON.stringify(data));
            this.gradeCourses = data.gradeCourses;
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
          let para = { grade: row.grade };
          postApi(qs.stringify(para),'gradeCourse/deleteGradeCourse').then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getGradeCourses();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm.subjectIds = []
        this.editForm.grade = row.grade;
        if(row.courses != undefined){
          //for mybatis
          let array = row.courses.subjectIds.split(",")
          for(let i=0;i<array.length;i++){
            this.editForm.subjectIds[i] = Number(array[i]);
          }
        }else{
          //for jpa
          let array = row.course;
          for(let i=0;i<array.length;i++){
            this.editForm.subjectIds[i] = array[i].subject.id;
          }
        }
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
              postApi(qs.stringify(para, { indices: false }),'gradeCourse/editGradeCourse').then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getGradeCourses();
              });
            });
          }
        });
      }
    },
    mounted() {
      this.getGradeCourses();
      this.getSubjects();
    }
  }

</script>

<style scoped>

</style>
