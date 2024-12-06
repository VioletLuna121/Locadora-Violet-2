<template>
  <q-layout>
    <q-page-container>
      <q-page class="Q-Page" padding >
        <img :src="logo" class="Loginlogo"/>
          <q-card class="C-PrinIndex" borderless>

            <q-card-section class="q-pa-md" style=" display: flex; justify-content: center; height: 13%; ">
             <div class="text-h4 text-weight-medium" style="display: flex; justify-content: center; color: #333333; ">Mudar Senha</div>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.699);"/>

            <q-card-section class="Card-Section-Two">
              <q-form  class="q-gutter-y-md"  @submit.prevent="MudarSenha">
                <password-input label="Senha" class="InP" v-model="password" borderless :rules="[val => !!val || 'Senha é obrigatória',
                                                                                                 val => val.length >= 8 || 'A senha está curta'
                                                                                                ]"
                />
                <password-input label="Repita a Senha"
                                class="InP"
                                v-model="repeatPassword"
                                borderless
                                :rules="[
                                  val => !!val || 'Senha é obrigatória',
                                  val => val === password || 'As senhas não coincidem'
                                ]"
                                />
                <q-input v-model="email" label="Email"  class="InP" borderless />
                <q-input v-model="code" label="Codigo Enviado"  class="InP" borderless/>
              </q-form>
            </q-card-section>

            <q-card-actions align="center" class="column">
              <q-btn label="Editar" class="Login" @click="MudarSenha"/>
            </q-card-actions>
          </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import logo from '../assets/logo_escura.png';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';


export default {
  // name: 'IndexLogin',
setup(){
  const password = ref('')
  const email = ref('')
  const code = ref('')
  const repeatPassword = ref('')
  const router = useRouter();


  const MudarSenha = async () => {
    console.log({
      newPassword: password.value,
      repeatPassword: repeatPassword.value,
      email: email.value,
      otpCode: code.value,
    });
      try {

        // Fazendo a requisição para a API
        const response = await api.post('/users/recovery/changePassword', {
          newPassword: password.value,
          repeatPassword: repeatPassword.value,
          email: email.value,
          otpCode: code.value,
        });

        console.log('Resposta da API:', response.data);

        // Exibe mensagem de sucesso
        alert('Senha alterada com sucesso!');
        router.push('/'); // Redireciona para a página inicial
      } catch (error) {
        console.error('Erro na mudança de senha:', error);
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 400) {
          alert('Erro: ' + (data?.message || 'Requisição inválida.'));
        } else if (status === 404) {
          alert('Erro: Email ou código não encontrado.');
        } else {
          alert('Erro ao mudar senha. Tente novamente mais tarde.');
        }
      }
    };

    return {
      password,
      repeatPassword,
      email,
      code,
      logo,
      router,
      MudarSenha,
    };
  },
};

</script>

<style>
  .C-PrinMudar{
    width: 30%;
    height: 425px;
    background-color: #ffffff;
    border-radius: 15px;
    border: solid 2px rgba(0, 0, 0, 0.699);
  }

  .C-PrinMudar .Card-Section-Two{
    margin-top: 2%;
    width: 80%;
    margin-left: 10%;
  }

  .Q-Page{
    background-color: #e0f8f9;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .C-PrinMudar .InP{
    border-radius: 10px;
    background-color: white;
    border: solid 2px rgba(0, 0, 0, 0.550);
    padding-left: 10px;
    height: 55px;
  }

  .C-PrinMudar .Login{
    background-color: #82e2e9;
    color:black;
    height: 20px;
    width: 100px;
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
