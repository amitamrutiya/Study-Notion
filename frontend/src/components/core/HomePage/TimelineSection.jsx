import Logo1 from '../../../assets/TimeLineLogo/Logo1.svg'
import Logo2 from '../../../assets/TimeLineLogo/Logo2.svg'
import Logo3 from '../../../assets/TimeLineLogo/Logo3.svg'
import Logo4 from '../../../assets/TimeLineLogo/Logo4.svg'
import timelineImage from '../../../assets/Images/TimelineImage.png'

const timeline = [
  {
    Logo: Logo1,
    heading: 'Leadership',
    Description: 'Fully committed to the success of the company',
    date: 'January 2010 - December 2012',
  },
  {
    Logo: Logo2,
    heading: 'Product Launch',
    Description: 'Launched new product line and increased revenue by 50%',
    date: 'March 2013 - February 2014',
  },
  {
    Logo: Logo3,
    heading: 'Expansion',
    Description: 'Expanded new fields and increased customer base by 75%',
    date: 'June 2014 - May 2016',
  },
  {
    Logo: Logo4,
    heading: 'Acquisition',
    Description: 'Acquired competitor and became market leader in the industry',
    date: 'September 2016 - Present',
  },
]

const TimelineSection = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-20 mb-20 items-center">
        <div className="lg:w-[45%] flex flex-col gap-14 lg:gap-3">
          {timeline.map((element, index) => {
            return (
              <div className="flex flex-col lg:gap-3 " key={index}>
                <div className="flex gap-6" key={index}>
                  <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000071] shadow-[0_0_62px_0]">
                    <img src={element.Logo} alt="" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[18px]">
                      {element.heading}
                    </h2>
                    <p className="text-base">{element.Description}</p>
                    <p className="text-sm text-pure-greys-400 font-mono">
                      {element.date}
                    </p>
                  </div>
                </div>

                <div
                  className={`hidden ${
                    timeline.length - 1 === index ? 'hidden' : 'lg:block'
                  }  h-[5rem] border-dotted border-r border-richblack-100 bg-richblack-400/0 w-[26px] `}
                >
                  {' '}
                </div>
              </div>
            )
          })}
        </div>

        <div className="relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]">
          <img
            src={timelineImage}
            alt="timelineImage"
            className="shadow-white shadow-[20px_20px_0px_0px] object-cover h-[400px] lg:h-fit"
          />

          <div className="absolute md:left-[7%] lg:left-[50%] lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex sm: flex-row  text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10 flex-wrap">
            <div className="flex gap-5 items-center  border-caribbeangreen-300 px-7 lg:px-14 mb-4">
              <p className="text-3xl font-bold w-[75px]"> 10 </p>
              <p className="text-caribbeangreen-300 text-sm w-[75px]">
                {' '}
                Years of Experience{' '}
              </p>
            </div>

            <div className="flex gap-5 items-center lg:px-14 px-7">
              <p className="text-3xl font-bold w-[75px]"> 250 </p>
              <p className="text-caribbeangreen-300 text-sm w-[75px]">
                {' '}
                Type of Courses{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelineSection
