import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { imageProxy } from '../../../../assets/constants'
import AuthorList from '../../../misc/AuthorList'
import GenreList from '../../../misc/GenreList'
import SubjectList from '../../../misc/SubjectList'

MiniBook.propTypes = {
    book: PropTypes.object.isRequired
}

function MiniBook({ book }) {
    return (
        <Link className='minibook transition ease-in duration-7 hover:border-primary-500 border-x-transparent border-x-4 col-span-1 flex flex-row p-5 gap-6 shadow-md max-h-full bg-secondary-100 h-[150px] sm:h-[250px]' to={`${book.isbn}`}>
            <div className="flex col-span-2 aspect-[2/3] flex-shrink-0 k">
                <img src={imageProxy + book.bookImg.imgLink} alt="" className='object-cover w-full h-full' />
            </div>
            <div className='flex flex-col gap-1 px-5 truncate'>
                <span className='text-xl font-semibold'>{book.title}</span>
                <div className="authlist flex flex-row gap-2 text-sm overflow-invisible align-middle">
                    <span className='font-semibold flex'>Authors: </span>
                    <AuthorList authors={book.authors} mini/>
                </div>
                <div className="genrelist flex flex-row gap-2 text-sm">
                    <span className='font-semibold'>Genres: </span>
                    <GenreList genres={book.genres} mini/>
                </div>
                <div className="genrelist flex flex-row gap-2 text-sm">
                    <span className='font-semibold'>Subjects: </span>
                    <SubjectList subjects={book.subjects} mini/>
                </div>
                <p className='whitespace-pre-wrap truncate my-2 text-justify text-sm'>{book.description}</p>
            </div>
        </Link>
    )
}

export default MiniBook