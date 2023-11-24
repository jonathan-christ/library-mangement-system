import axios from 'axios'
import ViteLogo from '../../assets/vite.svg'
import validator from 'validator'
import ls from 'localstorage-slim'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import AuthorList from '../../components/misc/AuthorList'
import GenreList from '../../components/misc/GenreList'
import RatingForm from '../../components/forms/add/RatingForm'
// import Placeholder from '../../components/loading/Placeholder'

function Book() {
  const navigate = useNavigate()

  const user = (JSON.parse(ls.get('userData', { decrypt: true })))
  const { isbn } = useParams()
  const [book, setBook] = useState({
    id: -1,
    title: '',
    authors: [],
    genres: []
  })

  const initializePage = useCallback(async () => {
    if (isbn === undefined || validator.isAlpha(isbn)) {
      navigate('/catalog')
    } else {
      await axios.post("/api/library/books/find", { isbn: isbn }).then((res) => {
        setBook(res.data)
      }).catch((err) => {
        console.log("Server error! " + err)
      })
    }
  }, [navigate, isbn])

  useEffect(() => {
    initializePage()
  }, [initializePage])

  return (
    <div className='flex flex-col min-w-full p-5  gap-10 '>
      <div className="title flex flex-col text-center gap-5 content-center flex-wrap">

        <div>
          <span className="text-5xl font-semibold">{book.title}</span>
          <div className="rating flex flex-wrap content-center">
            <RatingForm bookID={book.id} userID={user ? user.id : null} />
          </div>
        </div>
        <div className="authlist flex flex-col w-1/2">
          <div><AuthorList authors={book.authors} /></div>
          <div><GenreList genres={book.genres} /></div>
        </div>
      </div>
      <div className="otherDetails flex flex-col flex-wrap w-full content-center">
        <img src={ViteLogo} alt="" width={250} height={300} />
      </div>
      <div className='flex flex-col flex-wrap w-full content-center'>
        <div className="desc flex flex-wrap text-justify">
          {book.description}
        </div>
      </div>
    </div>
  )
}

export default Book