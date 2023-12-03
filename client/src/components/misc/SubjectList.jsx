import PropTypes from 'prop-types'
import {Badge} from 'flowbite-react'

SubjectList.propTypes = {
    subjects: PropTypes.array.isRequired
}

function SubjectList({ subjects }) {
    return (
        <div className='flex flex-row gap-2 flex-wrap '>
            {subjects.map((subject, idx) => {
                return (
                    <Badge key={idx} color='info' className='text-sm w-max cursor-default'>
                        <span key={idx}>{`${subject.name}`}</span>
                    </Badge>
                )
            })}
        </div>
    )
}

export default SubjectList