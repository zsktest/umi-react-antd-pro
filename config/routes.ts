export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: '@/pages/user',
          },
        ],
      },
    ],
  },
  {
    path: '/client/enterprise/index',
    extract: true,
    component: '@/pages/client/enterprise',
    layout: false,
  },
  {
    path: '/s',
    extract: true,
    component: '@/pages/client/invitation/enterprise',
    layout: false,
  },
  {
    path: '/client/invitation/success',
    extract: true,
    component: '@/pages/client/invitation/success',
    layout: false,
  },
  {
    path: '/approval',
    component: '@/pages/approval',
    layout: false,
  },
  // {
  //   path: '/welcome',
  //   name: 'welcome',
  //   icon: 'smile',
  //   component: './Welcome',
  // },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },

  {
    name: '仪表盘',
    icon: 'icon-index',
    path: '/home',
    component: '@/pages/home',
  },
  {
    name: '账号管理',
    icon: 'icon-account',
    path: '/account/list',
    component: '@/pages/account',
  },
  {
    path: '/privateAccount/list', /*私有云账号管理*/
    component: '@/pages/privateAccount',
  },
  {
    //name: '账号详情',
    //icon: 'icon-account',
    path: '/account/detail',
    component: '@/pages/account/detail',
  },
  {
    path: '/dispatch',
    name: '调度中心',
    icon: 'icon-robot',
    routes: [
      {
        path: '/dispatch/robot/list',
        name: '机器人管理',
        component: '@/pages/dispatch/robot'
      },
      {
        path: '/dispatch/plans/list',
        name: '计划执行',
        component: '@/pages/dispatch/plans'
      }
    ]
  },
  {
    name: '应用管理',
    icon: 'icon-application',
    path: '/application',
    component: '@/pages/application',
  },
  {
    path: '/application/detail',
    component: '@/pages/application/detail',
  },
  {
    name: '服务购买',
    icon: 'icon-icon_service',
    path: '/wallet',
    routes: [
      {
        path: '/wallet/list',
        name: '服务管理',
        component: '@/pages/wallet',
      },
      {
        path: '/wallet/detail',
        name: '服务消耗详情',
        component: '@/pages/wallet/detail'
      }
    ]
  },
  {
    name: '订单管理',
    icon: 'icon-icon_service',
    path: '/order',
    component: '@/pages/order',
  },
  {
    name: '激活码',
    icon: 'icon-code',
    path: '/author',
    component: '@/pages/author',
  },
  {
    path: '/tripartite',
    component: '@/pages/author/components/Tripartite',
  },
  {
    name: '许可证列表',
    icon: 'icon-set',
    path: '/licence',
    component: '@/pages/licence',
  },
  {
    name: '客户端版本',
    icon: 'icon-set',
    path: '/Clientversion',
    component: '@/pages/Clientversion',
  },
  {
    name: 'Python包管理',
    icon: 'icon-set',
    path: '/Python',
    component: '@/pages/Python',
  },
  {
    name: '设置',
    icon: 'icon-set',
    path: '/setting',
    component: '@/pages/setting',
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    component: '@/pages/404',
  },
];
