import PropTypes from 'prop-types'


Placeholder.propTypes = {
    size: PropTypes.number.isRequired,
    cols: PropTypes.number.isRequired
}
function Placeholder({ size, cols }) {
    
    const Arr = Array.from({ length: cols }, (_, idx) => `${++idx}`)
    return (
        <div className={'grid gap-5 grid-cols-' + cols}>
            {Arr.map((index)=>{
                return <div key={index} className={"animate-pulse h-"+size+" bg-slate-700 rounded col-span-1"}></div>
            })}
        </div>
    )
}

export default Placeholder