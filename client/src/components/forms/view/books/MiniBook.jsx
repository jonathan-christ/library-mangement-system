import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ViteLogo from '../../../../assets/vite.svg'

import AuthorList from '../../../misc/AuthorList'
import GenreList from '../../../misc/GenreList'
import SubjectList from '../../../misc/SubjectList'

MiniBook.propTypes = {
    book: PropTypes.object.isRequired
}

function MiniBook({ book }) {
    return (
        <Link className='minibook transition ease-in duration-7 hover:border-blue-600 border-x-transparent border-x-4 col-span-1 flex flex-row p-5 gap-6 shadow-md max-h-max bg-white' to={`${book.isbn}`}>
            <div className="flex col-span-2 align-middle justify-center flex-shrink-0">
                <img src={ViteLogo} alt="" width={'75px'} height={'150px'} />
            </div>
            <div className='flex flex-col gap-1 px-5 truncate'>
                <span className='text-xl font-semibold'>{book.title}</span>
                <div className="authlist flex flex-row gap-2 text-sm overflow-invisible">
                    <span className='font-semibold'>Authors: </span>
                    <AuthorList authors={book.authors} />
                </div>
                <div className="genrelist flex flex-row gap-2 text-sm">
                    <span className='font-semibold'>Genres: </span>
                    <GenreList genres={book.genres} />
                </div>
                <div className="genrelist flex flex-row gap-2 text-sm">
                    <span className='font-semibold'>Subjects: </span>
                    <SubjectList subjects={book.subjects} />
                </div>
                <p className='flex my-2 truncate'>{book.description}</p>
            </div>
        </Link>
    )
}

export default MiniBook