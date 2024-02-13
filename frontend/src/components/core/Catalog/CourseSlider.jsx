import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import CourseCard from "./CourseCard"
import PropTypes from "prop-types"

const CourseSlider = ({ Courses }) => {
  return (
    <>
      {Courses?.length
        ? (
          <Swiper
            slidesPerView={1}
            spaceBetween={25}
            loop={true}
            breakpoints={{ 1024: { slidesPerView: 3 } }}
            className="max-h-[30rem]"
          >
            {Courses?.map((course, i) => (
              <SwiperSlide key={i}>
                <CourseCard course={course} Height={"h-[250px]"} />
              </SwiperSlide>
            ))}
          </Swiper>
          )
        : (
          <p className="text-xl text-richblack-5">No Course Found</p>
          )}
    </>
  )
}

CourseSlider.propTypes = {
  Courses: PropTypes.array.isRequired,
}

export default CourseSlider
