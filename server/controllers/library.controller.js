const db = require("../models");
const Op = db.Sequelize.Op

const Book = db.book
const Author = db.author
const AuthorList = db.authorList
const Genre = db.genre
const GenreList = db.genreList

exports.addBook = async (req, res) => {
    const data = req.body.data
    try {
        db.sequelize.transaction(async (t) => {
            let book = await Book.create(data.book, { transaction: t })

            let authors = data.authors.map((author) => {
                return { authorID: author, bookID: book.id }
            })

            let genres = data.genres.map((genre) => {
                return { genreID: genre, bookID: book.id }
            })

            await AuthorList.bulkCreate(authors, { transaction: t })
            await GenreList.bulkCreate(genres, { transaction: t })
        })

        res.status(200).send({ message: "Book has been added successfully!" })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.findAllBooks = async (req, res) => {
    try {
        const result = await Book.findAll({
            include: [Author, Genre]
        })

        res.status(200).send(result)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.findBook = async (req, res) => {
    try {
        const result = await Book.findOne({
            where: { isbn: req.body.isbn },
            include: [Author, Genre]
        })

        res.status(result ? 200 : 404).send(result ? result : "Book details not found")
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.updateBook = async (req, res) => {
    // check changes
    let data = req.body.data
    try {
        const result = db.sequelize.transaction(async (t) => {
            const book = await Book.findByPk(req.body.id, { transaction: t })
            await Book.update(data.book, { transaction: t }) //INCOMPLETE should be separated from authors 
            //OYOYOYO use react form hook (..register("book.___"))

            //authors filtering
            const authors = await AuthorList.findAll({ where: { bookID: book.id } }, { transaction: t })

            const removedAuth = authors.filter((author) =>
                !data.authors.includes(author.id)
            )
            let temp = data.authors.filter((authID) =>
                !authors.some((currAuth) => currAuth.id === authID)
            )
            const newAuth = temp.map((author) => {
                return { authorID: author, bookID: book.id }
            })

            //author updating
            AuthorList.destroy({ where: { id: removedAuth } }, { transaction: t })
            AuthorList.createBulk(newAuth, { validate: true, transaction: t })

            //genres (repeat of authors)
            const genres = await GenreList.findAll({ where: { bookID: book.id } }, { transaction: t })
            const removedGenres = genres.filter((genre) =>
                !data.genres.includes(genre.id)
            )
            temp = data.genres.filter((genreID) =>
                !authors.some((currGenres) => currGenres.id === genreID)
            )
            const newGenres = temp.map((genre) => {
                return { genreID: genre, bookID: book.id }
            })

            //genre updating
            GenreList.destroy({ where: { id: removedGenres } }, { transaction: t })
            GenreList.createBulk(newGenres, { validate: true, transaction: t })
        })

        res.status(200).send("Book has been updated!")
    } catch (error) {
        res.status(500).send("Error in updating book! " + error.message)
    }


    // in array of author ids, check existing book records, 
    // delete old, add new
    // replicate for genres

}