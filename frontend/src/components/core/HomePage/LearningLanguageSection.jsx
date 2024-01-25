import HighlightText from './HighlightText'
import KnowYourProgress from '../../../assets/Images/Know_your_progress.png'
import CompareWithOthers from '../../../assets/Images/Compare_with_others.png'
import PlanYourLesson from '../../../assets/Images/Plan_your_lessons.png'
import CTAButton from '../HomePage/Button'

const LearningLanguageSection = () => {
  return (

        <>
            <div className='text-4xl font-semibold text-center my-10'>

                <div>
                    Your Swiss Knife for
                    <HighlightText text={' learning any language'} />
                </div>

                <p className="text-center text-richblack-700 font-medium lg:w-[75%] mx-auto leading-6 text-base mt-3"> Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more. </p>

                <div className="flex flex-col lg:flex-row items-center justify-center mt-8 lg:mt-0">
                    <img src={KnowYourProgress} alt="KNowYourProgressImage" className='object-contain lg:-mr-32' />
                    <img src={CompareWithOthers} alt="KNowYourProgressImage" className='object-contain lg:-mb-10 lg:-mt-0 -mt-12' />
                    <img src={PlanYourLesson} alt="KNowYourProgressImage" className='object-contain lg:-ml-36 lg:-mt-5 -mt-16' />
                </div>
            </div>

            <div className="w-fit mx-auto lg:mb-20 mb-8 -mt-5">
                <CTAButton active={true} linkto={'/signup'}> Learn more </CTAButton>
            </div>

        </>

  )
}

export default LearningLanguageSection
