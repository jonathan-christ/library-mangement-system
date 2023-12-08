import PropTypes from "prop-types"
import { useEffect } from 'react';
import * as echarts from 'echarts';
import { FaEye } from "react-icons/fa";


const MonthlyBorrowing = ({ data, showTable }) => {
    useEffect(() => {
        const chart = echarts.init(document.getElementById('monthly-ticket-bookings-chart'))

        if (data && data.length > 0) {
            const months = data.map(entry => entry.month);
            const bookings = data.map(entry => entry.bookings);

            const options = {
                xAxis: {
                    type: 'category',
                    data: months,
                },
                yAxis: {
                    type: 'value',
                    name: 'Tickets',
                },
                lineStyle: {
                    color: '#007bff', // Specify the color of the line
                },
                itemStyle: {
                    color: '#007bff', // Specify the color of the data points
                },
                label: {
                    show: true,
                    color: '#333', // Specify the color of the labels
                },
                tooltip: {
                    trigger: 'axis',
                },
                series: [
                    {
                        type: 'line',
                        data: bookings,
                    },
                ],
            };

            chart.setOption(options);
        }
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }, [data])


    return (
        <div className="flex flex-col shadow-lg h-max min-w-[400px] md:w-2/3">
            <div className="relative bg-primary-500 p-3 text-white text-center font-semibold rounded-t-md w-full">
                MONTHLY TICKET BOOKINGS
                <button
                    onClick={()=>showTable? showTable(true, 'mtb'): ''}
                    className="absolute hover:bg-background-800 p-1 rounded-lg right-5">
                    <FaEye />
                </button>
            </div>
            <div id="monthly-ticket-bookings-chart" style={{ width: '100%', height: '350px' }} className='bg-secondary-100'></div>
        </div>
    )
};

MonthlyBorrowing.propTypes = {
  data: PropTypes.array,
  showTable: PropTypes.func
}

export default MonthlyBorrowing;