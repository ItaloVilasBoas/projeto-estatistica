import Chart from 'chart.js/auto'
import dados from './data.js'

(async function() {
    function percentil(arr, q) {
        const pos = (arr.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (arr[base + 1] !== undefined) {
            return arr[base] + rest * (arr[base + 1] - arr[base]);
        } else {
            return arr[base];
        }
    }

    const data = dados;
    const dadosOrdenados = dados.slice(0).sort((a, b) => a["valor"] - b["valor"]);
    const valorMin = new Array(dados.length).fill(dadosOrdenados[0]["valor"]);
    const valorMax = new Array(dados.length).fill(dadosOrdenados[dadosOrdenados.length - 1]["valor"]);
    const valores = dadosOrdenados.map(row => row["valor"]);
    
    const percentil10 = new Array(dados.length).fill(percentil(valores, 0.1));
    const percentil25 = new Array(dados.length).fill(percentil(valores, 0.25));
    const percentil50 = new Array(dados.length).fill(percentil(valores, 0.5));
    const percentil75 = new Array(dados.length).fill(percentil(valores, 0.75));
    const percentil90 = new Array(dados.length).fill(percentil(valores, 0.9));



    new Chart(
        document.getElementById('grafico-percentil'),
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
                    label: 'VALOR MÍNIMO',
                    data: valorMin
                },
                {
                    type: 'line',
                    label: 'VALOR MÁXIMO',
                    data: valorMax
                },
                {
                    type: 'line',
                    label: 'PERCENTIL10',
                    data: percentil10
                },
                {
                    type: 'line',
                    label: 'PERCENTIL25',
                    data: percentil25
                },
                {
                    type: 'line',
                    label: 'PERCENTIL50',
                    data: percentil50
                },
                {
                    type: 'line',
                    label: 'PERCENTIL75',
                    data: percentil75
                },
                {
                    type: 'line',
                    label: 'PERCENTIL90',
                    data: percentil90
                }
            ]
        }
    })
})();