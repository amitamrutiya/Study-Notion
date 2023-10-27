import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div className="relative mx-auto flex flex-col w-11/12 items-center text-white justify-between ">
        <Link to={"/signup"}>
          <div className="group mt-16 p-1 mx-auto rounded-full bg-richblue-800 font-semibold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblue-900 ">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
      </div>
      {/* Section 2 */}

      {/* Section 3 */}

      {/* Section 4 */}
    </div>
  );
}

export default Home;
