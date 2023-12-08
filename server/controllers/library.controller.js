const db = require("../models")
const path = require('path')
const multer = require('multer')
const unflatten = require('../assets/helper functions/unflatten')

const Op = db.Sequelize.Op

const Book = db.book
const BookCopy = db.bookCopy

const Author = db.author
const AuthorList = db.authorList

const Genre = db.genre
const GenreList = db.genreList

const Subject = db.subject
const SubjectList = db.subjectList

const Publisher = db.publisher
const BookImage = db.bookImg

const Ticket = db.ticket


exports.addBook = async (req, res) => {
    let data = req.body
    let temp = data
    try {
        db.sequelize.transaction(async (t) => {
            if (data.book === undefined) {
                const uploadedImage = await new Promise((resolve, reject) => {
                    upload.single('bookImg')(req, res, (err) => {
                        if (err) {
                            reject(new Error("Multer error"));
                            return;
                        }
                        temp = req.body
                        data = unflatten.unflatObject(temp)
                        data.book?.description ? data.book.description = temp['book.description'] : 1
                        const { uploaderID, title } = req.body;
                        const imgLink = `/images/${req.file.filename}`;

                        console.log(req.file.path);
                        BookImage.create({ uploaderID, imgLink, title }, { transaction: t })
                            .then((image) => resolve(image))
                            .catch((error) => reject(error));
                    })
                })
                data.book.imageID = uploadedImage.id
            } else {
                data.book.imageID = data.image.select
            }
            data.book.baseCallNumber = createCallNumber(
                data.subjects[0] ?? data.subject,
                data.genres[0] ?? data.genres,
                data.authors[0] ?? data.authors,
                data.book.imageID
            )
            console.log(data.book)
            let book = await Book.create(data.book, { transaction: t })

            let authors = prepForBulk('author', data.authors, book.id)
            let genres = prepForBulk('genre', data.genres, book.id)
            let subjects = prepForBulk('subject', data.subjects, book.id)


            await AuthorList.bulkCreate(authors, { transaction: t })
            await GenreList.bulkCreate(genres, { transaction: t })
            await SubjectList.bulkCreate(subjects, { transaction: t })
            res.status(200).send({ message: "Book has been added successfully!" })

        })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}

exports.searchBooks = async (req, res) => {
    try {
        // Get the search query from the request body or query parameters
        const searchQuery = req.body.search


        // Build the where clause dynamically for each searchable field
        const whereClause = {
            deleted: false,
            [Op.or]: [
                { title: { [Op.like]: `%${searchQuery}%` } },
                { '$authors.firstName$': { [Op.like]: `%${searchQuery}%` } },
                { '$authors.lastName$': { [Op.like]: `%${searchQuery}%` } },
                { '$genres.name$': { [Op.like]: `%${searchQuery}%` } },
                { '$subjects.name$': { [Op.like]: `%${searchQuery}%` } },
                { '$publisher.name$': { [Op.like]: `%${searchQuery}%` } },
            ]
        };

        // Perform the Sequelize query with the dynamic where clause and include associations
        const result = await Book.findAll({
            where: whereClause,
            order: [
                ['title', 'ASC']
            ],
            include: [Author, Genre, Subject, Publisher, BookImage]
        })

        res.send(result)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
}
exports.findAllBooks = async (req, res) => {
    try {
        const result = await Book.findAll({
            where: { deleted: false },
            include: [Author, Genre, Subject, Publisher, BookImage],
            order: [
                ['isbn', 'ASC']
            ]
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
    console.log(data)
    try {
        const result = await db.sequelize.transaction(async (t) => {
            if (data === undefined) {
                const uploadedImage = await new Promise((resolve, reject) => {
                    upload.single('bookImg')(req, res, async (err) => {
                        if (err) {
                            reject(new Error("Multer error"));
                            return;
                        }
                        data = unflatten.unflatObject(req.body)
                        data.book?.description ? data.book.description = data.book.description[0] : 1
                        const { uploaderID, title } = req.body;
                        const imgLink = `/images/${req.file.filename}`;

                        console.log(req.file.path);
                        await BookImage.create({ uploaderID, imgLink, title }, { transaction: t })
                            .then((image) => resolve(image))
                            .catch((error) => reject(error));
                    })
                })
                data.book ? 1 : data.book = {}
                data.book.imageID = uploadedImage.id
            } else {
                data.book ? 1 : data.book = {}
                console.log(data.book)
                data.image ? data.book.imageID = data.image.select : 1

            }

            const bookID = data.id
            console.log(bookID)
            console.log(data.book)
            await Book.update(data.book, { where: { id: bookID }, transaction: t }) //INCOMPLETE should be separated from authors 

            data.authors ? await updateList(data.authors, 'authorID', AuthorList, bookID, t) : 1
            data.genres ? await updateList(data.genres, 'genreID', GenreList, bookID, t) : 1
            data.subjects ? await updateList(data.subjects, 'subjectID', SubjectList, bookID, t) : 1

            res.status(200).send("Book has been updated!")
        })
        console.log("yeah")

    } catch (error) {
        res.status(500).send("Error in updating book! " + error.message)
    }
}

// image handling
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')  // specify the directory for storing images
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

const prepForBulk = (name, array, bookID) => {
    !(array instanceof Array) ? array = [array] : 1
    return array.map((element) => {
        return { [`${name}ID`]: element, bookID: bookID }
    })
}

const createCallNumber = (subject, genre, author, imageID) => {
    return `${subject}-${genre}-${author}-${imageID}`
}


const updateList = async (data, modelName, dbModel, bookID, transaction) => {
    // Ensure data is an array
    data = Array.isArray(data) ? data : [data]

    console.log("updatelist + " + bookID)

    const models = await dbModel.findAll({ where: { bookID: bookID }, transaction: transaction })
    const removedModels = models.filter((elem) => !data.includes(elem[modelName]))
    const newModels = data
        .filter((modelID) => !removedModels.some((currModel) => currModel[modelName] === modelID))
        .map((modelID) => ({ [modelName]: modelID, bookID: bookID }))

    console.log("updatelist new")
    console.log("updatelist queries" + bookID)
    if (removedModels.length > 0) {
        await dbModel.destroy({ where: { [modelName]: removedModels.map((model) => model[modelName]) }, transaction: transaction })
    }
    if (newModels.length > 0) {
        await dbModel.bulkCreate(newModels, { validate: true, transaction: transaction })
    }
}

exports.subjectGraph = async (req, res) => {
    try {
        const topBorrowedSubjects = await db.sequelize.query(`
        SELECT
        DISTINCT
            s.name AS 'Subject',
            SUM(CASE WHEN ut.title = 'teacher' THEN 1 ELSE 0 END) AS 'Teachers',
            SUM(CASE WHEN ut.title = 'student' THEN 1 ELSE 0 END) AS 'Students'
        FROM subjects s
        JOIN subjectlists sl ON s.id = sl.subjectID
            JOIN books b ON b.id = sl.bookID
            JOIN tickets t ON b.id = t.bookID
                JOIN users u ON u.id = t.userID
                JOIN usertypes ut ON u.typeID = ut.id
        GROUP BY s.id, s.name
        ORDER BY Teachers DESC, Students DESC;
            `,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        // console.log('Top 10 Most Borrowed Subjects:', topBorrowedSubjects);
        res.send(topBorrowedSubjects)
    } catch (error) {
        res.status(500).send("Error fetching graph data", error)
        console.error('Error fetching data:', error);
    }
}

exports.monthlyTickets = async (req, res) => {
    try {
        const tickets = await db.sequelize.query(`
        SELECT MONTHNAME(createDate) as month, COUNT(*) as bookings 
        FROM tickets
        WHERE lendDate IS NOT NULL AND YEAR(createDate) = YEAR(CURRENT_DATE())
        GROUP BY month
        ORDER BY createDate ASC;
            `,
            { type: db.Sequelize.QueryTypes.SELECT }
        );

        // console.log('Top 10 Most Borrowed Subjects:', topBorrowedSubjects);
        res.status(200).send(tickets)
    } catch (error) {
        res.status(500).send("Error fetching graph data" + error)
        console.error('Error fetching data:', error);
    }
}

