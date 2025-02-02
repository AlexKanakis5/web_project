import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './StatisticsPage.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const StatisticsPage = ({ user }) => {
  const [averageGradeData, setAverageGradeData] = useState(null);
  const [averageTimeData, setAverageTimeData] = useState(null);
  const [correlationData, setCorrelationData] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      // fetch the statics that are provided in this url by database queries in the backend
      const response = await fetch(`http://localhost:5000/api/statistics/professor/${user.email}`, {
        credentials: 'include' // Include credentials (cookies, authorization headers, etc.)
      });
      const data = await response.json();

      const years = data.averageGrades.map(d => d.year);
      const averageGrades = data.averageGrades.map(d => d.average_grade);
      const averageTimes = data.averageTimes.map(d => d.average_time);

      setAverageGradeData({
        labels: years,
        datasets: [
          {
            label: 'Average Grade',
            data: averageGrades,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      });

      setAverageTimeData({
        labels: years,
        datasets: [
          {
            label: 'Average Time to Complete (days)',
            data: averageTimes,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });

      const correlation = data.correlation.map(d => ({
        x: d.time_to_complete,
        y: d.grade,
      })).sort((a, b) => a.x - b.x); // Sort by time_to_complete

      setCorrelationData({
        datasets: [
          {
            label: 'Grade vs Time to Complete',
            data: correlation,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
            showLine: true,
          },
        ],
      });
    };

    fetchStatistics();
  }, [user.email]);

  return (
    <div className="statistics-page">
      <h1>Statistics for Professor {user.name}</h1>
      <div className="chart-container">
        <h2>Average Time to Complete per Year</h2>
        {averageTimeData && <Bar data={averageTimeData} options={{ maintainAspectRatio: false }} />}
      </div>
      <div className="chart-container">
        <h2>Average Grade per Year</h2>
        {averageGradeData && <Bar data={averageGradeData} options={{ maintainAspectRatio: false }} />}
      </div>
      <div className="chart-container">
        <h2>Correlation between Grade and Time to Complete</h2>
        {correlationData && <Line data={correlationData} options={{ maintainAspectRatio: false, scales: { x: { type: 'linear', title: { display: true, text: 'Time to Complete (days)' } }, y: { title: { display: true, text: 'Grade' } } } }} />}
      </div>
    </div>
  );
};

export default StatisticsPage;