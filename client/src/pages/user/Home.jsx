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
    }).catch((err) => {
      console.log("Server error!")
    })
  }

  return (
    <div className="flex flex-col gap-5 p-5 ">
      {books.map((book, idx) => {
        return <MiniBook key={idx} book={book}></MiniBook>
      })}
    </div>
  )
}

export default Home