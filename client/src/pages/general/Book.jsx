import axios from 'axios'
import validator from 'validator'

import { Button } from 'flowbite-react'
import { useSession } from '../../components/context-hooks/session/SessionUtils'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

import AuthorList from '../../components/misc/AuthorList'
import GenreList from '../../components/misc/GenreList'
import RatingForm from '../../components/forms/add/RatingForm'
import { imageProxy } from '../../assets/constants'
import CopyTable from '../../components/forms/view/books/CopyTable'
// import Placeholder from '../../components/loading/Placeholder'

function Book() {
  const [loading, setLoading] = useState(true)

  const user = useSession()
  const { isbn } = useParams()
  const navigate = useNavigate()

  const [book, setBook] = useState({
    id: -1,
    title: '',
    authors: [],
    genres: []
  })

  const initializePage = useCallback(async () => {
    console.log("reload")
    if (isbn === undefined || validator.isAlpha(isbn)) {
      navigate('/catalog')
    } else {
      await axios.post("/api/library/books/find", { isbn: isbn }).then((res) => {
        setBook(res.data)
        setLoading(false)
      }).catch((err) => {
        console.log("Server error! " + err)
      })
    }
  }, [navigate, isbn])

  useEffect(() => {
    initializePage()
  }, [initializePage])

  return (
    <>
      <Link to='/catalog'>
        <Button>Go Back</Button>

      </Link>
      {!loading &&
        <div className='flex flex-col min-w-full p-5 gap-10'>
          <div className="title flex flex-col text-center gap-5 content-center flex-wrap">
            <div>
              <span className="text-5xl font-semibold">{book.title}</span>
            </div>
            <div className="authlist flex flex-col w-full">
              <div><AuthorList authors={book.authors} /></div>
              <div><GenreList genres={book.genres} /></div>
            </div>
          </div>
          <div className='otherDetails flex flex-col flex-wrap w-full h-[500px] content-center'>
            <div className="aspect-[2/3] h-full">
              <img src={imageProxy + book.bookImg.imgLink} alt="" className='object-cover w-full h-full' />
            </div>
          </div>
          <div className='flex flex-col flex-wrap w-full content-center'>
            <div className="rating flex flex-wrap content-center ">
              <RatingForm bookID={book.id} userID={user ? user.id : null} />
            </div>
            <div className="desc flex flex-wrap text-justify">
              {book.description}
            </div>
          </div>
          <CopyTable bookID={book.id} />
        </div>
      }
    </>
  )
}

export default Book