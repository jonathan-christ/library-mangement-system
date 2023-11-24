import axios from 'axios'
import { useState, useEffect } from 'react'

import PropTypes from 'prop-types'
import RatingForm from '../add/RatingForm'
import StatusHandler from '../../misc/StatusHandler'

BookRating.propTypes = {
    bookID: PropTypes.number.isRequired,
    userID: PropTypes.number,
};
function BookRating({ userID, bookID }) {
    const [formStatus, setFormStatus] = useState(0)
    const [rating, setRating] = useState({ score: 0, count: 0 })
    const [userHasRated, setUserHasRated] = useState(false);

    const percent = rating.count === 0 ? -1 : (100 * rating.score) / rating.count

    const percentToLabel = (percent) => {
        if (percent === -1) return 'No reviews'
        else if (percent < 20) return 'Heavily Disliked'
        else if (percent < 45) return 'Disliked'
        else if (percent < 60) return 'Mixed'
        else if (percent < 90) return 'Liked'
        else return 'Heavily Liked';
    };

    useEffect(() => {
        getRating()
        getUserRating()
    }, []);

    const getRating = async () => {
        try {
            const res = await axios.post("/api/ratings/find", { bookID })
            setRating(res.data || { score: 0, count: 0 })
        } catch (error) {
            console.error(error)
            setFormStatus(500)
        }
    };

    const getUserRating = async () => {
        try {
            const res = await axios.post("/api/ratings/find/user", { bookID, userID })
            res.data.rating ? setUserHasRated(true) : ''
        } catch (error) {
            setFormStatus(500)
        }
    }
    return (
        <div className='rating'>
            <StatusHandler subject={"Rating"} code={formStatus} dismiss={setFormStatus} />
            {`${percentToLabel(percent)} (${rating.count})`}
            {(userID && !userHasRated) &&
                <RatingForm userID={userID} bookID={bookID} />
            }
        </div>
    )
}

export default BookRating