<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="老师姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getClasses">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="classes" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="className" label="班级" width="120" sortable>
      </el-table-column>
      <el-table-column prop="grade" label="年级" width="120" :formatter="formatGrade" sortable>
      </el-table-column>
      <el-table-column prop="mainTeacher.name" label="班主任" min-width="160" sortable>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template scope="scope">
          <el-button size="small" @click="handleCourseTeacher(scope.$index, scope.row)">查看课程</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
      <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
      </el-pagination>
    </el-col>

    <el-dialog title="课程及任课老师" :visible.sync="courseTeachersVisible" :close-on-click-modal="false">
      <el-table :data="courseTeachers" highlight-current-row v-loading="listLoading" style="width: 100%;">
        <el-table-column type="index" width="60">
        </el-table-column>
        <el-table-column prop="course.subject.name" label="科目" min-width="180" sortable>
        </el-table-column>
        <el-table-column prop="teacher.name" label="老师" width="120" sortable>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="handleCourseTeacherEdit(classId, scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="courseTeacherEditFormVisible" :close-on-click-modal="false">
      <el-form :model="courseTeacherEditForm" label-width="80px" ref="courseTeacherEditForm">
        <el-form-item label="任课老师">
          <el-select v-model="courseTeacherEditForm.teacherId" placeholder="请选择">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="courseTeacherEditFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editCourseTeacherSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--编辑界面-->
    <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="班级" prop="className">
          <el-input v-model="editForm.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-radio-group v-model="editForm.grade">
            <el-radio class="radio" :label="1">一年级</el-radio>
            <el-radio class="radio" :label="2">二年级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班主任">
          <el-select v-model="editForm.mainTeacherId" placeholder="请选择">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id">
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
        <el-form-item label="班级" prop="className">
          <el-input v-model="addForm.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-radio-group v-model="addForm.grade">
            <el-radio class="radio" :label="1">一年级</el-radio>
            <el-radio class="radio" :label="2">二年级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="班主任">
          <el-select v-model="addForm.mainTeacherId" placeholder="请选择">
            <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id">
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
  import { getApi, postApi } from '../../api/api';
  const qs = require('qs');
  export default {
    data() {
      return {
        filters: {
          name: ''
        },
        classes: [],
        teachers: [],
        courseTeachers: [],
        classId: 0,
        grade: 0,
        total: 0,
        page: 1,
        listLoading: false,
        sels: [],//列表选中列

        editFormVisible: false,//编辑界面是否显示
        editLoading: false,
        editFormRules: {
          className: [
            { required: true, message: '请输入班级', trigger: 'blur' }
          ]
        },
        //编辑界面数据
        editForm: {
          id: 0,
          className: '',
          grade: -1,
          mainTeacherId: 0
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
          className: [
            { required: true, message: '请输入班级', trigger: 'blur' }
          ]
        },
        //新增界面数据
        addForm: {
          className: '',
          grade: -1,
          mainTeacherId: 0
        },
        courseTeachersVisible: false,
        courseTeacherEditFormVisible: false,
        courseTeacherEditForm: {
          id: 0,
          gradeCourseId: 0,
          teacherId: 0,
          subjectId: 0
        }

      }
    },
    methods: {
      formatGrade: function (row, column) {
        let str = ''
        console.log("grade:" + row.grade)
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
      handleCurrentChange(val) {
        this.page = val;
        this.getClasses();
      },
      //获取用户列表
      getClasses() {
        let para = {
          index: this.page - 1,
          size: 5,
          name: this.filters.name
        };
        this.listLoading = true;
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
            this.total = data.total;
            this.classes = data.classes;
            this.listLoading = false;
          }
          //NProgress.done();
        });
      },
      getTeachers() {
        let para = {
          index: 0,
          size: 1000,
          name: ''
        };
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
            this.teachers = data.teachers;
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
          postApi(qs.stringify(para),'class/deleteClass').then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getClasses();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        this.editFormVisible = true;
        this.editForm.id = row.id;
        this.editForm.className = row.className;
        this.editForm.grade = row.grade;
        this.editForm.mainTeacherId = row.mainTeacher.id;
      },
      //显示新增界面
      handleAdd: function () {
        console.log("add")
        this.addFormVisible = true;
        this.addForm = {
          className: '',
          grade: -1,
          mainTeacherId: ''
        };
      },
      handleCourseTeacher: function (index, row) {
        this.courseTeachersVisible = true;
        this.classId = row.id;
        this.grade = row.grade;
        let para = {
          id: row.id,
          grade: row.grade
        };
        this.listLoading = true;
        //NProgress.start();
        getApi(para,'class/courseTeachers').then((res) => {
          console.log(res);
          let { message, code, data } = res;
          if (code !== 200) {
            this.$message({
              message: message,
              type: 'error'
            });
          } else {
            console.log(JSON.stringify(data));
            this.courseTeachers = data.courseTeachers;
            this.listLoading = false;
          }
          //NProgress.done();
        });
      },
      handleCourseTeacherEdit: function (id, index, row) {
        this.courseTeacherEditFormVisible = true;
        this.courseTeacherEditForm.id = id;
        this.courseTeacherEditForm.gradeCourseId = row.course.id;
        if(row.teacher != undefined){
          this.courseTeacherEditForm.teacherId = row.teacher.id;
        }else{
          this.courseTeacherEditForm.teacherId = '';
        }
        this.courseTeacherEditForm.subjectId = row.course.subject.id;
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
              postApi(qs.stringify(para),'class/editClass').then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getClasses();
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
              // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              postApi(qs.stringify(para),'class/addClass').then((res) => {
                this.addLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['addForm'].resetFields();
                this.addFormVisible = false;
                this.getClasses();
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
            this.getClasses();
          });
        }).catch(() => {

        });
      },
      editCourseTeacherSubmit: function () {
        this.$refs.courseTeacherEditForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.courseTeacherEditForm);
              // para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
              postApi(qs.stringify(para),'class/editCourseTeacher').then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['courseTeacherEditForm'].resetFields();
                this.courseTeacherEditFormVisible = false;
                let para = {
                  id: this.classId,
                  grade: this.grade
                };
                this.listLoading = true;
                //NProgress.start();
                getApi(para,'class/courseTeachers').then((res) => {
                  console.log(res);
                  let { message, code, data } = res;
                  if (code !== 200) {
                    this.$message({
                      message: message,
                      type: 'error'
                    });
                  } else {
                    console.log(JSON.stringify(data));
                    this.courseTeachers = data.courseTeachers;
                    this.listLoading = false;
                  }
                  //NProgress.done();
                });;
              });
            });
          }
        });
      }
    },
    mounted() {
      this.getClasses();
      this.getTeachers();
    }
  }

</script>

<style scoped>

</style>
