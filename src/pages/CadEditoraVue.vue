<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"  v-if="!isVisitor"/>
          <BarraPesquisa class="BPesquisa"  v-model="BPesquisarPublisher" @input="PagesPublisher"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{view: viewItem, edit: editItem, delete: deleteItem}" :user-type="'VISITOR'"/>

        <!-- Modal para Nova Editora -->
        <q-dialog v-model="JModalNew" class="JmodalPublisher Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Editora</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section>
              <q-form>
                <q-input v-model="newUser.name" label="Editora" required borderless  class="InP"/>
                <q-input v-model="newUser.email" label="Email" type="email" required borderless  class="InP"/>
                <q-input v-model="newUser.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
                <q-input v-model="newUser.site" label="Site"  borderless  class="InP"/>

                <q-btn type="submit" label="Cadastrar" class="CadastroButtom" @click="CadPublisher"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Visualizar Editora -->
        <q-dialog v-model="AbrirModalView" class="JmodalPublisher Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section c   lass="CardSectionTitulo">
              <div class="text-h4 tituloModal">Dados da Editora</div>
              <q-btn flat round icon="close" @click="AbrirModalView = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section class="marginBottom">
              <q-input v-model="DadosPublisher.id" label="ID" borderless class="InP" disable />
              <q-input v-model="DadosPublisher.name" label="Editora" borderless class="InP" disable />
              <q-input v-model="DadosPublisher.email" label="Email" type="email" borderless class="InP" disable />
              <q-input v-model="DadosPublisher.telephone" label="Telefone" type="tel" borderless class="InP" disable />
              <q-input v-model="DadosPublisher.site" label="Site" borderless class="InP InputView" disable />
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Editar a Editora -->
        <q-dialog v-model="AbrirModalEdit" class="JmodalPublisher Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Editar Dados</div>
              <q-btn flat round icon="close" @click="AbrirModalEdit = false" class="absolute-top-right"  color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section>
              <q-input v-model="selectedPublisher.id" label="Editora" disable borderless  class="InP"/>
              <q-input v-model="selectedPublisher.name" label="Editora" required borderless  class="InP"/>
              <q-input v-model="selectedPublisher.email" label="Email" type="email" required borderless  class="InP"/>
              <q-input v-model="selectedPublisher.telephone" label="Telefone" type="tel" required borderless  class="InP"/>
              <q-input v-model="selectedPublisher.site" label="Site"  borderless  class="InP"/>

              <q-btn label="Salvar" class="EditarButtom" @click="EditarPublisher"/>
            </q-card-section>
          </q-card>
        </q-dialog>

        <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDeleteModal" class="DeleteModal JmodalPublisher Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você realmente deseja deletar esta Editora?</p>
            </q-card-section>

            <q-card-section class=" q-gutter-sm q-pt-none CardButtonDelete">
              <div class="q-gutter-md buttonsDelete">
                <q-btn label="Sim" color="red" class="Button" @click="deletarPublisher"/>
                <q-btn label="Não" color="dark" @click="AbrirDeleteModal = (false)" class="Button"/>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import ConfirmDeleteImg from '../assets/No_Delete.png';
import { api } from 'src/boot/axios';

