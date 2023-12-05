import PropTypes from 'prop-types'
import { Badge, Tooltip } from 'flowbite-react'

AuthorList.propTypes = {
    authors: PropTypes.array.isRequired,
    mini: PropTypes.bool
}
function AuthorList({ authors, mini }) {
    return (
        <div className='flex flex-row gap-2 flex-wrap '>
            {mini ? (
                <span>
                    {authors.map((author, idx) => {
                        return (
                            <span key={idx}>
                                {`${author.firstName} ${author.lastName}`}
                                {idx === authors.length - 1 ? '' : ', '}
                            </span>
                        )
                    })}
                </span>
            ) : (
                <>
                    {authors.map((author, idx) => {
                        return (
                            <Tooltip key={idx} content={author.bio}>
                                <Badge key={idx} color='blue' theme={{ root: { color: { blue: 'bg-text-200' } } }} className='text-sm w-max cursor-default' size={'sm'}>
                                    {`${author.firstName}  ${author.lastName}`}
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

export default AuthorList