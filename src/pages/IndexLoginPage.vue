<template>
  <q-layout>
    <q-page-container>
      <q-page class="Q-Page" padding >
        <img :src="logo" class="Loginlogo"/>
          <q-card class="C-PrinIndex" borderless>

            <q-card-section class="q-pa-md" style=" display: flex; justify-content: center; height: 15%; ">
             <div class="text-h4 text-weight-medium" style="position: relative; bottom: 7px; left: 10px; color: #333333; ">Login</div>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.699);"/>

            <q-card-section class="Card-Section-Two">
              <q-form  class="q-gutter-y-md" @submit.prevent>
                <q-input v-model="username" label="Nome"  class="InP" borderless :rules="[nam => !!nam || 'Nome é obrigatório']"/>
                <password-input label="Senha" class="InP" v-model="password" borderless :rules="[val => !!val || 'Senha é obrigatória',
                                                                                                 val => val.length >= 8 || 'A senha está curta'
                                                                                                ]"
                />
              </q-form>
            </q-card-section>

            <q-checkbox label="Lembrar-me" class="checkbox" v-model="lembrarMe" />

            <q-card-actions align="center" class="column">
              <q-btn label="Entrar" class="Login" @click="LoginButtom"/>
              <q-btn  label="Esqueceu a Senha?" flat style="position: relative; bottom: 10px;" @click="RecSenha"/>
            </q-card-actions>
          </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import logo from '../assets/logo_escura.png';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';


export default {
  // name: 'IndexLogin',
setup(){
  const password = ref('')
  const username = ref('')
  const lembrarMe = ref(false)
  const router = useRouter();

  onMounted(() => {
      const LembreMeNome = localStorage.getItem('LembreMeNome');
      if (LembreMeNome) {
        username.value = LembreMeNome;
        lembrarMe.value = true; // Checkbox marcado automaticamente
      }
    });

  const LoginButtom = async () => {
    try {
      // Enviando a requisição de login para a API
      const response = await api.post('/auth/login', {
        username: username.value,
        password: password.value,
      });

      if (response.data && response.data.token) {
        // Salvando o token, username e role no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('role', response.data.role);

           // Armazenar o nome de usuário se "Lembrar-me" estiver marcado
      if (lembrarMe.value) {
        localStorage.setItem('LembreMeNome', username.value);
      } else {
        localStorage.removeItem('LembreMeNome');
      }

         // Notificação de sucesso
         Notify.create({
            type: 'positive',
            message: 'Login realizado com sucesso!',
            position: 'bottom-right',
            timeout: 1500,
          });

        // Redirecionando para o Dashboard após o login
        router.push('/DashBoard');
      } else {
        Notify.create({
            type: 'negative',
            message: 'Erro no login. Dados inválidos.',
            position: 'bottom-right',
            timeout: 1500,
          });
      }
    } catch (error) {
      Notify.create({
          type: 'negative',
          message: 'Erro ao tentar fazer login. Verifique os dados e tente novamente.',
          position: 'bottom-right',
          timeout: 1500,
        });
    }
  };

    const  RecSenha = async () => {
      router.push('/RecSenha');
    }


  return{
    password,
    lembrarMe,
    logo,
    username,
    router,
    LoginButtom,
    RecSenha
  }
}
}

</script>

<style >
  .C-PrinIndex{
    width: 30%;
    height: 390px;
    background-color: #ffffff;
    border-radius: 15px;
    border: solid 2px rgba(0, 0, 0, 0.699);
  }

  .C-PrinIndex .Card-Section-Two{
    margin-top: 4%;
    width: 80%;
    margin-left: 10%;
  }

  .Q-Page{
    background-color: #e0f8f9;
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
    border: solid 2px rgba(0, 0, 0, 0.550);
    padding-left: 10px;
    height: 60px;
  }

  .C-PrinIndex .Login{
    background-color: #82e2e9;
    color:black;
    height: 40px;
    width: 100px;
    margin-bottom: 10px;
    position: relative;
    bottom: 10px;
  }

 .Loginlogo{
    position: absolute;
    top: -5px;
    left: 5px;
    width: 150px;
    height: auto;
    padding: 20px;

  }

</style>
