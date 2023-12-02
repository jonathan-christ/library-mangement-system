import axios from 'axios'
import validator from 'validator'

import { Button, Tabs } from 'flowbite-react'
import { useSession } from '../../components/context-hooks/session/SessionUtils'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

import AuthorList from '../../components/misc/AuthorList'
import GenreList from '../../components/misc/GenreList'
import RatingForm from '../../components/forms/add/RatingForm'
import { imageProxy } from '../../assets/constants'
import CopyTable from '../../components/forms/view/books/CopyTable'

import { dateSplicer } from '../../assets/formatter'

// import Placeholder from '../../components/loading/Placeholder'

function Book() {
  const [reserved, setReserved] = useState(true)
  const [loading, setLoading] = useState(true)
  const [hasCopies, setHasCopies] = useState(false)

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
    hasReserved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const reserveBook = async (bookID) => {
    await axios.post("/api/transactions/tickets/create", { bookID: bookID, id: user.id })
      .then(() => {

      }).catch((err) => {
        console.log(err)
      })
  }

  const hasReserved = async () => {
    await axios.post("/api/transactions/tickets/find", { userID: user.id, bookID: book.id })
      .then((res) => {
        setReserved(res.data.found)
      }).catch((err) => {
        console.log(err)
      })
  }

  return (
    <div className='relative '>
      <Link to='/catalog' className='fixed top-15 left-0'>
        <Button className='rounded-none'>{'<-'}</Button>
      </Link>
      {!loading &&
        // <div className='flex flex-col justify-center min-w-full p-5 gap-10'>
        //   <div className="title flex flex-col text-center gap-5 content-center flex-wrap">
        //     <div>
        //       <span className="text-5xl font-semibold">{book.title}</span>
        //     </div>
        //     <div className="authlist flex flex-col w-full">
        //       <div><AuthorList authors={book.authors} /></div>
        //       <div><GenreList genres={book.genres} /></div>
        //     </div>
        //   </div>

        //   <div className='flex flex-col flex-wrap w-full content-center'>
        //     <div className="rating flex flex-wrap content-center ">
        //       <RatingForm bookID={book.id} userID={user ? user.id : null} />
        //     </div>
        //     <div className="desc flex flex-wrap text-justify">
        //       {book.description}
        //     </div>
        //   </div>
        //   <CopyTable bookID={book.id} setExists={setHasCopies} />
        //   <Button onClick={async () => {
        //     await reserveBook(book.id)
        //     setLoading(true)
        //   }}
        //     disabled={(reserved || !hasCopies || user.typeID == 1) ? true : null}>
        //     Borrow Book
        //   </Button>
        // </div>
        <div className='flex flex-col lg:flex-row p-10 gap-10'>
          <div className='bg-white flex flex-col w-full md:w-2/3 lg:w-1/5 gap-5 flex-shrink-0 shadow-lg'>
            <div className='bg-blue-600 p-3 text-lg text-white text-center font-semibold'>
              BOOK INFO
            </div>
            <div className='p-5 w-full m-auto flex flex-col gap-5 '>
              <div className='otherDetails flex flex-col flex-wrap content-center'>
                <div className="aspect-[2/3] h-full  w-3/4">
                  <img src={imageProxy + book.bookImg.imgLink} alt="" className='object-cover w-full h-full' />
                </div>
              </div>
              <span className='font-semibold col-span-4 text-center w-full'>{book.title}</span>
              <div className='grid grid-cols-3 gap-x-1 text-sm items-center'>
                <span className='font-semibold'>ISBN: </span>
                <span className='col-span-2'>{book.isbn}</span>
                <span className='font-semibold'>Page #:</span>
                <span className='col-span-2'>{book.pages}</span>
                <span className='font-semibold'>Publisher:</span>
                <span className='col-span-2'>{book.publisher.name}</span>
                <span className='font-semibold'>Published:</span>
                <span className='col-span-2'>{dateSplicer(book.publishDate, 'year')}</span>
              </div>
            </div>
          </div>

          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
              <li className="me-2" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg" id="profile-tab" data-tabs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Profile</button>
              </li>
              <li className="me-2" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="dashboard-tab" data-tabs-target="#dashboard" type="button" role="tab" aria-controls="dashboard" aria-selected="false">Dashboard</button>
              </li>
              <li className="me-2" role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="settings-tab" data-tabs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">Settings</button>
              </li>
              <li role="presentation">
                <button className="inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300" id="contacts-tab" data-tabs-target="#contacts" type="button" role="tab" aria-controls="contacts" aria-selected="false">Contacts</button>
              </li>
            </ul>
          </div>
          <div id="default-tab-content">
            <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="profile" role="tabpanel" aria-labelledby="profile-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Profile tabs associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
            <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="dashboard" role="tabpanel" aria-labelledby="dashboard-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Dashboard tabs associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
            <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="settings" role="tabpanel" aria-labelledby="settings-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Settings tabs associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
            <div className="hidden p-4 rounded-lg bg-gray-50 dark:bg-gray-800" id="contacts" role="tabpanel" aria-labelledby="contacts-tab">
              <p className="text-sm text-gray-500 dark:text-gray-400">This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Contacts tabs associated content</strong>. Clicking another tab will toggle the visibility of this one for the next. The tab JavaScript swaps classes to control the content visibility and styling.</p>
            </div>
          </div>
        </div>

      }
    </div >
  )
}

export default Book