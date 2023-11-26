const db = require("../models");
const Op = db.Sequelize.Op

const Book = db.book

const Author = db.author
const AuthorList = db.authorList

const Genre = db.genre
const GenreList = db.genreList

const Subject = db.subject
const SubjectList = db.subjectList

const Publisher = db.publisher
const BookImage = db.bookImg


exports.addBook = async (req, res) => {
    const data = req.body.data
    return 
    try {
        db.sequelize.transaction(async (t) => {
            let book = await Book.create(data.book, { transaction: t })
            
            let authors = data.authors.map((author) => {
                return { authorID: author, bookID: book.id }
            })
            
            let genres = data.genres.map((genre) => {
                return { genreID: genre, bookID: book.id }
            })

            let subjects = data.subjects.map((subject) => {
                return { subjectID: subject, bookID: book.id }
            })
            
            await AuthorList.bulkCreate(authors, { transaction: t })
            await GenreList.bulkCreate(genres, { transaction: t })
            await SubjectList.bulkCreate(subjects, { transaction: t })
        })
        
        res.status(200).send({ message: "Book has been added successfully!" })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.findAllBooks = async (req, res) => {
    try {
        const result = await Book.findAll({
            include: [Author, Genre, Subject, Publisher, BookImage]
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
            include: [Author, Genre, Subject, Publisher, BookImage]
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

            updateList(data.authors, 'authorID', AuthorList, book.id, {transaction: t})
            updateList(data.genres, 'genreID', GenreList, book.id, {transaction: t})
            updateList(data.subject, 'subjectID', SubjectList, book.id, {transaction: t})
        })
        
        res.status(200).send("Book has been updated!")
    } catch (error) {
        res.status(500).send("Error in updating book! " + error.message)
    }
}

const updateList = async (data, modelName, dbModel, bookID, transaction) => {
    const models = await dbModel.findAll({ where: { bookID: bookID } }, transaction)
    const removedModels = models.filter((author) =>
        !data.includes(author.id)
    )
    let temp = list.filter((modelID) =>
        !data.some((currModel) => currModel.id === modelID)
    )
    const newModels = temp.map((model) => {
        return { [`${modelName}`]: model, bookID: bookID }
    })

    await dbModel.destroy({ where: { id: removedModels } }, transaction)
    await dbModel.createBulk(newModels, { validate: true, ...transaction})
}