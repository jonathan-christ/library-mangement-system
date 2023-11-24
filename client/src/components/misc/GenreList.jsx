import PropTypes from 'prop-types'

GenreList.propTypes = {
    genres: PropTypes.object.isRequired
}

function GenreList({ genres }) {
    return (
        <>
            {genres.map((genre, idx) => {
                let sep = idx < genres.length - 1 ? ', ' : ' '
                return <span key={idx}>{`${genre.name}${sep}`}</span>
            })}
        </>
    )
}

export default GenreList