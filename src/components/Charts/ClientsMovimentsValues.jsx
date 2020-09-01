import React, { useState, useEffect } from "react";
import Chart from "chart.js";
import { Line } from "react-chartjs-2";

import {
  chartOptions,
  parseOptions
} from "../../variables/charts";

import api from '../../axios';

import { formatShowMoney } from '../../utils';

function ClientsMovimentsValues() {

    const [datasets, setDatasets] = useState([]);

    const chartExample2 = {
        options: {
          tooltips: {
            callbacks: {
              label: function(item, data) {
                var label = data.datasets[item.datasetIndex].label || "";
                var yLabel = item.yLabel;
                var content = "";
                if (data.datasets.length > 1) {
                  content += label;
                }
                content += " R$ " + formatShowMoney(yLabel);
                return content;
              }
            }
          }
        },
        data: {
          labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
          datasets: datasets,
        },
    };

    useEffect(() => {
        if (window.Chart) {
            parseOptions(Chart, chartOptions());
        }
    }, []);

    useEffect(() => {

        async function fetchData(type) {
          const response = await api.get(`/advisory-dashboard/${type}`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('api_token')}`
            }
          });

          return response.data;
        }

        async function fetchDataLoad() {     
          let tempDatasets = [];

          (await fetchData(2)).map(revenue => {
            tempDatasets.push({
              label: "RECEITAS DE - " + revenue.client.name,
              data: revenue.data,
              borderColor: '#2dce89',
            });
          });

          (await fetchData(1)).map(expense => {
            tempDatasets.push({
              label: "DESEPESAS DE - " + expense.client.name,
              data: expense.data,
              borderColor: '#f5365c',
            });
          });

          setDatasets(tempDatasets);
        }
    
        fetchDataLoad();
    
    }, []);

    return (
        <>
            {datasets.length > 0 ? 
              <Line
                  height={470}
                  data={chartExample2.data}
                  options={chartExample2.options}
              /> : ''
            }
        </>
    );
}

export default ClientsMovimentsValues;
