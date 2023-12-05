import PropTypes from 'prop-types'
import { Badge, Tooltip } from 'flowbite-react'

GenreList.propTypes = {
    genres: PropTypes.array.isRequired,
    mini : PropTypes.bool
}

function GenreList({ genres, mini }) {
    return (
        <div className='flex flex-row gap-2 flex-wrap '>
            {mini ? (
                <span>
                    {genres.map((genre, idx) => {
                        return (
                            <span key={idx}>
                                {`${genre.name}`}
                                {idx === genres.length - 1 ? '' : ', '}
                            </span>
                        )
                    })}
                </span>
            ) : (
                <>
                    {genres.map((genre, idx) => {
                        return (
                            <Tooltip key={idx} content={genre.description}>
                                <Badge key={idx} color='blue' theme={{root: {color:{blue:'bg-text-200'}}}} className='text-sm w-max cursor-default' size={'sm'}>
                                    {`${genre.name}`}
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

export default GenreList