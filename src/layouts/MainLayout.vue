  <template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="toolbar">
          <q-btn
            v-if="!isDashboardPage"
            class="text-black"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title class="text-black" :class="{ 'dashboard-title': isDashboardPage }">
            {{ pageTitle }}
          </q-toolbar-title>

          <div  class="text-black" >Bem vindo(a) <!--{{ $User }}--></div>
          <q-btn flat icon="account_circle" aria-label="Perfil" class="text-black"/>

        </q-toolbar>
      </q-header>


          <q-drawer
          class=" BLateral"
          v-model="leftDrawerOpen"
          show-if-above
          bordered
          >
            <q-list>
              <router-link to="/DashBoard" class="LogoImg">
                <img :src="logo" class="logo" />
              </router-link>
              <router-link
                v-for="link in linksList"
                :key="link.title"
                :to="link.name || '#'"
                style="text-decoration: none; color: white">

              <q-item @click="leftDrawerOpen = false">
                <q-item-section avatar>
                  <q-icon :name="link.icon" size="28px"/>
                </q-item-section>

                <q-item-section>
                  <q-item-label  class="text-body1 Links">{{ link.title }}</q-item-label>
                </q-item-section>

                <q-item-section avatar>
                  <q-icon name="chevron_right" size="28px"/>
                </q-item-section>

              </q-item>
            </router-link>
          </q-list>
        </q-drawer>

      <q-page-container>
        <router-view :key="$route.fullPath"/>
      </q-page-container>
    </q-layout>
  </template>

  <script setup>
  import { ref, computed } from 'vue'
  import logo from '../assets/WDA GROUP LOGO.png';
  import { useRoute } from 'vue-router'

  defineOptions({
    logo,
    name: 'MainLayout'
  })

  const linksList = [
    {
      title: 'Cadastro de Usuário',
      icon: 'person',
      name: '/CadUser',
    },
    {
      title: 'Cadastro de Editora',
      icon: 'feed',
      name: '/CadEdit'
    },
    {
      title: 'Cadastro de Livro',
      icon: 'book',
      name: '/CadLivro'
    },
    {
      title: 'Cadastro de Locatário',
      icon: 'home',
      name: '/CadLocatario'
    },
    {
      title: 'Cadastro de Aluguel',
      icon: 'paid',
      name: '/CadAluguel'
    }
  ]



  function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
  }

  const leftDrawerOpen = ref(false);
  const route = useRoute()

  const pageTitle = computed(() => route.meta.title || 'Dashboard')

  const isDashboardPage = computed(() => route.path === '/DashBoard')

  </script>


  <style>
    .toolbar{
      background-color: white;
    }
    .BLateral{
      background-color: #303030;
      width: 200px;
      border-right:1px solid black ;
    }
    .LogoImg .logo{
      width: 130px;
      margin-left: 70px;
      margin-top: 15px;
    }
    .Links{
       position: relative;
       right:10px;
       padding: 0px;
       white-space: nowrap;
    }

    .dashboard-title {
      font-size: 22px; /* Aumenta o tamanho da fonte */
      font-weight: 400;
      border-left: 2px solid black;
      padding-left: 10px !important;
      margin-left: 5px;
      width: auto; /* Permitir que a largura seja ajustada automaticamente */
      }

  </style>
