import PropTypes from 'prop-types'
import { Badge } from 'flowbite-react'

AuthorList.propTypes = {
    authors: PropTypes.array.isRequired
}
function AuthorList({ authors }) {
    return (
        <div className='flex flex-row gap-2 flex-wrap '>
            {authors.map((author, idx) => {
                return (
                    // <Tooltip key={idx} content={author.bio}>
                    <Badge key={idx} color='info' className='text-sm w-max cursor-default' size={'sm'}>
                        {`${author.firstName}  ${author.lastName}`}
                    </Badge>
                    // </Tooltip>
                )
            })}
        </div>
    )
}

export default AuthorList