import React from 'react'
import { Link } from 'react-router-dom'
import ViteLogo from '../../assets/vite.svg'

import AuthorList from '../misc/AuthorList'
import GenreList from '../misc/GenreList'

function MiniBook({ book }) {
    return (
        <Link className='minibook flex flex-row p-5 gap-6 border-2 min-h-max max-w-screen-md' to={`${book.isbn}`}>
            <img src={ViteLogo} alt="" width={'75px'} height={'150px'} />
            <div className='flex flex-col gap-1 max-w-full'>
                <span className='text-xl font-semibold'>{book.title}</span>
                <div className="authlist flex flex-row gap-2 text-sm overflow-invisible">
                    <span className='font-semibold'>Authors: </span>
                    <AuthorList authors={book.authors} />
                </div>
                <div className="genrelist flex flex-row gap-2 text-sm">
                    <span className='font-semibold'>Genres: </span>
                    <GenreList genres={book.genres} />
                </div>
                <p className='flex my-2 truncate '>{book.description}</p>
            </div>
        </Link>
    )
}

export default MiniBook