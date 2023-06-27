import React, { useEffect, useRef } from 'react';
import { IInformationTable } from '../../interface'
import Chart, { ChartType, ChartConfiguration } from 'chart.js/auto';

export default function GraphRanking(prop: { informationOfFormula: IInformationTable }) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (prop.informationOfFormula.headInfo.includes('PTS') && chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            const labelThemeDriver = prop.informationOfFormula.headInfo.indexOf('Driver')
            const labelThemeTeam = prop.informationOfFormula.headInfo.indexOf('Team')
            const labelTheme = labelThemeDriver !== -1 ? labelThemeDriver
                : labelThemeTeam !== -1 ? labelThemeTeam : 0
            let labels =
                labelThemeDriver !== -1 ?
                    prop.informationOfFormula.bodyInfo.map(info => info[labelTheme] && info[labelTheme].text ? info[labelTheme].text.trim().slice(-3) : info[labelTheme].trim().slice(-3))
                    : prop.informationOfFormula.bodyInfo.map(info => info[labelTheme] && info[labelTheme].text ? info[labelTheme].text.replace(/\s+/g, ' ').trim() : info[labelTheme].replace(/\s+/g, ' ').trim())

            let data = prop.informationOfFormula.bodyInfo.map(info => info[info.length - 1])
            if (ctx) {
                const chartConfig: ChartConfiguration<ChartType> = {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: labelThemeDriver !== -1 ? 'Driver' : labelThemeTeam !== -1 ? 'Team' : 'Grand Prix',
                            data: data,
                            borderWidth: 1,
                            backgroundColor: '#e10600',
                            borderColor: '#e10600',
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                };
                chartInstance.current = new Chart(ctx, chartConfig);
            }
        }
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [prop.informationOfFormula]);

    return (
        <>
            {
                prop.informationOfFormula.headInfo.includes('PTS') &&
                (<div className='pt-12 pb-4 px-8' >
                    <canvas ref={chartRef} id="myChart" />
                </div >)

            }
        </>
    );
};

