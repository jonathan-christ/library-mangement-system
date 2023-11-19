const db = require("../models");
const BookContr = require('./book.controller');
const AuthorContr = require('./author.controller');
const GenreContr = require('./genre.controller');

const Book = db.book
const Author = db.author
const Genre = db.genre

exports.addBook = async (req, res) => {
    let data = req.body.data
    let bookID, authorList, genreList

    try {
        const result = await db.sequelize.transaction(async (t) => {
            const book = {
                isbn: data.isbn,
                title: data.title,
                desc: data.desc,
                publisherID: data.publisherID,
                publishDate: data.publishDate,
            };

            const createdBook = await BookContr.create({ data: book }, res, { transaction: t });
            bookID = createdBook.data.id

            await Promise.all(data.authors.map(async (authID) => {
                authorList = { authorID: authID, bookID: bookID }
                await AuthorContr.assignToBook({ data: authorList }, res, { transaction: t });
            }))

            await Promise.all(data.genres.map(async (genreID) => {
                genreList = { genreID: genreID, bookID: bookID };
                await GenreContr.assignToBook({ data: genreList }, res, { transaction: t });
            }))

            return { message: "BookContr has been added successfully!" };
        });

        res.status(200).send(result)
    } catch (error) {
        console.error(error)

        try {
            res.status(500).send({ message: error.message });
        } catch (nestedError) {
            console.log("Error sending response: ", nestedError.message);
            return nestedError;
        }
    }
}

exports.findAllBooks = async (req, res) => {
    try {
        const result = await Book.findAll({
            include: [Author, Genre]
        })
        res.send(result)
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
        res.send(result)
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}