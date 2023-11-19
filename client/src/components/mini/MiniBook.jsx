import React from 'react'
import ViteLogo from '../../assets/vite.svg'

import AuthorList from '../misc/AuthorList'
import GenreList from '../misc/GenreList'

function MiniBook({ book }) {
    return (
        <div className='minibook flex flex-row p-5 gap-6 min-h-max border-2'>
            <img src={ViteLogo} alt="" width={'75px'} height={'150px'}/>
            <div className='flex flex-col gap-1'>
                <span className='text-xl font-semibold'>{book.title}</span>
                <div className="authlist flex flex-row gap-2 text-sm overflow-invisible">
                    <span className='font-semibold'>Authors: </span>
                    <AuthorList authors={book.authors} />
                </div>
                <div className="genrelist flex flex-row gap-2 text-sm">
                    <span className='font-semibold'>Genres: </span>
                    <GenreList genres={book.genres} />
                </div>
                <div className='flex my-2 flex-nowrap'>{book.description}</div>
            </div>


        </div>
    )
}

export default MiniBook