import { GiBurningBook } from "react-icons/gi";

function LoadingAnimation() {
    return (
        <div className='flex h-full animate-pulse w-full text-primary-800 justify-center'>
            <GiBurningBook size={500}/>
        </div>
    )
}

export default LoadingAnimation