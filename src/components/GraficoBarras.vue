<template>
  <div>
    <DoughnutChart :data="data" :options="options" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
import { api } from "src/boot/axios";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

export default defineComponent({
  name: "GraficoRosca",
  components: {
    DoughnutChart: Doughnut,
  },
  data() {
    return {
      data: {
        labels: ["Alugados", "Devolvidos com Delay", "Devolvidos", "Atrasados"],
        datasets: [
          {
            label: "Status dos Aluguéis",
            backgroundColor: ["#b3eef1", "#ffb394", "#bcc7d9", "#deb7d5"],
            data: [0, 0, 0, 0], // Inicializa os dados com valores 0
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/rent", {
      params: { size: 1000 },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data) {
      const { content } = response.data;

      // Processar os dados para contar os status
      const statusCounts = this.processData(content);

      // Atualizar os dados do gráfico com uma nova instância
      this.data = {
        ...this.data, // Mantém as configurações existentes
        datasets: [
          {
            ...this.data.datasets[0], // Mantém as configurações do dataset
            data: [
              statusCounts["IN_TIME"] || 0,
              statusCounts["DELIVERED_WITH_DELAY"] || 0,
              statusCounts["DELIVERED"] || 0,
              statusCounts["DELAYED"] || 0,
            ],
          },
        ],
      };

      console.log("Dados do gráfico atualizados:", this.data.datasets[0].data);
    }
  } catch (error) {
        // Exibir mensagem de erro
        const errorMessage =
          error.response?.data?.message || 'Error ao carregar gráficos.';
        Notify.create({
          type: 'negative',
          message: `${errorMessage}`,
          position: 'bottom-right',
          timeout: 1500,
        });
      }
},
    processData(items) {
      return items.reduce(
        (counts, item) => {
          if (counts[item.status] !== undefined) {
            counts[item.status] += 1;
          }
          return counts;
        },
        {
          IN_TIME: 0,
          DELIVERED_WITH_DELAY: 0,
          DELIVERED: 0,
          DELAYED: 0,
        }
      );
    },
  },
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
}
</style>
