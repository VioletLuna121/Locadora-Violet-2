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

        <div  class="text-black" >Bem vindo(a) {{ username }}</div>
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
            <img :src="logo" class="Blogo LogoImg" />
            <router-link
              v-for="link in linksList"
              :key="link.title"
              :to="link.name || '#'"
              class="LinksList">

            <q-item @click="leftDrawerOpen = false">
              <q-item-section avatar>
                <q-icon :name="link.icon" size="28px"/>
              </q-item-section>

              <q-item-section>
                <q-item-label  class="text-body1 Links">{{ link.title }}</q-item-label>
              </q-item-section>

            </q-item>
          </router-link>
          <q-item-section style="color: #333333; display: flex; justify-content: center; align-items: center; margin-top: 50%;">
            <router-link to="/" style="">
              <q-btn flat icon="logout" size="25px" @click="logout" aria-label="Sair" style="color: #333333;"></q-btn>
            </router-link>
          </q-item-section>
        </q-list>
      </q-drawer>

    <q-page-container>
      <router-view :key="$route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import logo from '../assets/logo_escura.png';
import { useRoute } from 'vue-router'

function logout() {
  localStorage.removeItem("token"); // Remova o token de autenticação
  sessionStorage.removeItem("token"); // Caso o token esteja no sessionStorage
  window.location.href = "/"; // Redirecione para a página inicial ou de login
}

const username = ref('');

onMounted(() => {
  username.value = localStorage.getItem('username') || 'Usuário';
});

defineOptions({
  logo,
  name: 'MainLayout'
})

const linksList = [
{
    title: 'Dashboard',
    icon: 'dashboard',
    name: '/Dashboard',
  },
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
    background-color: #e0f8f9;
    width: 200px;
    border-right:1px solid rgba(0, 0, 0, 0.459) ;
  }
  .BLateral .Blogo{
    width: 110px;
    margin-left: 80px;
    margin-top: 15px;
  }
  .Links{
     position: relative;
     right:20px;
     padding: 0px;
     white-space: nowrap;

  }

  .LinksList {
  position: relative;
  text-decoration: none;
  color: rgba(0, 0, 0, 0.829);
  text-indent: 20px;
  display: block;
  overflow: hidden; 
  transition: all 0.4s;
}

.LinksList.router-link-active {
  background-color: #b3eef1;
  color: rgba(0, 0, 0, 0.829);
  font-weight: bold;

}


.LinksList:hover {
  background-color: #b3eef1;
  color: rgba(0, 0, 0, 0.829);



}

  .dashboard-title {
    font-size: 22px;
    font-weight: 400;
    border-left: 2px solid black;
    padding-left: 10px !important;
    margin-left: 5px;
    width: auto;
  }



</style>
