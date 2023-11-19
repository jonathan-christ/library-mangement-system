import axios from 'axios'
import ViteLogo from '../../assets/vite.svg'
import React, { useState, useEffect } from 'react'

import AuthorList from '../../components/misc/AuthorList'
import GenreList from '../../components/misc/GenreList'

function Book({ id }) {
  const [book, setBook] = useState({
    title: '',
    authors: [],
    genres: []
  })

  useEffect(() => {
    getBook()
  }, [])

  const getBook = async () => {
    await axios.post("api/library/books/find", {isbn : '6969696969699'}).then((res) => {
      setBook(res.data)
      console.log(res)
    }).catch((err) => {
      console.log("Server error!")
    })
  }
  return (
    <div className='flex flex-col min-w-full p-5'>
      <div className="title flex flex-col text-center">
        <span className="text-5xl font-semibold">{book.title}</span>
        <div className="authlist">
          <span>By: </span>
          <AuthorList authors={book.authors} />
        </div>
      </div>
      <div className='main flex flex-row min-w-full'>
        <div className="otherDetails flex flex-col">
          <img src={ViteLogo} alt="" className='w-full h-1/2'/>
          <div className='text-base'>
            <span className='font-semibold text-lg'>Genres </span>
            <GenreList genres={book.genres} />
          </div>
        </div>
        <div className="rating">

        </div>
        <div className="desc">

        </div>
      </div>
    </div>
  )
}

export default Book