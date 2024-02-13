import { useEffect, useState } from "react"
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"
import PropTypes from "prop-types"

function RatingStars ({ ReviewCount, StarSize }) {
  const [starCount, SetStarCount] = useState({
    full: 0,
    half: 0,
    empty: 0,
  })

  useEffect(() => {
    const wholeStars = Math.floor(ReviewCount) || 0
    SetStarCount({
      full: wholeStars,
      half: Number.isInteger(ReviewCount) ? 0 : 1,
      empty: Number.isInteger(ReviewCount) ? 5 - wholeStars : 4 - wholeStars,
    })
  }, [ReviewCount])

  return (
    <div className="flex gap-1 text-yellow-100">
      {[...new Array(starCount.full)].map((_, i) => {
        return <TiStarFullOutline key={i} size={StarSize || 20} />
      })}
      {[...new Array(starCount.half)].map((_, i) => {
        return <TiStarHalfOutline key={i} size={StarSize || 20} />
      })}
      {[...new Array(starCount.empty)].map((_, i) => {
        return <TiStarOutline key={i} size={StarSize || 20} />
      })}
    </div>
  )
}

RatingStars.propTypes = {
  ReviewCount: PropTypes.number.isRequired,
  StarSize: PropTypes.number,
}

export default RatingStars
