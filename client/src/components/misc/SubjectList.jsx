import PropTypes from 'prop-types'

SubjectList.propTypes = {
    subjects: PropTypes.array.isRequired
}

function SubjectList({ subjects }) {
    return (
        <>
            {subjects.map((subject, idx) => {
                let sep = idx < subjects.length - 1 ? ', ' : ' '
                return <span key={idx}>{`${subject.name}${sep}`}</span>
            })}
        </>
    )
}

export default SubjectList