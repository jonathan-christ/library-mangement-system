"use client";

import axios from 'axios'
import { useState, useEffect, useMemo } from 'react'
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
    <div className="grid grid-cols-1 gap-x-10 gap-y-5 p-5 lg:w-2/3 md:w-full sm:w-full">
      {bookCells}
    </div>
  )
}

export default Catalog