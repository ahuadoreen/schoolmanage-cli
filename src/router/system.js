import Main from '@/components/Home'
import Teachers from '@/components/system/Teachers'
import Subject from '@/components/system/Subject'
import GradeCourse from '@/components/system/GradeCourse'
import Class from '@/components/system/Class'
import Student from '@/components/system/Student'

const SystemRouter = [{
    path: '/system',
    name: '系统中心',
    component: Main,
    iconCls: 'fa fa-address-card',
    children: [
      {
        path: '/system/Student',
        component: Student,
        name: '学生管理'
      },
      {
      path: '/system/Class',
      component: Class,
      name: '班级管理'
    },{
      path: '/system/GradeCourse',
      component: GradeCourse,
      name: '年级课程管理'
    },{
      path: '/system/Teachers',
      component: Teachers,
      name: '教师管理'
    },
      {
        path: '/system/Subject',
        component: Subject,
        name: '科目管理'
      }]
}]

export {
    SystemRouter
}
