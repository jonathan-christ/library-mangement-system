const timeConst = {
    secToMilli: 1000,
    minToSec: 60,
    hourToMin: 60,
    dayToHour: 24
}

const { secToMilli, minToSec, hourToMin, dayToHour } = timeConst

exports.convertMilliTo = (milli, timeType) => {
    const lowerTimeType = timeType.toLowerCase();

    switch (lowerTimeType) {
        case 'day':
            return milli / (timeConst.secToMilli * timeConst.minToSec * timeConst.hourToMin * timeConst.dayToHour);
        case 'hour':
            return milli / (timeConst.secToMilli * timeConst.minToSec * timeConst.hourToMin);
        case 'min':
            return milli / (timeConst.secToMilli * timeConst.minToSec);
        case 'sec':
            return milli / timeConst.secToMilli;
        default:
            throw new Error(`Invalid timeType: ${timeType}`);
    }
}

exports.dateDiff = (startDate, endDate) => {
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    return endDate < startDate ? 0 : endDate - startDate
}