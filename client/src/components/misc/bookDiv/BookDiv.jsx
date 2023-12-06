import PropTypes from "prop-types"

function BookDiv({ leftChild, rightChild }) {
  return (
    <div className="flex flex-row h-max w-max md:w-max lg:w-5/6 justify-center">
      {renderLeftLeaf(leftChild)}
      {renderRightLeaf(rightChild)}
    </div>
  )
}

function renderLeftLeaf(leftChild) {
  return (
    <div className="flex w-1/2 bg-secondary-400 rounded-l-lg rounded-r-3xl shadow-md overflow-hidden py-5 md:pl-4 sm:rounded-l-x3l sm:rounded-r-x3l">
      <div className="w-full h-full bg-secondary-200 rounded-l-lg rounded-r-3xl shadow-md overflow-hidden py-0 md:pl-2">
        <div className="w-full h-full bg-secondary-100 rounded-l-lg rounded-r-3xl shadow-md overflow-hidden py-0 md:pl-2">
          {leftChild}
        </div>
      </div>
    </div>
  )
}

function renderRightLeaf(rightChild) {
  return (
    <div className="flex md:w-1/2 min-w-[500px] bg-secondary-400 rounded-r-lg rounded-l-3xl shadow-md overflow-hidden py-5 pr-4">
      <div className="w-full h-full bg-secondary-200 rounded-r-lg rounded-l-3xl shadow-md overflow-hidden py-0 pr-2">
        <div className="w-full h-full bg-secondary-100 rounded-r-lg rounded-l-3xl shadow-md overflow-hidden py-0 pr-2">
          {rightChild}
        </div>
      </div>
    </div>
  )
}

BookDiv.propTypes = {
  leftChild: PropTypes.any,
  rightChild: PropTypes.any,
}

export default BookDiv