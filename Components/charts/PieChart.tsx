import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'

interface IPieChartProps {
    title: string;
    seriesData: any[];
    className?: string;
}

const PieChart = ({title, seriesData, className}: IPieChartProps) => {

    const chartOptions = {
        chart: {
            type: 'pie',
            backgroundColor: 'transparent',
            color: 'ffffff'
        },
        title: {
            text: title,
            style: {
                fontFamily: 'lexend',
                color: '#ffffff',
            },
        },
        tooltip: {
            headerFormat:
                '<span style="font-size:14px;text-transform:capitalize">{point.key}</span><table>',
            pointFormat:
                '<tr><td style="color:#2042b8;padding:0;text-transform:capitalize">{series.name}:  </td>' +
                '<td style="padding:3px"><b>{point.y}</b></td></tr><br />',
            footerFormat: '</table>',
            shared: true,
            useHTML: true,
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
            }
        },
        series: [
            {
                name: title,
                colorByPoint: true,
                data: seriesData
            }
        ],
        legend: {
            enabled: false,
        },
        responsive: {
            rules: [
                {
                    condition: {
                        minWidth: 300,
                    },
                },
            ],
        },
        credits: { enabled: false },
        exporting: { enabled: false },
    };

  return (
    <div className={`${className}`}>
        <HighchartsReact 
            highcharts={Highcharts} 
            options={chartOptions} 
        />
    </div>
  )
}

export default PieChart