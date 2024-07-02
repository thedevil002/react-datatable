import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = ({ data }) => {
  const completedTasks = data.filter(todo => todo.completed).length;
  const notCompletedTasks = data.length - completedTasks;

  const chartData = {
    labels: ['Completed', 'Not Completed'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [completedTasks, notCompletedTasks],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Completion Status',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default Graph;
