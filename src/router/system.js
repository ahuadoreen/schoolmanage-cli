import Main from '@/components/Home'
import Teachers from '@/components/system/Teachers'
import Subject from '@/components/system/Subject'

const SystemRouter = [{
    path: '/system',
    name: '系统中心',
    component: Main,
    iconCls: 'fa fa-address-card',
    children: [{
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
