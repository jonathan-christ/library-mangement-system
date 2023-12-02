const reservedRemind = (title) => {
    return `A copy of "${title}" has been reserved for you. You have 1 day to claim this book in the library`
}

const returnRemind = (days, title) => {
    return `You have around ${days} day${days>1 ? 's' : ''} left to return your borrowed book titled "${title}"`
}

const closeReport = (title) => {
    return `Your reservation for "${title}" has expired, the ticket has been closed.`
}

const overdueReport = (title) => {
    return `Your return date for the book "${title}" is now overdue, please return as charges have now been applied.`
}

const cancelReport = (title) => {
    return `Your ticket for the book ${title} has been cancelled`
}

const borrowReport = (title, days) => {
    return `Your have borrowed the book ${title}, you have 14 days until the due return date`
}


module.exports = {
    reservedRemind,
    returnRemind,
    closeReport,
    overdueReport,
    cancelReport,
    borrowReport
}