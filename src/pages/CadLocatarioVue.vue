<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom" v-if="user.role === 'ADMIN'"/>
          <BarraPesquisa class="BPesquisa"  v-model="BPesquisarRenters" @input="PagesRenters"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}" :user-type="'VISITOR'"/>

        <!-- Modal para Novo Locatário -->
        <q-dialog v-model="JModalNew" class="JmodalRenter Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Locatário</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section style="padding-top: 5px;">
              <q-form>
                <div class="form">
                  <div style="width: 260px;">
                    <q-input v-model="newUser.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="newUser.email" label="Email" type="email" required borderless  class="InP"/>
                    <q-input v-model="newUser.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="newUser.address" label="Endereço" required borderless  class="InP"/>
                    <q-input v-model="newUser.cpf" label="CPF" borderless  class="InP"/>
                  </div>
                </div>
                <q-btn type="submit" label="Cadastrar" class="CadastroButtom" @click="CadRenters"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Livro -->
        <q-dialog v-model="AbrirModalView" class="JmodalRenter Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados do Livro</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section style="padding-top: 5px;">
              <q-form>
                <div class="form">
                  <div style="width: 260px;">
                    <q-input v-model="DadosRenters.name" label="Nome" disable borderless  class="InP"/>
                    <q-input v-model="DadosRenters.email" label="Email" type="email" disable borderless  class="InP"/>
                    <q-input v-model="DadosRenters.telephone" label="Telefone" type="tel" disable borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="DadosRenters.address" label="Endereço" disable borderless  class="InP"/>
                    <q-input v-model="DadosRenters.cpf" label="CPF"  disable borderless  class="InP"/>
                  </div>
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar a Livro -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalRenter Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section style="padding-top: 5px;">
              <q-form>
                <div class="form">
                  <div style="width: 260px;">
                    <q-input v-model="selectedRenters.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
                    <q-input v-model="selectedRenters.name" label="Nome" required borderless  class="InP"/>
                    <q-input v-model="selectedRenters.email" label="Email" type="email" required borderless  class="InP"/>
                  </div>

                  <div>
                    <q-input v-model="selectedRenters.address" label="Endereço" required borderless  class="InP"/>
                    <q-input v-model="selectedRenters.cpf" label="CPF" borderless  class="InP"/>
                  </div>
                </div>
                <q-btn type="submit" label="Editar" class="CadastroButtom" @click="EditarRenters"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDeleteModal" class="DeleteModal JmodalRenter Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você realmente deseja deletar este Locatário?</p>
            </q-card-section>

            <q-card-section class=" q-gutter-sm q-pt-none CardButtonDelete">
              <div class="q-gutter-md buttonsDelete">
                <q-btn label="Sim" color="red" class="Button" @click="deletarRenters"/>
                <q-btn label="Não" color="dark" @click="AbrirDeleteModal = (false)" class="Button"/>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
        <q-card-section  class="PaginacaoContainer q-px-md q-py-sm"
        style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; ">
          <q-btn flat icon="arrow_left" class="Paginacao icon-larger" @click="backPage" aria-label="Página anterior"></q-btn>
          <q-btn flat icon="arrow_right"  class="Paginacao icon-larger" @click="nextPage" aria-label="Próxima página"></q-btn>
        </q-card-section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import ConfirmDeleteImg from '../assets/No_Delete.png';
import { api } from '/src/boot/axios';
import { Notify } from 'quasar';

