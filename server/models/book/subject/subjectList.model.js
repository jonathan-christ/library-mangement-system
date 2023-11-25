module.exports = (sequelize, Sequelize) => {
    // id, fname, lname, bio
    const SubjectList = sequelize.define("subjectList", {
        bookID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "book",
                key: "id"
            }
        },
        subjectID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "subject",
                key: "id"
            }
        },
    })

    return SubjectList
}