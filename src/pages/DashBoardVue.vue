<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <div class="MiniModais">

          <q-card class="box">
              <div class="content">
                <div>
                  <div class="number">{{ Atrasados }}</div>
                  <div class="textBox">Atrasados</div>
                </div>
                <div class="icon">
                  <q-icon name="warning" size="44px" style="color: #b3eef1;"></q-icon>
                </div>
              </div>
              <q-tooltip
              class="TextoFlut"
              anchor="top middle"
              :offset="[0, 5]">Devoluções de livros em atraso</q-tooltip>
          </q-card>


          <q-card class="box">
            <div class="content">
              <div>
                <div class="number">{{ Alugados }}</div>
                <div class="textBox">Alugados</div>
              </div>
              <div class="icon">
                <q-icon name="book" size="44px" style="color: #b3eef1;"></q-icon>
              </div>

            </div>
            <q-tooltip
              class="TextoFlut"
              anchor="top middle"
              :offset="[0, 5]">Quantidade de alugueis já feitos</q-tooltip>
          </q-card>


            <q-card class="box">
            <div class="content">
              <div>
                <div class="number">{{ Devolvidos }}</div>
                <div class="textBox">Devolvidos</div>
              </div>
              <div class="icon">
                <q-icon name="beenhere" size="44px" style="color: #b3eef1;"></q-icon>
              </div>

            </div>
            <q-tooltip
              class="TextoFlut"
              anchor="top middle"
              :offset="[0, 5]">Quantidade de livros devolvidos</q-tooltip>
          </q-card>

                <q-card class="box">
            <div class="content">
              <div>
                <div class="number">{{ Livros }}</div>
                <div class="textBox">Livros</div>
              </div>
              <div class="icon">
                <q-icon name="library_books" size="44px" style="color: #b3eef1;"></q-icon>
              </div>

            </div>
            <q-tooltip
              class="TextoFlut"
              anchor="top middle"
              :offset="[0, 5]">Quantidade de livros cadastrados</q-tooltip>
          </q-card>
        </div>

        <div class="Conteudo">
          <TabelaGeral :rows="tableData" :columns="tableColumns" :rows-per-page="5" class="TGeral"/>
          <TabelaGeral :rows="tableDataBest" :columns="tableColumnsBest" :rows-per-page="5" class="TGeral2"/>
          <GraficoBarras class="Grafico"/>
        </div>

        <q-card-section  class="PaginacaoContainer q-px-md q-py-sm"
        style="display: flex; justify-content: left ; gap: 10px; flex-wrap: wrap; margin-left: 120px;">
          <q-btn flat icon="arrow_left" class="PaginacaoDashboard icon-larger" @click="backPage" aria-label="Página anterior"></q-btn>
          <q-btn flat icon="arrow_right"  class="PaginacaoDashboard icon-larger" @click="nextPage" aria-label="Próxima página"></q-btn>
        </q-card-section>

      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import { Notify } from 'quasar';