export default {
  setup() {
    // Estados para controle dos modais
    const JModalNew = ref(false);
    const AbrirModalView = ref(false);
    const AbrirModalEdit = ref(false);
    const AbrirDeleteModal = ref(false);
    const BPesquisarRenters = ref('');

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
    };

    const viewItem = (row) => {
      BuscarDadosRenters(row.id);
      selectedRenters.value = row;
      AbrirModalView.value = true;
    };

    const editItem = (row) => {
      console.log('Editando:', row);
      selectedRenters.value = row;
      AbrirModalEdit.value = true;
    };

    const deleteItem = (row) => {
      console.log('Deletando:', row);
      selectedRenters.value = row;
      AbrirDeleteModal.value = true;
    };

    const user = ref({ role: '' });

    // Função para validar o papel do usuário
    const userValid = () => {
    const role = localStorage.getItem('role');
    if (role) {
      user.value.role = role;
    } else {
      console.warn("Função não encontrada em localStorage. Definindo como 'VISITOR' por padrão");
      user.value.role = 'ADMIN'; // Define como 'VISITOR' se não existir
    }
    };

    // Dados para a tabela
    const tableColumns = ref([
      { name: 'id', label: 'ID', align: 'center', field: row => row.id },
      { name: 'name', label: 'Nome', align: 'center', field: row => row.name },
      { name: 'telephone', label: 'Telefone', align: 'center', field: row => row.telephone },
      { name: 'email', label: 'Email', align: 'center', field: row => row.email },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([]);

    const currentPage = ref(0);

     // Função para buscar todos os locatarios de uma vez
     const PagesRenters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/renter`, {
          params: { size: 7,page:currentPage.value, sort: 'id', direction: 'ASC', search:BPesquisarRenters.value },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifique se há dados na resposta
        if (response.data && response.data.content) {
          tableData.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }
      } catch (error) {
      // Exibir mensagem de erro
      const errorMessage =
        error.response?.data?.message || 'Erro ao carregar Locatários';
      Notify.create({
        type: 'negative',
        message: `${errorMessage}`,
        position: 'bottom-right',
        timeout: 1500,
      });
    }
    };

        onMounted(() => {
          PagesRenters();
          userValid();
        });

        watch(BPesquisarRenters, () => {
          PagesRenters(); // Recarrega a pesquisa sempre que o termo for alterado
        });


    const CadRenters = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await api.post('/renter',{

          name: newUser.value.name,
          email: newUser.value.email,
          telephone: newUser.value.telephone,
          address: newUser.value.address,
          cpf: newUser.value.cpf,

        },
        {
          headers: {Authorization: `Bearer ${token}`}
        }
        );

        if (response.status === 201) {

        // Fechar o modal e limpar o formulário
        JModalNew.value = false;
        newUser.value = {
          name: '',
          email: '',
          telephone:'',
          address:'',
          cpf:'', };
        }
        Notify.create({
            type: 'positive',
            message: 'Locatário cadastrado com sucesso!',
            position: 'bottom-right',
            timeout: 1500,
          });
        await PagesRenters();
      } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Erro ao cadastrar Locatário.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
    };

    const DadosRenters = ref({}); // Inicializado como objeto vazio para evitar problemas de acesso

    const BuscarDadosRenters = async (rentersID) => {
      try {
        console.log("Buscando dados do locatário com ID:", rentersID);
        const token = localStorage.getItem('token');
        const response = await api.get(`/renter/${rentersID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        DadosRenters.value = response.data;
        console.log("Dados do Locatário carregados:", DadosRenters.value);

        Notify.create({
            type: 'positive',
            message: 'Dados do Locatário',
            position: 'bottom-right',
            timeout: 1500,
          });

        AbrirModalView.value = true;
        } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Erro ao carregar dados.';
        Notify.create({
          type: 'negative',
          message: `Erro ao carregar usuários: ${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
      };

      const EditarRenters = async () => {
        try {
          const token = localStorage.getItem('token');

          // Chamada PUT para atualizar o usuário
          const response = await api.put(`/renter`,{

              id: selectedRenters.value.id,
              name: selectedRenters.value.name,
              email: selectedRenters.value.email,
              telephone: selectedRenters.value.telephone,
              address: selectedRenters.value.address,
              cpf: selectedRenters.value.cpf,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

            // Verifica se a atualização foi bem-sucedida
            if (response.status === 204) {
              console.log('Editora atualizada com sucesso.');
              AbrirModalEdit.value = false; // Fecha o modal de edição
              await PagesRenters(); // Atualiza a lista de usuários
            } else {
              console.warn('A API retornou um status inesperado:', response.status);
            }

            Notify.create({
            type: 'positive',
            message: 'Locatário editado com sucesso!',
            position: 'bottom-right',
            timeout: 1500,
          });
          } catch (error) {
          // Exibir mensagem de erro
          const errorMessage =
            error.response?.data?.message || 'Erro ao editar Locatário.';
          Notify.create({
            type: 'negative',
            message: `${errorMessage}`,
            position: 'bottom-right',
            timeout: 1500,
          });
        }
        };

      const deletarRenters = async () => {
        try {
          const token = localStorage.getItem('token');
          const rentersID = selectedRenters.value?.id;

          if (!rentersID) {
            console.error('Erro: ID do locatário não encontrado para exclusão.');
            return;
          }
          console.log(`Iniciando exclusão do livro com ID: ${rentersID}`);

          // Chamada para exclusão do locatário
          const response = await api.delete(`/renter/${rentersID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 204) {
            console.log('Locatário excluída com sucesso.');
            AbrirDeleteModal.value = false; // Fecha o modal de exclusão
            await PagesRenters(); // Atualiza a lista do livro
          } else {
            console.warn(`A API retornou um status inesperado: ${response.status}`);
          }
          Notify.create({
            type: 'positive',
            message: 'Locatário deletada com sucesso!',
            position: 'bottom-right',
            timeout: 1500,
          });
        } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Erro ao deletar Locatário.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
      };

    const selectedRenters = ref(null);
    const newUser = ref({
      name: '',
      email: '',
      telephone:'',
      address:'',
      cpf:'',
    });
    const password = ref('');

    const nextPage = () => {
      currentPage.value++;
      PagesRenters();
    };

    const backPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
        PagesRenters();
      }
    };

    return {
      JModalNew,
      AbrirModalView,
      AbrirModalEdit,
      AbrirDeleteModal,
      openModalNew,
      viewItem,
      editItem,
      deleteItem,
      tableData,
      tableColumns,
      selectedRenters,
      newUser,
      password,
      ConfirmDeleteImg,
      PagesRenters,
      CadRenters,
      BuscarDadosRenters,
      DadosRenters,
      EditarRenters,
      deletarRenters,
      BPesquisarRenters,
      user,
      nextPage,
      backPage
    };
  }
};
</script>

