import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highstock'

interface IColumnChartProps {
    title: string;
    seriesData: any[];
    categoriesData: string[];
}

const ColumnChart = ({title, seriesData, categoriesData}: IColumnChartProps) => {
    
    const chartOptions = {
        chart: {
            type: 'column',
            spacingTop: 0,
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'lexend',
                justifyContent: 'right',
                color: '#ffffff'
            },
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
            column: {
                pointPadding: 0.2,
                borderWidth: 1,
                
                dataLabels: {
                    enabled: false
                },
                label: {
                    enabled: true,
                    style: {
                        color: '#ffffff'
                    }
                },
            }
        },
        series: seriesData,
        yAxis: {
            labels: {
                style: {
                    color: '#ffffff'
                }
            },
        },
        xAxis: {
            title: {
                style: {
                    color: '#ffffff'
                }
            },
            labels: {
                style: {
                    color: '#b4bbd3'
                }
            },
            gridLineColor: 'transparent',
            plotLines: [
                {
                    color: 'transparent'
                }
            ],
            categories: categoriesData,
        },
       
        legend: {
            enabled: false,
            align: 'left',
            verticalAlign: 'middle',
            x: 0,
            y: 0,
            layout: 'vertical',
            className: '!text-white',
            style: {
                color: '#ffffff',
            },
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
    }

  return (
    <div>
        <HighchartsReact 
            highcharts={Highcharts} 
            options={chartOptions} 
        />
    </div>
  )
}

export default ColumnChart