export const hourtoMins = 60
export const minToSecs = 60
export const secToMilli = 10000
export const ttl = hourtoMins*minToSecs//seconds
export const ttlCheck = minToSecs * secToMilli

export const maxNameLen = 50
export const minPassLen = 8
export const maxSuffixLen = 15

export const maxISBNLen = 13
export const minISBNLen = 11
export const maxBookLen = 255

export const imageProxy = 'http://localhost:5000'
export const supportedImageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg', 'webp']