import PropTypes from 'prop-types'
import { Badge } from 'flowbite-react'

GenreList.propTypes = {
    genres: PropTypes.array.isRequired
}

function GenreList({ genres }) {
    return (
        <>
            {genres.map((genre, idx) => {
                return (

                    <Badge key={idx} color='indigo' className='text-sm w-max cursor-default'>
                        {`${genre.name}`}
                    </Badge>

                )
            })}
        </>
    )
}

export default GenreList