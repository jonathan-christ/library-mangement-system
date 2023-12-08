import axios from 'axios'
import validator from 'validator'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Button, Tooltip } from 'flowbite-react'
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

import LoginModal from '../../components/LoginModal'
import NullCover from '../../assets/null_book_cover.jpg'

// import Placeholder from '../../components/loading/Placeholder'

function Book() {
  const [loading, setLoading] = useState(true)

  const [hasCopies, setHasCopies] = useState(false)
  const [hasTicket, setHasTicket] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [loginShow, setLoginShow] = useState(false)

  const user = useSession()
  const { isbn } = useParams()
  const navigate = useNavigate()

  const buttonDisabled = (!hasCopies || hasTicket || clicked || user.typeID === 1)
  const [book, setBook] = useState({
    id: -1,
    title: '',
    authors: [],
    genres: []
  })

  const borrowButton = (
    <Button color='blue' theme={{ color: { blue: 'bg-primary-400 text-white hover:bg-primary-800 duration-75' } }} onClick={async () => {
      user ? setClicked(true) : setLoginShow(true) 
      await reserveBook(book.id)
      await hasReserved()
    }}
      disabled={buttonDisabled}>
      Borrow Book
    </Button>
  )

  const initializePage = useCallback(async () => {
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
    if (book.id == -1) {
      initializePage()
    }
    hasReserved()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, loginShow])

  const reserveBook = async (bookID) => {
    if (user ?? false) {
      await axios.post("/api/transactions/tickets/create", { bookID: bookID, id: user.id })
        .then(() => {
          toast.success('You have queued a reservation for the book!')
          toast.info('A notification will be sent when a reservation has been made.')
        }).catch((err) => {
          toast.error('Unable to create reservation! Server error')
          console.log(err)
          setClicked(false)
        })
    }
  }

  const hasReserved = async () => {
    if (user ?? false) {
      await axios.post("/api/transactions/tickets/find", { userID: user.id, bookID: book.id })
        .then((res) => {
          setHasTicket(res.data.found)
        }).catch((err) => {
          toast.error('Unable to retrieve ticket details! Server error')
          console.log(err)
        })
    } else {
      console.log(buttonDisabled)
      setHasTicket(false)
    }
  }

  return (
    <div className='relative '>
      <LoginModal show={loginShow} setShow={setLoginShow} />
      <Link to='/catalog' className='fixed top-1/3 h-32'>
        <Button color='blue' theme={{ color: { blue: 'bg-primary-400 text-white hover:bg-primary-800 duration-75' } }} className='h-full shadow-lg  rounded-s-sm -left-2/3 text-transparent hover:left-0 hover:text-white transition-all duration-100'>{'<- '}BACK</Button>
      </Link>
      {!loading &&
        <div className='flex flex-col lg:flex-row py-5 px-10 gap-10 xl:px-20 h-max'>
          <div className='bg-secondary-100 flex flex-col w-full md:w-1/2 xl:w-1/4 gap-1 md:self-center lg:self-auto flex-shrink-0 shadow-lg rounded-md'>
            <div className='bg-primary-400 p-3 text-lg text-white text-center font-semibold rounded-t-md'>
              BOOK INFO
            </div>
            <div className='p-5 w-full m-auto flex flex-col gap-5'>
              <div className='otherDetails flex flex-col flex-wrap content-center'>
                <div className="aspect-[2/3] h-full">
                  <img src={book.bookImg ? imageProxy + book.bookImg.imgLink : NullCover} alt="" className='object-cover w-full h-full' />
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
            selectedTabClassName='bg-primary-400 text-white'
            selectedTabPanelClassName='bg-inherit'
            className='w-full h-full'
          >
            <TabList className='flex flex-row w-full cursor-pointer font-semibold'>
              <Tab className='rounded-ss-md p-3 text-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-100'  >OVERVIEW</Tab>
              <Tab className='rounded-se-md p-3 text-lg bg-gray-800 text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-100'>COPIES</Tab>
            </TabList>

            <div className='h-full shadow-lg p-5 bg-secondary-100 rounded-md rounded-tl-none'>
              <TabPanel className='flex flex-col gap-5'>
                <article>
                  <div className='shadow-md bg-primary-400 p-2 text-md text-white text-center font-semibold w-[125px] rounded-t-md'>
                    Description
                  </div>
                  <div className='bg-secondary-50 p-5 shadow-md text-justify'>
                    {book.description}
                  </div>
                </article>
                <article className='flex flex-row'>
                  <div className='shadow-md content-center bg-primary-400 p-2 text-md text-white text-center font-semibold w-[125px] rounded-s-md'>
                    Authors
                  </div>
                  <div className='bg-secondary-50 p-2 shadow-md flex flex-row gap-2 w-full md:w-11/12'>
                    <AuthorList authors={book.authors} />
                  </div>
                </article>
                <article className='flex flex-row'>
                  <div className='shadow-md align-middle bg-primary-400 p-2 text-md text-white text-center font-semibold w-[125px]  rounded-s-md'>
                    Genres
                  </div>
                  <div className='bg-secondary-50 p-2 shadow-md flex flex-row gap-2  w-11/12'>
                    <GenreList genres={book.genres} />
                  </div>
                </article>
                <article className='flex flex-row w-full'>
                  <div className='shadow-md align-middle bg-primary-400 p-2 text-md text-white text-center font-semibold w-[125px]  rounded-s-md'>
                    Subjects
                  </div>
                  <div className='bg-secondary-50 p-2 shadow-md flex flex-row w-11/12'>
                    <SubjectList subjects={book.subjects} />
                  </div>
                </article>
              </TabPanel>
              <TabPanel>
                <CopyTable bookID={book.id} getHasCopies={setHasCopies} />
                {buttonDisabled ? (
                  <Tooltip content={`
                    ${!user ? 'You are not logged in!\n' : ''}
                    ${user.typeID==1 ? 'You need to be a confirmed user!\n' : ''}
                    ${!hasCopies ? 'Book doesn\'t have any copies!\n' : ''}
                    ${hasTicket ? 'You already have a ticket!\n' : ''}
                    ${clicked ? 'Transaction is processing!\n' : ''}
                  `}>
                    {borrowButton}
                  </Tooltip>
                ) : (
                  borrowButton
                )}
              </TabPanel>
            </div>
          </Tabs>
        </div >
      }
    </div >
  )
}

export default Book