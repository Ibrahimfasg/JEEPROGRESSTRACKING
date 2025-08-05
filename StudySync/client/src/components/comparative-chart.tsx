import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

interface ComparativeChartProps {
  currentUserData: {
    physics: number;
    chemistry: number;
    mathematics: number;
  };
  partnerData: {
    physics: number;
    chemistry: number;
    mathematics: number;
  };
  currentUserAvatar: string;
  partnerAvatar: string;
  currentUserName: string;
  partnerName: string;
}

export default function ComparativeChart({
  currentUserData,
  partnerData,
  currentUserAvatar,
  partnerAvatar,
  currentUserName,
  partnerName
}: ComparativeChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Physics', 'Chemistry', 'Mathematics'],
        datasets: [{
          label: `${currentUserName} ${currentUserAvatar}`,
          data: [currentUserData.physics, currentUserData.chemistry, currentUserData.mathematics],
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
          borderRadius: 8,
        }, {
          label: `${partnerName} ${partnerAvatar}`,
          data: [partnerData.physics, partnerData.chemistry, partnerData.mathematics],
          backgroundColor: 'rgba(236, 72, 153, 0.8)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            labels: {
              color: 'white',
              font: {
                size: 14,
                weight: 'bold'
              },
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: 'white',
              font: {
                size: 12
              },
              callback: function(value) {
                return value + '%';
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              lineWidth: 1
            }
          },
          x: {
            ticks: {
              color: 'white',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
              lineWidth: 1
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [currentUserData, partnerData, currentUserAvatar, partnerAvatar, currentUserName, partnerName]);

  return (
    <div className="h-64 w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
