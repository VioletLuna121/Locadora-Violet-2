const routes = [
  {
    path: '/Main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    {
      path: '/CadUser',
      name: 'Cadastro de Usuário',
      component: () => import('pages/CadUsuarioVue.vue'),
      meta: { title: 'Cadastro de Usuário' }
    },
    {
      path: '/CadEdit',
      name: 'Cadastro de Editora',
      component: () => import('pages/CadEditoraVue.vue'),
      meta: { title: 'Cadastro de Editora' }
    },
    {
      path: '/CadLivro',
      name: 'Cadastro de Livro',
      component: () => import('pages/CadLivroVue.vue'),
      meta: { title: 'Cadastro de Livro' }
    },
    {
      path: '/CadLocatario',
      name: 'Cadastro de Locatário',
      component: () => import('pages/CadLocatarioVue.vue'),
      meta: { title: 'Cadastro de Locatário' }
    },
    {
      path: '/CadAluguel',
      name: 'Cadastro de Aluguel',
      component: () => import('pages/CadAluguelVue.vue'),
      meta: { title: 'Cadastro de Aluguel' }
    },
    {
      path: '/DashBoard',
      component: () => import('src/pages/DashBoardVue.vue')
    },

    ]
  },
  {
    path: '/',
    component: () => import('src/pages/IndexLoginPage.vue')
  },
  {
    path: '/RecSenha',
    component: () => import('src/pages/RecSenhaVue.vue')
  },
  {
    path: '/MudarSenha',
    component: () => import('src/pages/MudarSenhaVue.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