<style>
.PPage {
  margin: 30px 60px 0px 70px;
}

.TCima {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.JmodalRenter {
  backdrop-filter: blur(3px);
}

.JmodalRenter .CardSectionTitulo {
  background-color: #ffffff;
  height: 60px;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-radius: 15px !important;
}

.JmodalRenter .tituloModal {
  color: black;
  width: 100%;
  display: flex;
  justify-content: center;
}

.JmodalRenter .ModalCard {
  background-color: #ffffff;
  border: 2px solid black;
  border-radius: 20px;
}

.JmodalRenter .form{
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 25px;

}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalRenter .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 2px rgba(0, 0, 0, 0.550);
  padding-left: 10px;
  width: 240px;
  height: 50px;
}

.InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.JmodalRenter .CadastroButtom {
  margin-left: 40%;
  margin-bottom: 10px;
  background-color: #82e2e9;
}

.JmodalRenter .EditarButtom{
  margin-left: 150px;
  margin-top: 20px;
  margin-bottom: 10px;
}

.DeleteModal {
  backdrop-filter: blur(2px);
}

.DeleteModalCard {
  background-color: #ffffff;
  width: 400px;
  height: 380px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 2px solid black;

}

.textDelete {
  color: black;
  font-weight: bold;
  font-size: 17px;
  text-align: center;

}

.DeleteImg {
  width: 200px;
  height: 200px;
}

.center{
 display: flex;
 align-items: center;
 justify-content: center;
}

.CardButtonDelete{
  width: 60%;
}

.buttonsDelete {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  display: flex;
  gap: 40px;

}

.Button{
  width: 100px;
}

.padding_zero{
  padding: 0px;
}

.Paginacao{
  color: #333333;
  border: solid 1px rgba(0, 0, 0, 0.795);
  height: 40px;
  width: 50px;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.479);

}

.icon-larger .q-icon {
  font-size: 40px; /* Ajuste o tamanho do ícone */
  display: flex;
  position: relative;
  bottom: 5px;
}

</style>
