import PropTypes from 'prop-types'
import { Badge, Tooltip } from 'flowbite-react'

SubjectList.propTypes = {
    subjects: PropTypes.array.isRequired,
    mini: PropTypes.bool
}

function SubjectList({ subjects, mini }) {
    return (
        <div className='flex flex-row gap-2 flex-wrap '>
            {mini ? (
                <span>
                    {subjects.map((subject, idx) => {
                        return (
                            <span key={idx}>
                                {`${subject.name}`}
                                {idx === subjects.length - 1 ? '' : ', '}
                            </span>
                        )
                    })}
                </span>
            ) : (
                <>
                    {subjects.map((subject, idx) => {
                        return (
                            <Tooltip key={idx} content={subject.description}>
                                <Badge key={idx} color='blue' theme={{ root: { color: { blue: 'bg-text-200' } } }} className='text-sm w-max cursor-default' size={'sm'}>
                                    {`${subject.name}`}
                                </Badge>
                            </Tooltip>
                        )
                    })}
                </>
            )
            }
        </div>
    )
}

export default SubjectList