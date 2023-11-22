import axios from 'axios'
import React, { useState, useEffect } from 'react'
import MiniBook from '../../components/mini/MiniBook'

function Home() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    getBooks()
  }, [])

  const getBooks = async () => {
    await axios.get("/api/library/books").then((res) => {
      setBooks(res.data)
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-5 p-5 lg:w-2/3 md:w-full sm:w-full">
      {books.map((book, idx) => {
        return <MiniBook key={idx} book={book}></MiniBook>
      })}
    </div>
  )
}

export default Home