export default {
  setup() {
    // Estados para controle dos modais
    const JModalNew = ref(false);
    const AbrirModalView = ref(false);
    const AbrirModalEdit = ref(false);
    const AbrirDeleteModal = ref(false);
    const BPesquisarPublisher = ref('');

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
    };

    const viewItem = (row) => {
      BuscarDadosPublisher(row.id);
      selectedPublisher.value = row;
      AbrirModalView.value = true;
    };

    const editItem = (row) => {
      console.log('Editando:', row);
      selectedPublisher.value = row;
      AbrirModalEdit.value = true;
    };

    const deleteItem = (row) => {
      console.log('Deletando:', row);
      selectedPublisher.value = row;
      AbrirDeleteModal.value = true;
    };

    const userType = ref(localStorage.getItem('userType') || 'VISITOR'); // Obtém o tipo de usuário
    const isVisitor = ref(userType.value === 'VISITOR'); // Verifica se é visitante

    const tableData = ref([]);

    // Dados para a tabela
    const tableColumns = ref([
      { name: 'id', label: 'ID', align: 'center', field: row => row.id },
      { name: 'name', label: 'name', align: 'center', field: row => row.name },
      { name: 'telephone', label: 'Telefone', align: 'center', field: row => row.telephone },
      { name: 'site', label: 'Site', align: 'center', field: row => row.site },
      { name: 'email', label: 'Email', align: 'center', field: row => row.email },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

      // Função para buscar todos as editoras de uma vez
      const PagesPublisher = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/publisher`, {
          params: { size: 1000, sort: 'id', direction: 'ASC', search: BPesquisarPublisher.value },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifique se há dados na resposta
        if (response.data && response.data.content) {
          tableData.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }
      } catch (error) {
        console.error('Erro ao buscar editoras:', error.response?.data || error.message);
      }
    };

        // Chame `BuscarUser` ao montar
        onMounted(() => {
          PagesPublisher();
        });

        watch(BPesquisarPublisher, () => {
          PagesPublisher(); // Recarrega a pesquisa sempre que o termo for alterado
        });

    const CadPublisher = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await api.post('/publisher',{

          name: newUser.value.name,
          email: newUser.value.email,
          telephone: newUser.value.telephone,
          site: newUser.value.site,
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
          telephone: '',
          site: '' };
        }
      } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.response?.data || error.message);
      }
    };

    const DadosPublisher = ref({}); // Inicializado como objeto vazio para evitar problemas de acesso

    const BuscarDadosPublisher = async (publisherID) =>{
      try{
        console.log("Buscando dados da Editora com ID:", publisherID); // Log para depuração
        const token = localStorage.getItem('token');
        const response = await api.get(`/publisher/${publisherID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        DadosPublisher.value = response.data; // Armazena os detalhes da editora
        console.log("Dados da editora carregados:", DadosPublisher.value); // Log dos dados carregados

        // Abre o modal de visualização após carregar os dados
        AbrirModalView.value = true;
      } catch (error) {
        console.error('Erro ao buscar detalhes da editora:', error.response?.data || error.message);
      }
    };

    const EditarPublisher = async () => {
      try {
        const token = localStorage.getItem('token');

        // Chamada PUT para atualizar o usuário
        const response = await api.put(`/publisher`,{

            id: selectedPublisher.value.id,
            name: selectedPublisher.value.name,
            telephone: selectedPublisher.value.telephone,
            email: selectedPublisher.value.email,
            site: selectedPublisher.value.site,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

          // Verifica se a atualização foi bem-sucedida
          if (response.status === 204) {
            console.log('Editora atualizada com sucesso.');
            AbrirModalEdit.value = false; // Fecha o modal de edição
            await PagesPublisher(); // Atualiza a lista de usuários
          } else {
            console.warn('A API retornou um status inesperado:', response.status);
          }
        } catch (error) {
          console.error('Erro ao editar editora:', error.response?.data || error.message);
        }
      };

      const deletarPublisher = async () => {
        try {
          const token = localStorage.getItem('token');
          const publisherID = selectedPublisher.value?.id;

          if (!publisherID) {
            console.error('Erro: ID da editora não encontrado para exclusão.');
            return;
          }
          console.log(`Iniciando exclusão da editora com ID: ${publisherID}`);

          // Chamada para exclusão do usuário
          const response = await api.delete(`/publisher/${publisherID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 204) {
            console.log('Editora excluída com sucesso.');
            AbrirDeleteModal.value = false; // Fecha o modal de exclusão
            await PagesPublisher(); // Atualiza a lista de usuários
          } else {
            console.warn(`A API retornou um status inesperado: ${response.status}`);
          }
        } catch (error) {
          console.error('Erro ao excluir usuário:', error.response?.data || error.message);
        }
      };


    const selectedPublisher = ref(null);

    const newUser = ref({
      name: '',
      email: '',
      telephone:'',
      site:'',
    });

    const password = ref('');

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
      selectedPublisher,
      newUser,
      password,
      ConfirmDeleteImg,
      CadPublisher,
      PagesPublisher,
      BuscarDadosPublisher,
      DadosPublisher,
      EditarPublisher,
      deletarPublisher,
      BPesquisarPublisher,
      isVisitor,



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

.JmodalPublisher {
  backdrop-filter: blur(3px);
}

.JmodalPublisher .CardSectionTitulo {
  background-color: white;
  height: 60px;
  border-radius: 15px !important;
  align-items: center;
  padding-top: 10px;
}

.JmodalPublisher .tituloModal {
  color: rgb(0, 0, 0);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}


.JmodalPublisher .ModalCard {
  background-color: white;
  width: 420px;
  border: 2px solid  rgba(0, 0, 0, 0.699);
  border-radius: 20px;
}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalPublisher .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 2px rgba(0, 0, 0, 0.550);
  padding-left: 10px;
}

.JmodalPublisher .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.JmodalPublisher .CadastroButtom {
  margin-left: 130px;
  margin-top: 25px;
  margin-bottom: 10px;
  background-color: #82e2e9;
}

.JmodalPublisher .EditarButtom{
  margin-left: 150px;
  margin-top: 20px;
  margin-bottom: 10px;
  background-color: #82e2e9;
  color: black;
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

.marginBottom{
  margin-bottom: 20px;

}

</style>
