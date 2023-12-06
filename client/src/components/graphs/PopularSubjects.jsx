import PropTypes from "prop-types"
import { useEffect } from 'react';
import * as echarts from 'echarts';

const RadarGraph = ({ data }) => {
    useEffect(() => {
        // Check if the chart instance is already initialized
        const existingChart = echarts.getInstanceByDom(document.getElementById('radar-graph'))
        if (existingChart) {
            echarts.dispose(existingChart)
        }

        // Initialize ECharts instance
        const chart = echarts.init(document.getElementById('radar-graph'))

        if (data && data.length > 0) {
            // Prepare data for ECharts
            console.log(data)
            const indicatorData = data.map(item => ({ name: item.Subject, max: 30 }))
            const Teacher = data.map(item => item.Teachers)
            const Student = data.map(item => item.Students)

            // ECharts options
            const options = {
                tooltip: {},
                legend: {
                    left: 'left',
                    data: [
                        'Teacher',
                        'Student'
                    ],
                },
                radar: {
                    indicator: indicatorData,
                    center: ['50%', '50%'],
                    radius: '50%',
                    name: {
                        textStyle: {
                            color: '#666', // Color of item name
                        },
                    },
                },
                series: [
                    {
                        type: 'radar',
                        data: [
                            {
                                value: Teacher,
                                name: 'Teacher',
                                lineStyle: {
                                    color: '#7c3aed', // Line color for series 'a'
                                },
                                areaStyle: {
                                    color: 'rgba(124,58,237, 0.2)', // Adjust the fill color as needed
                                },
                                itemStyle: {
                                    color: '#7c3aed', // Point color for series 'b'
                                },
                                emphasis: {
                                    lineStyle: {
                                        width: 4,
                                    },
                                },
                            },
                            {
                                value: Student,
                                name: 'Student',
                                lineStyle: {
                                    color: '#2b6ca1', // Line color for series 'a'
                                },
                                areaStyle: {
                                    color: 'rgba(43,108,161, 0.4)', // Adjust the fill color as needed
                                },
                                itemStyle: {
                                    color: '#2b6ca1', // Point color for series 'b'
                                },
                                emphasis: {
                                    lineStyle: {
                                        width: 4,
                                    },
                                },
                            },
                        ],
                    },
                ],

            };

            // Set options and render chart
            chart.setOption(options)
        }
    }, [data])

    return (
        <div className="flex flex-col shadow-lg h-max">
            <div className="bg-primary-500 p-3 text-white text-center font-semibold rounded-t-md">POPULAR SUBJECTS TO DEMOGRAPHIC</div>
            <div id="radar-graph" style={{ width: '500px', height: '550px' }} className=' bg-secondary-200 rounded-b-md'></div>
        </div>
    )
};

RadarGraph.propTypes = {
    data: PropTypes.array
}

export default RadarGraph