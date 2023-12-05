import PropTypes from "prop-types"
import { HiOutlineSearch } from "react-icons/hi";
import { useForm } from 'react-hook-form'
import { TextInput } from "flowbite-react"
import axios from "axios";
import { toast } from "react-toastify";

function SearchBar({ resultStore }) {
    //submit through drill
    //standalone search
    const {
        register,
        handleSubmit,
    } = useForm({ mode: 'onTouched' })

    //title, publisher, publishDate, authorName, genreName, subjectName

    const search = async (data) => {
        console.log(data.search)

        await axios.post("/api/library/books/search", { search: data.search })
            .then((res) => {
                resultStore(res.data)
            }).catch((err) => {
                console.log(err)
                toast.error('Unable to perform query! Server error')
            })
    }

    return (
        <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit(search)}>
                <div className="relative ">
                    <TextInput {...register('search')} placeholder={"Enter any search terms"} theme={{focus: {true: ''}}}/>
                    <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-primary-500 rounded-e-lg border border-primary-500 hover:bg-blue-80">
                        <HiOutlineSearch size={20} />
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

SearchBar.propTypes = {
    resultStore: PropTypes.func
}

export default SearchBar