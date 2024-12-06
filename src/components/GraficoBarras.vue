<template>
  <div>
    <BarChart :data="data" :options="options"/>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'vue-chartjs';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

export default defineComponent({
  name: 'GraficoBarra',
  components: {
    BarChart: Bar
  },
  data() {
    return {
      data: {
        labels: ['Junho', 'Julho', 'Agosto', 'Setembro' ,'Outubro','Novembro','Dezembro'],
        datasets: [
          {
            label: 'Aluguéis',
            backgroundColor: '#b3eef1',
            data: [0, 3, 4, 10,14,9,8]
          },
          {
            label: '',
            backgroundColor: '#ffd8b0',
            data: [10, 18, 22, 17,8,16,2]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'top'
          },
        }
      }
    };
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  max-width: 600px;
  margin: auto;
}
</style>
