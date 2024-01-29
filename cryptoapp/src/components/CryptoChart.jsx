import React from "react";
import Chart from "chart.js/auto";

const CryptoChart = ({ sparklineData }) => {
  const chartRef = React.createRef();

  React.useEffect(() => {
    if (chartRef && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      // Çizgi grafiği oluşturun
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: Array.from({ length: sparklineData.length }, (_, i) => i + 1),
          datasets: [
            {
              label: "Price Change",
              data: sparklineData,
              fill: false,
              borderColor: "rgba(75,192,192,1)",
              tension: 0.1,
            },
          ],
        },
      });
    }
  }, [chartRef, sparklineData]);

  return <canvas ref={chartRef} />;
};

export default CryptoChart;
