import Chart from 'chart.js/auto'
import dados from './data.js'
var pdf = require( '@stdlib/stats-base-dists-normal-pdf' );

function frequenciaIntervalo(limiteInferior, limiteSuperior){
    sum = 0;
    for (let index = 0; index < valores.length; index++) {
        if(valores[index] >= limiteInferior)
            sum++;
        if(valores[index] >= limiteSuperior){
            return sum-=1;
        }
    }
    return sum;
}
function normalcdf(mean, sigma, to) 
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}
const dadosOrdenados = [...dados].sort((a, b) => a["valor"] - b["valor"]);
const periodo = dadosOrdenados.map(row => row["período"]);
const valores = dadosOrdenados.map(row => row["valor"]);
const somaElementos = valores.reduce((acuValue, curValue)=> acuValue + curValue);
const numeroElementos = dadosOrdenados.length;
const maiorElemento = dadosOrdenados[dadosOrdenados.length - 1]["valor"];
const menorElemento = dadosOrdenados[0]["valor"];
const amplitudeAmostral = parseFloat((maiorElemento - menorElemento).toFixed(2));
const numeroClasses = numeroElementos >= 100 ? Math.round(1 + (3.32 * Math.log10(numeroElementos))) : Math.round(Math.sqrt(numeroElementos));
const amplitudeClasse = Math.round(amplitudeAmostral / (numeroClasses - 1));

const classes = new Array(numeroClasses);
const freqAbs = new Array(numeroClasses);
const freqAc = new Array(numeroClasses);
const freqRel = new Array(numeroClasses);
const pMedio = new Array(numeroClasses);

(async function() {
    document.getElementById("infoClasses").innerHTML += 
    `<table class="table table-bordered">
        <tr class="cabecalho">
            <th scope="col">Número de elementos</th>
            <th scope="col">Valor máximo</th>
            <th scope="col">Valor mínimo</th>
            <th scope="col">A (Amplitude amostral)</th>
            <th scope="col">K (Número de classes)</th>
            <th scope="col">C (Amplitude da classe)</th>
        </tr>
        <tr class="linha">
            <td>${numeroElementos}</td>
            <td>${maiorElemento}</td>
            <td>${menorElemento}</td>
            <td>${amplitudeAmostral}</td>
            <td>${numeroClasses}</td>
            <td>${amplitudeClasse}</td>
        </tr>
    </table>`

    var limiteInferior = Math.round(menorElemento - (amplitudeClasse / 2));
    var limiteSuperior = limiteInferior + amplitudeClasse;

    var tabelaClasses = `
    <table class="table table-bordered">
        <thead>
            <tr class="cabecalho">
                <th scope="col">Classe</th>
                <th scope="col">Frequência Absoluta</th>
                <th scope="col">Frequência Acumulativa</th>
                <th scope="col">Frequência Relativa</th>
                <th scope="col">Ponto Médio</th>
            </tr>
        </thead><tbody>`;
    for (let index = 0; index < classes.length; index++) {
        if(index != 0){
            limiteInferior += amplitudeClasse;
            limiteSuperior += amplitudeClasse;
        }
        classes[index] = `${limiteInferior} |-- ${limiteSuperior}`;
        freqAbs[index] = frequenciaIntervalo(limiteInferior, limiteSuperior);
        freqAc[index] = index == 0 ? freqAbs[index] : freqAbs[index] + freqAc[index - 1];
        freqRel[index] = parseFloat(freqAbs[index] / numeroElementos).toFixed(2);
        pMedio[index] = (limiteInferior + limiteSuperior) / 2;

        tabelaClasses += 
        `<tr class="linha">
            <td>${classes[index]}</td>
            <td>${freqAbs[index]}</td>
            <td>${freqAc[index]}</td>
            <td>${freqRel[index]}</td>
            <td>${pMedio[index]}</td>
        </tr>`;
    }
    document.getElementById("infoClasses").innerHTML += tabelaClasses + `</tbody></table>`;

    let media = dados.reduce((total, next) => total + next["valor"], 0) / dados.length;
    let variancia = valores.reduce((total, valor) => total + Math.pow(media - valor, 2)/valores.length, 0);
    let desvioPadrao = Math.sqrt(variancia);

    const incrementoFdm = (maiorElemento - menorElemento)/100;
    const valor = new Array(100);
    const fdm = new Array(100);
    const curva = new Array(100);
    for (let index = 0; index < 100; index++) {
        valor[index] = menorElemento + (index + 1) * incrementoFdm;
        fdm[index] = pdf(valor[index], media, desvioPadrao);
        curva[index] = ({x: valor[index], y:fdm[index]});
        console.log(fdm[index])
    }

    new Chart(
        document.getElementById('grafico-dispersao'),
        {
          data: {
            labels: classes,
            datasets: [
                {
                    label: 'histograma',
                    type: 'bar',
                    data: freqAbs
                }, 
                {
                    label: 'Curva de Distribuição Normal',
                    type: 'scatter',
                    data: curva,
                    xAxisID: 'testex',
                    yAxisID: 'teste'
                }
            ]
          }
        }
      );
      
})(); 