<template>
  <q-layout>
    <q-page-container>
      <q-page class="PPage">
        <div class="TCima">
          <div style="flex-direction: row; display: flex; gap: 10px">
            <NovoButton @click="openModalNew" class="NButtom"  v-if="!isVisitor"/>
            <q-select
              class="filtro"
              v-model="statusFilter"
              :options="statusOptions"
              label="status"
              clearable
              emit-value
              map-options
              @blur="isFocused = false"
              @input="PagesRent"

            >
              <template v-slot:label>
                <span v-if="!isFocused && !statusFilter">status</span>
              </template>
            </q-select>
          </div>
          <BarraPesquisa class="BPesquisa"  v-model="BPesquisarRent" @input="PagesRent"/>
        </div>
        <TabelaGeral :rows="tableData" :columns="tableColumns" class="TGeral" :action-icons="{ return:returnItem}" />

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
                <q-select
                v-model="newUser.renterId"
                :options="renter"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                label="Nome do Locatário"
                class="InP"
                borderless
                required/>

                <q-select
                v-model="newUser.bookId"
                :options="book"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                label="Nome do Livro"
                class="InP"
                borderless
                required/>
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
import { ref, onMounted, watch } from 'vue';
import ConfirmDeleteImg from '../assets/Delete_Confirmed.png';
import { api } from 'src/boot/axios';

export default {
  setup() {
    // Estados para controle dos modais
    const JModalNew = ref(false);
    const AbrirDevolucaoModal = ref(false);
    const selectedRentId = ref(null);
    const BPesquisarRent = ref('');
    const statusFilter = ref('');

    // Funções para abrir modais
    const openModalNew = () => {
      JModalNew.value = true;
      BuscarLocatario();
      BuscarLivro();
    };

    const returnItem = (row) => {
      console.log('Deletando:', row);
      selectedRentId.value = row.id;
      AbrirDevolucaoModal.value = true;
      if (isVisitor.value) return; // Bloqueia a ação caso seja VISITOR
    };

    const userType = ref(localStorage.getItem('userType') || 'VISITOR'); // Obtém o tipo de usuário
    const isVisitor = ref(userType.value === 'VISITOR'); // Verifica se é visitante

    // Dados para a tabela
    const tableColumns = ref([
      { name: 'renterName', label: 'Locatário', align: 'center', field: row => row.renterName },
      { name: 'bookName', label: 'Livro alugado', align: 'center', field: row => row.bookName },
      { name: 'status', label: 'status', align: 'center', field: row => row.status },
      { name: 'deadLineDate', label: 'Data Limite', align: 'center', field: row => row.deadLineDate },
      { name: 'rentDate', label: 'Data do Aluguel', align: 'center', field: row => row.rentDate },
      // Exibe a coluna de ações apenas se não for VISITOR
      ...(isVisitor.value? []: [{ name: 'action', label: 'Ações', align: 'center', field: row => row.action }]),
    ]);

    const tableData = ref([]);

     // Função para buscar todos as editoras de uma vez
     const PagesRent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/rent`, {
          params: { size: 1000, sort: 'id', direction: 'ASC', search:BPesquisarRent.value, status: statusFilter.value || undefined },
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

        watch([BPesquisarRent, statusFilter], () => {
          PagesRent(); // Recarrega a pesquisa sempre que o termo for alterado
        });

    const CadRent = async () => {
      try {
        const token = localStorage.getItem('token');

        console.log('Dados do aluguel:', newUser.value);

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

    const renter = ref([]);

    const BuscarLocatario = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/renter`, {
        params: { size: 1000 },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.content) {
        renter.value = response.data.content; // Atualiza os dados da tabela
        console.log('Locatários:', renter.value); // Verifique se os dados estão corretos
      } else {
        console.warn('Nenhum dado foi retornado da API.');
      }

      } catch (error) {
        console.error('Erro ao buscar editoras:', error);
      }
    };

    onMounted(() => {
      BuscarLocatario();
    });

    const book = ref([]);

    const BuscarLivro = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/book`, {
        params: { size: 1000 },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.content) {
        book.value = response.data.content; // Atualiza os dados da tabela
        console.log('Livros:', book.value); // Verifique se os dados estão corretos
      } else {
        console.warn('Nenhum dado foi retornado da API.');
      }

      } catch (error) {
        console.error('Erro ao buscar editoras:', error);
      }
    };

    onMounted(() => {
      BuscarLivro();
    });

    // Opções para o filtro de status
    const statusOptions = ref([
      { label: 'NO TEMPO', value: 'IN_TIME' },
      { label: 'DEVOLVIDO COM DELAY', value: 'DELIVERED_WITH_DELAY	' },
      { label: 'ENTREGUE', value: 'DELIVERED' },
      { label: 'ATRASADA', value: 'DELAYED' },
    ]);

      const newUser = ref({
        renterId: null,
        bookId: null,
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
      DevolucaoRent,
      BuscarLocatario,
      renter,
      BuscarLivro,
      book,
      BPesquisarRent,
      statusOptions,
      statusFilter,
      isVisitor
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

.filtro{
  border: 1px solid black;
  border-radius: 15px;
  height: 39px;
  padding-left: 10px;
  font-size: 14px;
  width: auto;
  min-width: 100px;

}
.filtro .q-field__native {
  display: flex;
  align-items: flex-start; /* Alinha o texto ao topo */
  padding-top: 10px; /* Adiciona espaçamento superior para ajustar */
  font-size: 14px; /* Certifique-se de ajustar o tamanho da fonte se necessário */
  height: auto; /* Permite altura flexível para o campo */
  transform: translateY(-15px); /* Ajusta a posição */
}

.filtro .q-field__append {
  display: flex;
  align-items: flex-start; /* Alinha o ícone ao topo */
  margin-top: 10px; /* Ajusta o espaçamento superior */
}

.filtro .q-icon {
  font-size: 18px; /* Ajuste o tamanho do ícone, se necessário */
  padding: 0; /* Remove o espaçamento interno */
}

.filtro .q-field__label {
  font-size: 14px; /* Tamanho da fonte */
  color: black;    /* Cor do label */
  transform: translateY(-10px); /* Ajusta a posição */
}




</style>
