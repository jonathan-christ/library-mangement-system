const db = require("../models");
const Book = require('./book.controller');
const Author = require('./author.controller');
const Genre = require('./genre.controller');

exports.addBook = async (req, res) => {
    let data = req.body.data;
    let bookID, authorList, genreList;

    try {
        const result = await db.sequelize.transaction(async (t) => {
            const book = {
                isbn: data.isbn,
                title: data.title,
                desc: data.desc,
                publisherID: data.publisherID,
                publishDate: data.publishDate,
            };

            const createdBook = await Book.create({ data: book }, res, { transaction: t });
            bookID = createdBook.data.id

            await Promise.all(data.authors.map(async (authID) => {
                authorList = { authorID: authID, bookID: bookID }
                await Author.assignToBook({ data: authorList }, res, { transaction: t });
            }))

            await Promise.all(data.genres.map(async (genreID) => {
                genreList = { genreID: genreID, bookID: bookID };
                await Genre.assignToBook({ data: genreList }, res, { transaction: t });
            }))

            return { message: "Book has been added successfully!" };
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
};