import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Home() {
  return (
    <div>
      {/* Section 1 */}
      <div>
        <Link to={"/signup"}>
          <div>
            <div>
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
