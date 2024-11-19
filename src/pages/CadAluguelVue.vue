<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <NovoButton @click="openModalNew" class="NButtom"/>
          <BarraPesquisa class="BPesquisa"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{ return:returnItem}"/>

        <!-- Modal para Nova Aluguel -->
        <q-dialog v-model="JModalNew" class="JmodalRent Sombra" persistent>
          <q-card class="ModalCard">
            <q-card-section class="CardSectionTitulo">
              <div class="text-h4 tituloModal">Cadastrar Aluguel</div>
              <q-btn flat round icon="close" @click="JModalNew = false" class="absolute-top-right" color="black"/>
            </q-card-section>

            <q-separator style="height: 2px; background-color: rgba(0, 0, 0, 0.400);"/>

            <q-card-section>
              <q-form>
                <q-input v-model="newUser.renterId" label="Nome do Locatário" required borderless  class="InP"/>
                <q-input v-model="newUser.bookId" label="Nome do Livro" required borderless  class="InP"/>
                <q-input v-model="newUser.deadline" label="Prazo de Entrega" type="date" required borderless  class="InP"/>

                <q-btn type="submit" label="Cadastrar" class="CadastroButtom" @click="CadRent"/>
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>

          <!-- Modal para Confirmar Exclusão -->
        <q-dialog v-model="AbrirDevolucaoModal" class="DeleteModal JmodalRent Sombra" persistent>
          <q-card class="DeleteModalCard Sombra">
            <q-card-section class="q-pa-md q-pt-none q-pb-none padding_zero">
              <div class="center">
                <img :src="ConfirmDeleteImg" alt="Confirmação de exclusão" class="DeleteImg"/>
              </div>
            </q-card-section>

            <q-card-section class="padding_zero">
              <p class="textDelete">Você deseja registrar a devolução do livro: ?</p>
            </q-card-section>

            <q-card-section class=" q-gutter-sm q-pt-none CardButtonDelete">
              <div class="q-gutter-md buttonsDelete">
                <q-btn label="Sim" color="red" class="Button" @click="DevolucaoRent"/>
                <q-btn label="Não" color="dark" @click="AbrirDevolucaoModal = (false)" class="Button"/>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import ConfirmDeleteImg from '../assets/Delete_Confirmed.png';
import { api } from 'src/boot/axios';

export default {
  setup() {
    // Estados para controle dos modais
    const JModalNew = ref(false);
    const AbrirDevolucaoModal = ref(false);
    const selectedRentId = ref(null);

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
    };

    const returnItem = (row) => {
      console.log('Deletando:', row);
      selectedRentId.value = row.id;
      AbrirDevolucaoModal.value = true;
    };

    // Dados para a tabela
    const tableColumns = ref([
      { name: 'renterName', label: 'Locatário', align: 'center', field: row => row.renterName },
      { name: 'bookName', label: 'Livro alugado', align: 'center', field: row => row.bookName },
      { name: 'status', label: 'status', align: 'center', field: row => row.status },
      { name: 'deadLineDate', label: 'Data Limite', align: 'center', field: row => row.deadLineDate },
      { name: 'rentDate', label: 'Data do Aluguel', align: 'center', field: row => row.rentDate },
      { name: 'action', label: 'Ações', align: 'center', field: row => row.action },
    ]);

    const tableData = ref([]);

     // Função para buscar todos as editoras de uma vez
     const PagesRent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/rent`, {
          params: { size: 1000, sort: 'id', direction: 'ASC' },
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verifique se há dados na resposta
        if (response.data && response.data.content) {
          tableData.value = response.data.content; // Atualiza os dados da tabela
        } else {
          console.warn('Nenhum dado foi retornado da API.');
        }
      } catch (error) {
        console.error('Erro ao buscar Alugueis:', error.response?.data || error.message);
      }
    };

        // Chame `BuscarUser` ao montar
        onMounted(() => {
          PagesRent();
        });

    const CadRent = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await api.post('/rent',{

          renterId: newUser.value.renterId,
          bookId: newUser.value.bookId,
          deadline: newUser.value.deadline,

        },
        {
          headers: {Authorization: `Bearer ${token}`}
        }
        );

        if (response.status === 201) {

        // Fechar o modal e limpar o formulário
        JModalNew.value = false;
        newUser.value = {
          renterId: '',
          bookId: '',
          deadline:'',
         };
        }
        await PagesRent();
      } catch (error) {
        console.error('Erro ao cadastrar Aluguel:', error.response?.data || error.message);
      }
    };

    const DevolucaoRent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.put(`/rent/${selectedRentId.value}`, {
          status: 'returned',
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 204) {
          AbrirDevolucaoModal.value = false;
          await PagesRent();
        }
      } catch (error) {
        console.error('Erro ao registrar devolução:', error.response?.data || error.message);
      }
    };

    onMounted(PagesRent);

      const newUser = ref({
        renterId: '',
        bookId: '',
        deadline:'',
      });
    const password = ref('');

    return {
      JModalNew,
      AbrirDevolucaoModal,
      openModalNew,
      returnItem,
      tableData,
      tableColumns,
      selectedRentId,
      newUser,
      password,
      ConfirmDeleteImg,
      PagesRent,
      CadRent,
      DevolucaoRent
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

.JmodalRent {
  backdrop-filter: blur(3px);
}

.JmodalRent .CardSectionTitulo {
  background-color: white;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  border-radius: 15px !important;
}

.JmodalRent .tituloModal {
  color: black;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.JmodalRent .ModalCard {
  background-color: white;
  width: 420px;
  border: 2px solid black;
  border-radius: 20px;
}

.q-dialog .q-card {
  border-radius: 20px !important;
}

.JmodalRent .InP {
  margin-right: 25px;
  margin-left: 25px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: white;
  border: solid 2px rgba(0, 0, 0, 0.550);
  padding-left: 10px;
}

.JmodalRent .InputView {
  margin-top: 12px;
  margin-bottom: 20px;
}

.JmodalRent .CadastroButtom {
  margin-left: 130px;
  margin-top: 25px;
  margin-bottom: 10px;
  background-color: #82e2e9;
}

.EditarButtom{
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

</style>
