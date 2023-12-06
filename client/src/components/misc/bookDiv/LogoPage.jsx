import PropTypes from "prop-types"
import Logo from '../../../assets/pshs-logo.png'

function LogoPage({lines}) {

    return (
        <div className="w-full h-full bg-secondary-50 rounded-l-lg rounded-r-3xl shadow-md overflow-hidden p-10">
            <div className='hidden md:flex w-full  flex-row justify-start gap-10'>
                <img
                    src={Logo}
                    alt="Book cover"
                    className="w-full flex-shrink-0 md:w-1/3 object-contain static"
                />
                <div className='flex flex-col w-2/3 gap-10'>
                    <div className='w-full bg-text-200 h-2 rounded-md' />
                    <div className='w-full bg-text-200 h-2 rounded-md' />
                    <div className='w-full bg-text-200 h-2 rounded-md' />
                    <div className='w-full bg-text-200 h-2 rounded-md' />
                    <div className='w-full bg-text-200 h-2 rounded-md' />
                </div>
            </div>
            <div className='flex flex-col gap-10 mt-10 justify-center'>
                {generateDivs(lines)}
            </div>
        </div>
    )
}

LogoPage.propTypes = {
  lines: PropTypes.any
}

function generateDivs(count) {
    // Array to hold the generated divs
    const divs = [];

    // Loop to generate divs based on the count
    for (let i = 0; i < count; i++) {
        divs.push(
            <div key={i} className='w-full bg-text-200 h-2 rounded-md' />
        );
    }

    return divs;
}

export default LogoPage