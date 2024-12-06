<template>
  <q-layout>
    <q-page-container>
      <q-page class="Q-Page" padding>
        <img :src="logo" class="logo" />
        <q-card class="C-PrinRecSenha" borderless>
          <q-card-section
            class="q-pa-md"
            style="background-color:white; border-radius: 10px; display: flex; justify-content: center; height: 24%;"
          >
            <div class="text-h4 tituloModal">Recuperar Senha</div>
          </q-card-section>

          <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.699);" />

          <q-card-section class="Card-Section-Two">
            <q-form class="q-gutter-y-md">
              <q-input
                v-model="email"
                label="Email"
                class="InP"
                borderless
                type="email"
                required
              />
            </q-form>
          </q-card-section>

          <div
            style="font-size: 18px; font-weight: 400; margin-left: 60px; margin-bottom: 15px"
          >
            Senha será enviada para o email!
          </div>

          <q-card-actions align="center" class="column">
            <q-btn label="Enviar" class="Login" @click="RecuperaSenha" />
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import logo from "../assets/logo_escura.png";
import { useRouter } from "vue-router";
import { api } from "src/boot/axios";

export default {
  setup() {
    const email = ref(''); // Captura o email do usuário
    const router = useRouter();

    // Regex para validar formato de email
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    const RecuperaSenha = async () => {
      try {
        // Valida se o email foi preenchido e é válido
        if (!email.value) {
          alert("Por favor, insira um email.");
          return;
        }

        if (!validateEmail(email.value)) {
          alert("Por favor, insira um email válido.");
          return;
        }

        // Fazendo a requisição com email como query parameter
        const response = await api.post(
          `/users/recovery/requestRecoveryMail?email=${encodeURIComponent(email.value)}`,
          {}
        );

        console.log("Resposta da API:", response.data);

        // Notifica sucesso e redireciona para a página inicial
        alert("Email de recuperação enviado com sucesso!");
        router.push("/MudarSenha"); // Redireciona para a página inicial
      } catch (error) {
        // Captura e exibe mensagens detalhadas de erro
        console.error("Erro ao enviar email de recuperação:");
        console.error("Status:", error.response?.status);
        console.error("Dados:", error.response?.data);

        if (error.response?.status === 400) {
          alert("Email não encontrado ou inválido.");
        } else {
          alert(
            "Erro ao enviar email de recuperação. Tente novamente mais tarde."
          );
        }
      }
    };

    return {
      email,
      logo,
      router,
      RecuperaSenha,
    };
  },
};
</script>


<style>
  .C-PrinRecSenha{
    width: 30%;
    height: 270px;
    background-color: white;
    border-radius: 13px;
    border: solid 2px rgba(0, 0, 0, 0.699);
  }


  .C-PrinRecSenha .Card-Section-Two{
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

  .C-PrinRecSenha .InP{
    border-radius: 10px;
    background-color: white;
    border: solid 1px black;
    padding-left: 10px;
    height: 60px;
  }

  .C-PrinRecSenha .Login{
    background-color: #82e2e9;
    color:black;
    height: 40px;
    width: 100px;
    margin-bottom: 10px;
    position: relative;
    bottom: 13px;
  }

 .logo{
    position: absolute;
    top: -5px;
    left: 5px;
    width: 150px;
    height: auto;
    padding: 20px;

  }

  .C-PrinRecSenha .tituloModal {
  color: black;
  width: 100%;
  display: flex;
  justify-content: center;
}

</style>
