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

    const [clientCompanyId, setClientCompanyId] = useState(null);

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

      if(parseInt(localStorage.getItem('clientCompanyId')))
        setClientCompanyId(parseInt(localStorage.getItem('clientCompanyId')));
      else
        setClientCompanyId(0);

      async function fetchData() {
        
        let url = '';

        if (clientCompanyId) {
          url = `/client-dashboard/higher-category-spending/${clientCompanyId}`;
        } else {
          url = `/client-dashboard/higher-category-spending`;
        }

        const response = await api.get(url, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('api_token')}`
          }
        });
  
        setHigherCategorySpending(response.data.higherCategorySpending);
      }
  
      if (clientCompanyId !== null)
        fetchData();
  
    }, [clientCompanyId]);

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
