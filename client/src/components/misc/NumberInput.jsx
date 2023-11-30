import PropTypes from 'prop-types'

NumberInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string
}
function NumberInput({ id, className, ...rest}) {
    return (
        <input type="number" id={id} aria-describedby="helper-text-explanation" {...rest} className={className+"bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"} placeholder="90210" />
    )
}

export default NumberInput