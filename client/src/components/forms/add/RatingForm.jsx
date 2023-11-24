// import React from 'react'
// import axios from 'axios';
// import ls from 'localstorage-slim'

// import { Rating } from 'flowbite-react'
// import { useState, useEffect } from 'react'
// import { Link, useNavigate } from 'react-router-dom';
// import { useForm } from 'react-hook-form'
// import StatusHandler from '../../misc/StatusHandler';

// function RatingForm({ bookID, userID }) {
//     const [formStatus, setFormStatus] = useState(0)
//     const [userRating, setUserRating] = useState(0)
//     const [revCount, setRevCount] = useState(0)
//     const [rating, setRating] = useState(0)
//     const numbersArray = [1, 2, 3, 4, 5]
//     const {
//         register,
//         handleSubmit,
//         watch,
//         reset,
//         formState: { errors }
//     } = useForm()

//     useEffect(() => {
//         getRating()
//         if (!userID) getUserRating()
//     }, [])

//     const getRating = () => {
//         axios.post("/api/ratings/find", { bookID: bookID })
//             .then(res => {
//                 let data = res.data
//             }).catch(() => {
//                 set
//             })
//     }

//     const getUserRating = () => {
//         axios.post("/api/ratings/find/user", { bookID: bookID, userID: userID })
//             .then(res => {
//                 let data = res.data
//                 setRating(data.status === 'found' ? data.data.value : 0)
//             })
//     }

//     const postRating = (data) => {
//         axios.post("/api/ratings/create", { userID: userID, bookID: bookID, value: data.value })
//             .then(() => {
//                 getUserRating()
//             })
//     }

//     return (
//         <>
//             <StatusHandler subject={"Book"} code={formStatus} dismiss={setFormStatus} />
//             <form onSubmit={handleSubmit(postRating)}>
//                 <Rating size={"md"} className="justify-center">
//                     <ul className='flex flex-row'>
//                         {numbersArray.map((num) => {
//                             return (
//                                 <li key={num}>
//                                     <div>
//                                         <input id={"star" + num} type="radio" value={num} {...register('star')} className="invisible" checked={rating === num ? true : undefined} />
//                                         <label htmlFor={"star" + num}><Rating.Star filled={userRating < num ? null : true} /></label>
//                                     </div>
//                                 </li>
//                             )
//                         })}
//                         <li>
//                             {userRating === 0}
//                         </li>
//                     </ul>
//                 </Rating>
//             </form>
//         </>
//     )
// }

// export default RatingForm