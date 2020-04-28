import React, { useState, useEffect } from "react";
import Chart from "chart.js";
import { Line, Bar } from "react-chartjs-2";

import {
  chartOptions,
  parseOptions
} from "../../variables/charts";

import api from '../../axios';

function MovimentsValues() {

    const [revenues, setRevenues] = useState(null);
    const [expenses, setExpenses] = useState(null);

    const chartExample2 = {
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function(value) {
                    if (!(value % 10)) {
                      //return '$' + value + 'k'
                      return value;
                    }
                  }
                }
              }
            ]
          },
          tooltips: {
            callbacks: {
              label: function(item, data) {
                var label = data.datasets[item.datasetIndex].label || "";
                var yLabel = item.yLabel;
                var content = "";
                if (data.datasets.length > 1) {
                  content += label;
                }
                content += yLabel;
                return content;
              }
            }
          }
        },
        data: {
          labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
          datasets: [
            {
                label: "Receitas",
                data: revenues,
                backgroundColor: '#2dce89'  
            }, 
            {
              label: "Despesas",
              data: expenses,
              backgroundColor: '#f5365c'  
            },
            
          ],
        },
    };

    useEffect(() => {
        if (window.Chart) {
            parseOptions(Chart, chartOptions());
        }
    }, []);

    useEffect(() => {
        console.log(revenues);
    }, [revenues]);

    useEffect(() => {

        async function fetchData(type) {
          const response = await api.get(`http://localhost:3333/client-dashboard/${type}/2020`, {
            headers: {
              authorization: `Bearer ${localStorage.getItem('api_token')}`
            }
          });

          console.log(response.data);
    
          return response.data;
        }

        async function fetchDataLoad() {
            setRevenues(await fetchData(2));
            setExpenses(await fetchData(1));
        }
    
        fetchDataLoad();
    
    }, []);

    return (
        <>
            {(revenues && expenses) ? 
                <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                /> : ''
            }
        </>
    );
}

export default MovimentsValues;
