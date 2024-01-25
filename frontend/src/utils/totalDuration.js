function convertSecondsToDuration (totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor((totalSeconds % 3600) % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

export function GetCourseTotalDuration (course) {
  let totalDurationInSeconds = 0
  let totalDuration
  for (let j = 0; j < course.courseContent.length; j++) {
    totalDurationInSeconds += course.courseContent[j].subSections.reduce(
      (acc, curr) => acc + parseInt(curr.timeDuration),
      0
    )
    totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  }
  if (totalDuration) return totalDuration
  else return '0s'
}
