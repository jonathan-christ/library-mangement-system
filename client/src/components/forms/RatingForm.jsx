import React from 'react'
import axios from 'axios';
import ls from 'localstorage-slim'

import { Rating } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { emptyMsg } from '../../assets/formErrorMsg';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';

function RatingForm({ bookID, userID }) {
    const [rating, setRating] = useState()
    const numbersArray = Array.from({ length: 5 }, (_, index) => index + 1)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm()

    useEffect(() => {
        getRating()
    }, [])

    const getRating = () => {
        axios.get("/api/rating/find/indiv", { bookID: bookID, userID: userID })
            .then(res => {
                console.log(data)
                let data = res.data
                setRating(data.status === 'found' ? data.data.value : 0)
            })
    }

    const postRating = (data) => {
        axios.post("/api/rating/create", { userID: userID, bookID: bookID, value: data.value })
            .then(() => {
                getRating()
            })
    }

    return (
        <form onSubmit={handleSubmit(postRating)} className="flex max-w-md flex-col gap-4">
            <Rating>
                <ul>
                    {numbersArray.map((num) => {
                        let filled = rating <= num
                        return (
                            <li key={num}>
                                <div className="flex items-center ps-3">
                                    <input id={"star" + num} type="radio" value={num} {...register('star')} className="invisible" checked={rating === num ? true : undefined} />
                                    <label htmlFor={"star" + num}><Rating.Star filled={filled} /></label>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </Rating>
        </form>
    )
}

export default RatingForm