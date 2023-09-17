import Chart from 'chart.js/auto'
import dados from './data.js'

(async function() {
  const data = dados;
  const valor = data.map(row => row["valor"]);
  const calculaModa = () => {
    return Object.values(
        valor.reduce((count, e) => {
            if (!(e in count)) {
                count[e] = [0, e];
            }
            count[e][0]++;
            return count;
        }, {})
    ).reduce((a, v) => v[0] < a[0] ? a : v, 0);
  }
  const calculaMediana = (dadosOrdenados, tamanho) => {
    return tamanho % 2 == 0 ? (dadosOrdenados[tamanho / 2] + dadosOrdenados[(tamanho / 2) - 1]) / 2 : dadosOrdenados[(tamanho / 2) | 0];
  }

  new Chart(
    document.getElementById('grafico-posicao'),
    {
      data: {
        labels: data.map(row => row["período"]),
        datasets: [
          {
            type: 'bar',
            label: 'Homicídios nas capitais do Brasil',
            data: data.map(row => row["valor"])
          },
          {
            type: 'line',
            label: 'Média',
            data: new Array(data.length).fill(data.reduce((total, next) => total + next["valor"], 0) / data.length)
          },
          {
            type: 'line',
            label: 'Moda',
            data: new Array(data.length).fill(calculaModa())
          },
          {
            type: 'line',
            label: 'Mediana',
            data: new Array(data.length).fill(calculaMediana(valor.sort((a, b) => a - b), valor.length))
          }

        ]
      }
    }
  );
})();