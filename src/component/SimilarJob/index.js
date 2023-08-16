import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJob = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    jobDescription,
    location,
    employmentType,
  } = jobDetails
  return (
    <li className="similar-job-item">
      <div className="company-and-role-container">
        <img
          className="company-logo"
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="company-and-rating-container">
          <h1 className="company-title">{title}</h1>
          <div className="rating-container">
            <AiFillStar color="#fbbf24" size="20" />
            <p className="company-rating">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="job-description-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>
      <div className="location-and-type-container">
        <MdLocationOn color="#ffffff" size="20" />
        <p className="job-location-and-type">{location}</p>
        <BsBriefcaseFill color="#ffffff" size="20" />
        <p className="job-location-and-type">{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJob
