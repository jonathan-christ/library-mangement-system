import axios from 'axios'
import validator from 'validator'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Button } from 'flowbite-react'
import { useSession } from '../../components/context-hooks/session/SessionUtils'
import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'

import AuthorList from '../../components/misc/AuthorList'
import GenreList from '../../components/misc/GenreList'
import RatingForm from '../../components/forms/add/RatingForm'
import { imageProxy } from '../../assets/constants'
import CopyTable from '../../components/forms/view/books/CopyTable'

import { dateSplicer } from '../../assets/formatter'
import SubjectList from '../../components/misc/SubjectList'
import { toast } from 'react-toastify'

// import Placeholder from '../../components/loading/Placeholder'

function Book() {
  const [loading, setLoading] = useState(true)
  const [buttonDisabled, setButtonDisabled] = useState(false)

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
        toast.error('Unable to retrieve book details! Server error')
        console.log("Server error! " + err)
      })
    }
  }, [navigate, isbn])

  useEffect(() => {
    hasReserved()
    initializePage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reserveBook = async (bookID) => {
    if (user ?? false) {
      await axios.post("/api/transactions/tickets/create", { bookID: bookID, id: user.id })
        .then(() => {
          toast.success('You have queued a reservation for the book!')
          toast.info('A notification will be sent when a reservation has been made.')
        }).catch((err) => {
          toast.error('Unable to create reservation! Server error')
          console.log(err)
        })
    }
  }

  const hasReserved = async () => {
    if (user ?? false) {
      await axios.post("/api/transactions/tickets/find", { userID: user.id, bookID: book.id })
        .then((res) => {
          setButtonDisabled(res.data.found)
        }).catch((err) => {
          toast.error('Unable to retrieve ticket details! Server error')
          console.log(err)
        })
    }else {
      setButtonDisabled(true)
    }
  }

  const empty = async (res) => {
    if (buttonDisabled && !res) {
      setButtonDisabled(true)
    }

  }

  return (
    <div className='relative '>
      <Link to='/catalog' className='fixed top-15 left-0'>
        <Button className='rounded-none'>{'<-'}</Button>
      </Link>
      {!loading &&
        <div className='flex flex-col lg:flex-row py-5 px-10 gap-10 xl:px-20 h-max'>
          <div className='bg-gray-100 flex flex-col w-full md:w-1/2 xl:w-1/5 gap-1 md:self-center lg:self-auto flex-shrink-0 shadow-lg'>
            <div className='bg-blue-600 p-3 text-lg text-white text-center font-semibold'>
              BOOK INFO
            </div>
            <div className='p-5 w-full m-auto flex flex-col gap-5'>
              <div className='otherDetails flex flex-col flex-wrap content-center'>
                <div className="aspect-[2/3] h-full">
                  <img src={imageProxy + book.bookImg.imgLink} alt="" className='object-cover w-full h-full' />
                </div>
              </div>
              <span className='font-semibold text-lg'>{book.title.toUpperCase()}</span>
              <div className='flex flex-col gap-3 w-full' >
                <div className='grid grid-cols-3 gap-1 text-sm items-center'>
                  <span className='col-span-1 font-semibold'>ISBN:</span>
                  <span className='col-span-2'>{book.isbn}</span>
                  <span className='col-span-1 font-semibold'>Page #:</span>
                  <span className='col-span-2'>{book.pages}</span>
                  <span className='col-span-1 font-semibold'>Publisher:</span>
                  <span className='col-span-2'>{book.publisher.name}</span>
                  <span className='col-span-1 font-semibold'>Published:</span>
                  <span className='col-span-2'>{dateSplicer(book.publishDate, 'year')}</span>
                </div>
                <RatingForm bookID={book.id} userID={user?.id} />
              </div>
            </div>
          </div>

          <Tabs
            selectedTabClassName='bg-tab-active text-white'
            selectedTabPanelClassName='bg-inherit'
            className='w-full h-full'
          >
            <TabList className='flex flex-row w-full cursor-pointer font-semibold '>
              <Tab className='p-3 text-lg bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white'  >OVERVIEW</Tab>
              <Tab className='p-3 text-lg bg-gray-800 text-gray-400 hover:bg-blue-600 hover:text-white'>COPIES</Tab>
            </TabList>

            <div className='h-full shadow-lg p-5 bg-gray-100'>
              <TabPanel className='flex flex-col gap-5 '>
                <article>
                  <div className='bg-blue-600 p-2 text-md text-white text-center font-semibold w-[125px]'>
                    Description
                  </div>
                  <div className='bg-white p-5 shadow-md'>
                    {book.description}
                  </div>
                </article>
                <article className='flex flex-row'>
                  <div className='bg-blue-600 p-2 text-md text-white text-center font-semibold w-[125px]'>
                    Authors
                  </div>
                  <div className='bg-white p-2 shadow-md flex flex-row gap-2 w-full md:w-11/12'>
                    <AuthorList authors={book.authors} />
                  </div>
                </article>
                <article className='flex flex-row'>
                  <div className='bg-blue-600 p-2 text-md text-white text-center font-semibold w-[125px]'>
                    Genres
                  </div>
                  <div className='bg-white p-2 shadow-md flex flex-row gap-2  w-11/12'>
                    <GenreList genres={book.genres} />
                  </div>
                </article>
                <article className='flex flex-row w-full'>
                  <div className='bg-blue-600 p-2 text-md text-white text-center font-semibold w-[125px]'>
                    Subjects
                  </div>
                  <div className='bg-white p-2 shadow-md flex flex-row w-11/12'>
                    <SubjectList subjects={book.subjects} />
                  </div>
                </article>
              </TabPanel>
              <TabPanel>
                <CopyTable bookID={book.id} setEmpty={empty} />
                <Button onClick={async () => {
                  setButtonDisabled(true)
                  await reserveBook(book.id)
                }}
                  disabled={buttonDisabled || !user ? true : false || hasReserved() }>
                  Borrow Book
                </Button>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      }
    </div >
  )
}

export default Book