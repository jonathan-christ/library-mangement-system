"use client";

import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
import SearchBar from '../../components/misc/SearchBar'
import MiniBook from '../../components/forms/view/books/MiniBook'

function Catalog() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    getBooks()
  }, [])

  const getBooks = async () => {
    await axios.get("/api/library/books").then((res) => {
      setBooks(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  const bookCells = useMemo(() => books.map((book, idx) => {
    return <MiniBook key={idx} book={book}></MiniBook>
  })
    , [books])


  return (
    <div className='w-full flex justify-center flex-col relative p-5 gap-5'>
      <SearchBar resultStore={setBooks}/>
      <div className=" grid grid-cols-1 gap-x-10 gap-y-5 lg:w-2/3 md:w-full sm:w-full">
        {bookCells}
      </div>
    </div>
  )
}

export default Catalog