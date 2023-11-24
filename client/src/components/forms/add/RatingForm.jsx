"use client";

import axios from 'axios'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'flowbite-react'
import StatusHandler from '../../misc/StatusHandler'

RatingForm.propTypes = {
    bookID: PropTypes.number.isRequired,
    userID: PropTypes.number,
}
function RatingForm({ bookID, userID }) {
    const [formStatus, setFormStatus] = useState(0);
    const postRating = async (rate) => {
        try {
            await axios.post("/api/ratings/create", { userID, bookID, rating: rate })
            setFormStatus(200)
        } catch (error) {
            setFormStatus(500)
        }
    };

    return (
        <div className='flex flex-row gap-2'>
            <StatusHandler subject={"Rating"} code={formStatus} dismiss={setFormStatus} />
            <Button onClick={() => postRating('like')}>Like</Button>
            <Button onClick={() => postRating('dislike')}>Dislike</Button>

        </div>
    );
}

export default RatingForm;