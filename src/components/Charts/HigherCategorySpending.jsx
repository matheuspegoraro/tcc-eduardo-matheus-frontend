import React, { useState, useEffect } from "react";
import Chart from "chart.js";
import { Doughnut } from "react-chartjs-2";

import {
  chartOptions,
  parseOptions
} from "../../variables/charts";

import api from '../../axios';

import { formatShowMoney } from '../../utils';

function HigherCategorySpending() {

    const [higherCategorySpending, setHigherCategorySpending] = useState([]);

    const chartExample2 = {
        options: {
          tooltips: {
            callbacks: {
              label: function(item, data) {
                let label = data.datasets[0].data[item.index] || "";
                let content = " R$ " + formatShowMoney(label);
                
                return content;
              }
            }
          }
        },
        data: {
          labels: higherCategorySpending.map(category => category.name),
          datasets: [
            {
              data: higherCategorySpending.map(category => category.total),
              backgroundColor: higherCategorySpending.map(category => category.color),
              hoverBackgroundColor: higherCategorySpending.map(category => category.color)
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

      async function fetchData() {
        const response = await api.get('http://localhost:3333/client-dashboard/higher-category-spending', {
          headers: {
            authorization: `Bearer ${localStorage.getItem('api_token')}`
          }
        });
  
        setHigherCategorySpending(response.data.higherCategorySpending);
      }
  
      fetchData();
  
    }, []);

    return (
        <>
            {higherCategorySpending ? 
              <Doughnut
                  height={300}
                  data={chartExample2.data}
                  options={chartExample2.options}
              /> : ''
            }
        </>
    );
}

export default HigherCategorySpending;
