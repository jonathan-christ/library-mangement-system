import PropTypes from "prop-types"
import { useEffect } from 'react';
import * as echarts from 'echarts'
import { FaEye } from "react-icons/fa";

const TicketCountPie = ({ total, cancelled, queued, borrowed, showTable }) => {
    useEffect(() => {
        const chart = echarts.init(document.getElementById('ticket-status-pie-chart'));

        const options = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
            },
            series: [
                {
                    name: 'Ticket Status',
                    type: 'pie',
                    radius: '80%',
                    data: [
                        {
                            value: cancelled, name: 'Cancelled Tickets', itemStyle: {
                                color: 'red', // Specify the color for Cancelled Tickets
                            },
                        },
                        { value: queued, name: 'Queued Tickets' },
                        {
                            value: borrowed, name: 'Borrowed Tickets', itemStyle: {
                                color: 'gold', // Specify the color for Cancelled Tickets
                            },
                        },
                        {
                            value: total - (cancelled + queued + borrowed), name: 'Other Status', itemStyle: {
                                color: 'skyblue', // Specify the color for Cancelled Tickets
                            },
                        },
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },
            ],
        };

        chart.setOption(options);

        // Cleanup ECharts instance on component unmount
        return () => {
            chart.dispose();
        };
    }, [total, cancelled, queued, borrowed]);

    return (
        <div className="flex flex-col bg-secondary-100 shadow-lg w-[450px] align-center">
            <div className="relative bg-primary-500 p-3 text-white text-center font-semibold rounded-t-md w-full">
                TICKET COMPOSITION
                <button
                    onClick={()=>showTable? showTable(true, 'tcr'): ''}
                    className="absolute hover:bg-background-800 p-1 rounded-lg right-5">
                    <FaEye />
                </button>
            </div>
            <div className="my-12" id="ticket-status-pie-chart" style={{ width: '100%', height: '100%' }}></div>
        </div>
    )

}

TicketCountPie.propTypes = {
    borrowed: PropTypes.number,
    cancelled: PropTypes.number,
    queued: PropTypes.number,
    showTable: PropTypes.any,
    total: PropTypes.number
}

export default TicketCountPie