// import React from 'react'

// function UpdatePasswordForm() {
//     return (
//         <div>
//             <StatusHandler subject={"User"} code={formStatus} dismiss={setFormStatus} />
//             <form onSubmit={handleSubmit(signupUser)} className="flex max-w-md flex-col gap-4" noValidate>
//                 <div>
//                     <div className="mb-2 block">
//                         <Label htmlFor="password2" value="Your password" />
//                     </div>
//                     <TextInput id="password2" type="password" {...register('password', {
//                         required: emptyMsg('password'),
//                         minLength: {
//                             value: minPassLen,
//                             message: belowMinChar('Password', minPassLen),
//                         },
//                         validate: {
//                             format: val => validator.isStrongPassword(val, { returnScore: true }) > 30 || "Password needs 1 of each: uppercase, lowercase, symbol"
//                         }
//                     })} required shadow />
//                     <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.password?.message}</p>
//                 </div>
//                 <div>
//                     <div className="mb-2 block">
//                         <Label htmlFor="repeat-password" value="Repeat password" />
//                     </div>
//                     <TextInput id="repeat-password" type="password" {...register('rePass', {
//                         required: "You need to retype password",
//                         validate: {
//                             unmatching: val => validator.equals(val, watch('password')) || passNotMatch()
//                         }
//                     })} required shadow />
//                     <p className='"mt-2 text-sm text-red-600 dark:text-red-500"'>{errors.rePass?.message}</p>
//                 </div>
//                 <Button type="submit">Reset Password</Button>
//             </form >
//             <DevTool control={control} />
//         </div >
//     )
// }

// export default UpdatePasswordForm