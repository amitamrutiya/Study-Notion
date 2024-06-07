import frameImg from "../../../assets/Images/frame.png"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import PropTypes from "prop-types"

function Template({ title, description1, description2, image, formType }) {
  // let { loading } = useSelector((state) => state.auth);
  const loading = false

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading
        ? (
          <div className="spinner"></div>
        )
        : (
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col-reverse justify-between gap-y-12 py-12 md:flex-row md:gap-y-0 md:gap-x-12">
            <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
              <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                {" "}
                {title}{" "}
              </h1>
              <p className="mt-4 text-[1.125rem] leading-[1.625rem]">
                <span className="text-richblack-100">{description1}</span>{" "}
                <span className="font-edu-sa font-bold italic text-blue-100">
                  {" "}
                  {description2}{" "}
                </span>
              </p>

              {formType === "signup" ? <SignupForm /> : <LoginForm />}
            </div>
            <div className="flex flex-col space-y-10">
              <div className="border-2 border-white bg-blue-500 bg-opacity-50 rounded-lg shadow-lg p-4 text-white max-w-[450px] mx-auto ">
                <h1 className="text-2xl font-bold mb-4">Sample Account</h1>
                <div className="flex sm:flex-row flex-col sm:space-x-4 space-y-2"> <div className="mb-2">
                  <h3 className="text-xl font-semibold">Student:</h3>
                  <p className="text-sm">Email: amensister007@gmail.com</p>
                  <p className="text-sm">Password: password</p>
                </div>
                  <div>
                    <h3 className="text-xl font-semibold">Instructor:</h3>
                    <p className="text-sm">Email: flutterwithfun@gmail.com</p>
                    <p className="text-sm">Password: password</p>
                  </div>
                </div></div>

              <div className="relative mx-auto w-11/12 max-w-[450px] md:mx-0">
                <img
                  src={frameImg}
                  alt="Pattern"
                  width={558}
                  height={504}
                  loading="lazy"
                />{" "}
                {/* image of bg-cart */}
                <img
                  src={image}
                  alt="Students"
                  width={558}
                  height={490}
                  loading="lazy"
                  className="absolute -top-4 right-4 z-10"
                />{" "}
                {/* image of girl */}
              </div>
            </div>

          </div>
        )}
    </div>
  )
}

Template.propTypes = {
  title: PropTypes.string,
  description1: PropTypes.string,
  description2: PropTypes.string,
  image: PropTypes.string,
  formType: PropTypes.string,
}

export default Template
