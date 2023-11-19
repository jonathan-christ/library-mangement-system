import React from 'react'

function GenreList({ genres }) {
    return (
        <>
            {genres.map((genre, idx) => {
                let sep = idx < genre.length - 1 ? ', ' : ' '
                return <span className='genrelist flex flex-row' key={idx}>{`${genre.name}${sep}`}</span>
            })}
        </>
    )
}

export default GenreList