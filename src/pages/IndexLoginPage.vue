<template>
  <q-layout>
    <q-page-container>
      <q-page class="Q-Page" padding >
        <img :src="logo" class="Loginlogo"/>
          <q-card class="C-PrinIndex" borderless>

            <q-card-section class="q-pa-md" style="background-color:#333333; border-radius: 10px; display: flex; justify-content: center; height: 15%; ">
             <div class="text-h4 text-white text-weight-medium" style="position: relative; bottom: 7px; left: 10px; ">Login</div>
            </q-card-section>

            <q-separator/>

            <q-card-section class="Card-Section-Two">
              <q-form  class="q-gutter-y-md">
                <q-input v-model="name" label="Nome"  class="InP" borderless :rules="[nam => !!nam || 'Nome é obrigatório']"/>
                <password-input label="Senha" class="InP" v-model="password" borderless :rules="[val => !!val || 'Senha é obrigatória',
                                                                                                 val => val.length >= 8 || 'A senha está curta'
                                                                                                ]"
                />
              </q-form>
            </q-card-section>

            <q-checkbox label="Lembrar-me" class="checkbox" v-model="lembrarMe" />

            <q-card-actions align="center" class="column">
              <q-btn label="Entrar" class="Login" @click="LoginButtom" />
              <q-btn  label="Esqueceu a Senha?" flat style="position: relative; bottom: 10px;" @click="EsqueceuSenha"/>
            </q-card-actions>
          </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import logo from '../assets/WDA GROUP LOGO.png';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';


export default {
  // name: 'IndexLogin',
setup(){
  const password = ref('')
  const name = ref('')
  const lembrarMe = ref(false)
  const router = useRouter();

  const LoginButtom = async () => {
    try {
      const response = await api.post( '/auth/login', {
        username: name.value,
        password: password.value,
      });

      // Se o login for bem-sucedido, armazene o token no localStorage
      if (response.data && response.data.token) {
          localStorage.setItem('token', response.data.token); // Armazenando o token JWT
          router.push('/DashBoard'); // Redirecionando para o Dashboard
        }
          else {
          console.log('Erro no login:', response);
        }
      } catch (error) {
        console.error('Erro na autenticação:', error);
      }
  };

  return{
    password,
    lembrarMe,
    logo,
    name,
    router,
    LoginButtom,
  }
}
}

</script>

<style lang="scss">
  .C-PrinIndex{
    width: 30%;
    height: 390px;
    background-color: $primary;
    border-radius: 15px;
    border: solid 3px black;
  }
  .C-PrinIndex .Card-Section-One{
    background-color: $secondary;
    text-align: center;
    height: 60px;
    align-items: center;
    justify-content: center;
    display: flex;
    border: solid 3px black;
  }

  .C-PrinIndex .Card-Section-Two{
    margin-top: 5%;
    width: 80%;
    margin-left: 10%;
  }

  .Q-Page{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .checkbox{
    margin-left: 15%;
    display: flex;
    position: relative;
    bottom: 10px;
  }

  .C-PrinIndex .InP{
    border-radius: 10px;
    background-color: white;
    border: solid 1px black;
    padding-left: 10px;
    height: 60px;
  }

  .C-PrinIndex .Login{
    background-color: $secondary;
    color:white;
    height: 40px;
    width: 100px;
    margin-bottom: 10px;
    position: relative;
    bottom: 10px;
  }

  .Loginlogo{
    position: absolute;
    top: 15px;
    left: 20px;
    width: 100px;
    height: auto;
  }

</style>
