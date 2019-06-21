import Main from '@/components/Home'
import Contract from '@/components/system/Contract'

const SystemRouter = [{
    path: '/system',
    name: '系统中心',
    component: Main,
    iconCls: 'fa fa-address-card',
    children: [{
        path: '/system/contract',
        component: Contract,
        name: '联系人管理'
    }]
}]

export {
    SystemRouter
}