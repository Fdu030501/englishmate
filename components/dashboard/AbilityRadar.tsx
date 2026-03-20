'use client'

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

interface AbilityRadarProps {
  data: {
    vocabulary: number
    grammar: number
    reading: number
    listening: number
    speaking: number
  }
}

export default function AbilityRadar({ data }: AbilityRadarProps) {
  const chartData: ChartData<'radar'> = {
    labels: ['词汇', '语法', '阅读', '听力', '口语'],
    datasets: [
      {
        label: '当前能力',
        data: [data.vocabulary, data.grammar, data.reading, data.listening, data.speaking],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)'
      },
      {
        label: '目标水平',
        data: [80, 80, 80, 80, 80],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: 'rgba(34, 197, 94, 0.5)',
        pointBorderColor: '#fff',
      }
    ]
  }

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          backdropColor: 'transparent'
        },
        pointLabels: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.r}分`
          }
        }
      }
    }
  }

  return (
    <div className="w-full h-[400px]">
      <Radar data={chartData} options={options} />
    </div>
  )
}
