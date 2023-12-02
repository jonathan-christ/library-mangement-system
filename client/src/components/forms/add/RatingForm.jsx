"use client";

import axios from 'axios'
import PropTypes from 'prop-types'

import { useState, useEffect, useCallback } from 'react'
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import { Button } from 'flowbite-react'

import { toast } from 'react-toastify'

const RatingForm = ({ bookID, userID }) => {
    const [ratings, setRatings] = useState({})
    const [userRating, setUserRating] = useState(null)


    const fetchRatings = useCallback(async () => {
        axios.post(`/api/ratings/find`, { bookID: bookID })
            .then((res) => {
                setRatings(res.data)
            }).catch((err) => {
                toast.error('Unable to retrieve ratings! Server error')
                console.error('Error fetching ratings:', err.message)

            })
    }, [bookID])

    const fetchUserRating = useCallback(async () => {
        axios.post(`/api/ratings/find/user`, { bookID: bookID, userID: userID })
            .then((res) => {
                let data = res.data.rating
                setUserRating(data === 'like' ? "Like" : data === 'dislike' ? "Dislike" : null)
            })
            .catch((error) => {
                toast.error('Unable to retrieve ratings! Server error')
                console.error('Error fetching user rating:', error)
            })
    }, [bookID, userID])

    useEffect(() => {
        fetchRatings()
        fetchUserRating()
    }, [fetchRatings, fetchUserRating])

    const handleRatingSubmit = async (rating) => {
        try {
            if (userRating === null) {
                await axios.post('/api/ratings/create', { userID: userID, bookID: bookID, rating: rating })
            } else {
                await axios.put('/api/ratings/update', { userID: userID, bookID: bookID, rating: rating })
            }
            fetchRatings()
            fetchUserRating()
        } catch (error) {
            toast.error('Unable to submit ratings! Server error')
            console.error('Error submitting rating:', error)
        }
    }

    const percent = !ratings.count ? -1 : (100 * ratings.score) / ratings.count
    const percentToLabel = (percent) => {
        if (percent === -1) return <span className='text-gray-600'>No reviews</span>
        else if (percent < 20) return <span className='text-red-600'>Heavily Disliked</span>
        else if (percent < 45) return <span className='text-red-800'>Disliked</span>
        else if (percent < 60) return <span className='text-yellow-400'>Mixed</span>
        else if (percent < 90) return <span className='text-blue-800'>Liked</span>
        else return <span className='text-blue-600'>Heavily Liked</span>;
    }

    return (
        <div>
            <h2><strong>Book Ratings</strong></h2>
            <div>
                <span>
                    {percentToLabel(percent)} ({ratings.count || 0} review{ratings.count != 1 ? 's' : ''})
                </span>
            </div>
            <div className={userID ? '' : 'hidden'}>
                <div>
                    <strong>Your Rating:</strong> {userRating ? userRating : 'No rating'}
                </div>
                <Button.Group>
                    <Button color='gray' onClick={() => handleRatingSubmit('like')} disabled={userRating === 'Like' ? true : null}>
                        <BiSolidLike size={25} />
                    </Button>
                    <Button color='gray' onClick={() => handleRatingSubmit('dislike')} disabled={userRating === 'Dislike' ? true : null}>
                        <BiSolidDislike size={25} />
                    </Button>
                </Button.Group>
            </div>
        </div>
    )
}

RatingForm.propTypes = {
    bookID: PropTypes.number.isRequired,
    userID: PropTypes.number,
}

export default RatingForm