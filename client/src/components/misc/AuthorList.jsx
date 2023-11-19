import React from 'react'

function AuthorList({ authors }) {
    return (
        <>
            {authors.map((author, idx) => {
                let sep = idx < authors.length - 1 ? ', ' : ' '
                return <span key={idx}>{`${author.firstName}  ${author.lastName}${sep}`} </span>
            })}
        </>
    )
}

export default AuthorList