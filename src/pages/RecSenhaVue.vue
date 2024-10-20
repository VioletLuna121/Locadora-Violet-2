<template>
  <q-layout>
    <q-page-container>
      <q-page class="Q-Page" padding >
        <img :src="logo" class="logo"/>
          <q-card class="C-PrinRecSenha" borderless>

            <q-card-section class="q-pa-md" style="background-color:#333333; border-radius: 10px; display: flex; justify-content: center; height: 24%; ">
             <div class="text-h4 text-white text-weight-medium" style="position: relative; bottom: 7px; left: 10px; ">Recuperar Senha</div>
            </q-card-section>

            <q-separator/>

            <q-card-section class="Card-Section-Two">
              <q-form  class="q-gutter-y-md">
                <q-input label="Email"  class="InP" borderless type="email" required/>

              </q-form>
            </q-card-section>

            <div style="font-size: 18px; font-weight:400; margin-left: 60px; margin-bottom: 15px">Senha será enviada para o email!</div>

            <q-card-actions align="center" class="column">
              <q-btn label="Enviar" class="Login" />
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


export default {
  // name: 'IndexLogin',
setup(){
  const password = ref('')
  const name = ref('')
  const lembrarMe = ref(false)
  const router = useRouter();

  const LoginButtom = () =>{
    if(name.value === 'Violet' && password.value === 'admin123'){
      console.log('Login bem-sucedido');

      router.push('/DashBoard')
    }
    else{
      console.error('Nome ou senha inválidos ');
      alert('Nome ou senha inválidos!');
    }
  };

  const EsqueceuSenha = () =>{
    router.push('/RecSenha');
  }

  return{
    password,
    lembrarMe,
    logo,
    name,
    LoginButtom,
    router,
    EsqueceuSenha
  }
}
}

</script>

<style lang="scss">
  .C-PrinRecSenha{
    width: 30%;
    height: 270px;
    background-color: $primary;
    border-radius: 15px;
    border: solid 3px black;
  }
  .C-PrinRecSenha .Card-Section-One{
    background-color: $secondary;
    text-align: center;
    height: 60px;
    align-items: center;
    justify-content: center;
    display: flex;
    border: solid 3px black;
  }

  .C-PrinRecSenha .Card-Section-Two{
    margin-top: 4%;
    width: 80%;
    margin-left: 10%;
  }

  .Q-Page{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .C-PrinRecSenha .InP{
    border-radius: 10px;
    background-color: white;
    border: solid 1px black;
    padding-left: 10px;
    height: 60px;
  }

  .C-PrinRecSenha .Login{
    background-color: $secondary;
    color:white;
    height: 40px;
    width: 100px;
    margin-bottom: 10px;
    position: relative;
    bottom: 13px;
  }

  .logo{
    position: absolute;
    top: 15px;
    left: 20px;
    width: 100px;
    height: auto;
  }

</style>
