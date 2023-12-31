"use client";

import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import SearchBar from '../../components/misc/SearchBar'
import MiniBook from '../../components/forms/view/books/MiniBook'
import LoadingAnimation from '../../components/misc/LoadingAnimation';

function Catalog() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBooks()
  }, [])

  const getBooks = async () => {
    await axios.get("/api/library/books").then((res) => {
      setBooks(res.data)
      setLoading(false)
    }).catch((err) => {
      console.log(err)
    })
  }

  const bookCells = useMemo(() => books.map((book, idx) => {
    return <MiniBook key={idx} book={book}></MiniBook>
  })
    , [books])


  return (
    <div className='w-full flex flex-col relative p-5 gap-5 justify-center items-center'>
      <SearchBar resultStore={setBooks} />
      <div className={`${loading ? 'hidden' : 'grid'} grid-cols-1 gap-x-10 gap-y-5 w-full lg:w-2/3`}>
        {bookCells}
      </div>
      {loading && <LoadingAnimation />}
    </div>
  )
}

export default Catalog