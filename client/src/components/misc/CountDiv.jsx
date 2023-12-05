import PropTypes from "prop-types"

function CountDiv({ icon, subject, count }) {
    return (
        <div className="flex flex-row w-max text-base gap-3 align-center shadow-lg px-5 py-3 bg-secondary-100 text-text-950 rounded-md border-l-8 border-primary-600">
            {icon}
            <div className="flex flex-col gap-1">
                <div className="font-bold">{subject?.toUpperCase()}</div>
                <div>{count}</div>
            </div>
        </div>
    )
}

CountDiv.propTypes = {
    count: PropTypes.number,
    icon: PropTypes.node,
    subject: PropTypes.string
}

export default CountDiv