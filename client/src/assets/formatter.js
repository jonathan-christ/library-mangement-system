const dateFormat = (date) => {
    date = new Date(date)
    return date.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    })
}

const dateSplicer = (dateString, format) => {
    const date = new Date(dateString);

    switch (format.toLowerCase()) {
        case 'year':
            return date.getFullYear().toString()
        case 'month':
            return (date.getMonth() + 1).toString()
        case 'day':
            return date.getDate().toString()
        case 'hour':
            return date.getHours().toString()
        case 'minute':
            return date.getMinutes().toString()
        case 'second':
            return date.getSeconds().toString()
        default:
            throw new Error(`Unsupported date format: ${format}`)
    }
}


export { dateFormat, dateSplicer }