export default {
  // name: 'PageName',
  setup(){

    const Atrasados = ref(0);
    const Devolvidos = ref(0);
    const Alugados = ref(0);
    const Livros = ref(0);

    const tableColumns = ref([
      { name: 'name', label: 'Usuário', align: 'center', field: row => row.name },
      { name: 'totalRents', label: 'Alugueis Realizados', align: 'center', field: row => row.totalRents },
      { name: 'activeRents', label: 'Alugueis Ativos', align: 'center', field: row => row.activeRents },
    ]);

    const tableData = ref([]);

    const BuscarLivros = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/book', {
          params: {
            size: 1000, // Quantidade máxima de livros retornados
            sort: 'id',
            direction: 'ASC',
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const { content } = response.data;
          Livros.value = content.length; // Total de livros cadastrados

        }
      } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Error ao carregar quantidade de livros.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
    };

    // Função para buscar os dados do endpoint de aluguéis
    const BuscarAlugueis = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/rent', {
          params: {
            size: 1000, // Pega até 1000 registros (ajuste se necessário)
            sort: 'id',
            direction: 'ASC',
          },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          const { content } = response.data;

          // Contabilizar apenas os atrasados e devolvidos
          Atrasados.value = content.filter(rent => rent.status === 'DELAYED').length;
          Devolvidos.value = content.filter(rent => rent.status === 'DELIVERED').length;
          Alugados.value = content.length; // Contabiliza o número de aluguéis ativos
        }
      } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Error ao carregar dados de quantidade dos alugueis.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
    };

    // Chamado ao montar o componente
    onMounted(() => {
      BuscarAlugueis();
      BuscarLivros();
    });

    const currentPage = ref(0);

    const tableUserRenters = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/rent/renters`, {
          params: { size: 5,page:currentPage.value, sort: 'id', direction: 'ASC', },
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
          error.response?.data?.message || 'Error ao carregar tabela de alugueis por usuarios.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
    };

        // Chame `BuscarUser` ao montar
        onMounted(() => {
          tableUserRenters();
        });

    const tableColumnsBest = ref([
      { name: 'rentedNumber', label: 'Ranked', align: 'center', field: row => row.rentedNumber },
      { name: 'bookName', label: 'Livro', align: 'center', field: row => row.bookName },
    ]);

    const tableDataBest = ref([]);

    const BestBooks = async () => {
  try {
    const token = localStorage.getItem('token');
    const books = [];

    // Faz 5 requisições para obter os 5 livros mais alugados
    for (let i = 0; i <= 4; i++) {
      const response = await api.get(`/rent/most-rented/${i}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        books.push({
          rentedNumber: i + 1, // O rank atual
          bookName: response.data.bookName, // Nome do livro retornado pela API
        });
      }
    }

    tableDataBest.value = books; // Atualiza os dados da tabela de livros mais alugados
  } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Error ao carregar tabela de livros mais alugados.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
};

    onMounted(() => {
      BestBooks();
    });

    const nextPage = () => {
      currentPage.value++;
      tableUserRenters();
    };

    const backPage = () => {
      if (currentPage.value > 0) {
        currentPage.value--;
        tableUserRenters();
      }
    };



    return{
      tableColumns,
      tableData,
      tableColumnsBest,
      tableDataBest,
      tableUserRenters,
      Atrasados,
      Devolvidos,
      Alugados,
      Livros,
      nextPage,
      backPage,
    }

  }
}
</script>

<style>
.box {

  width: 190px;
  height: 70px;
  padding-left: 15px; /* Adiciona espaçamento interno */
  padding-right: 10px;
  border-radius: 5px !important;
  border: solid 1px black !important;
}

.content {
  display: flex;
  justify-content: space-between; /* Coloca o número e o ícone nas extremidades */
  align-items: center; /* Alinha verticalmente no centro */
  height: 100%;
}

.number {
  margin-left: 8px;
  display: flex;
  top: 10px;
  height: 36px;
  font-size: 25px;
  font-weight: bold;
}

.textBox{
  display: flex;
  bottom: 10px;
  height: 30px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.63);
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.MiniModais{
  margin-top: 30px;
  margin-left: 30px;
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 73px;
}

.Grafico{
  width: 43%;
  height: auto;
  margin-top: 20px;

}

.Conteudo .TGeral{
  height: 370px;
  width: 30%;
  margin-left: 20px;
  margin-top: 30px;
  overflow-x: hidden;
}

.Conteudo .TGeral2{
  height: 370px;
  width: 22%;
  margin-top: 30px;
  margin-right: 20px;
  overflow-x: hidden;
}

.Conteudo{
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.q-table tbody:nth-child(4) {
  background-color: #333333;
  color: white;
  font-weight: bold;
}

.PaginacaoDashboard{
  color: #333333;
  border: solid 1px rgba(0, 0, 0, 0.795);
  height: 30px;
  width: 40px;
  box-shadow: 1px 2px 2px rgba(0, 0, 0, 0.479);

}

.icon-larger .q-icon {
  font-size: 40px; /* Ajuste o tamanho do ícone */
  display: flex;
  position: relative;
  bottom: 7px;
}

.TextoFlut{
  margin-left: 40px !important;
  font-size: 12px;
}

</style>
