import {Component} from 'react'
import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

class JobCard extends Component {
  render() {
    const {jobDetails} = this.props
    const {
      id,
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
    } = jobDetails
    return (
      <li className="job-item">
        <Link className="job-link" to={`/jobs/${id}`}>
          <div className="company-and-role-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="company logo"
            />
            <div className="company-and-rating-container">
              <h1 className="company-title">{title}</h1>
              <div className="rating-container">
                <AiFillStar color="#fbbf24" size="20" />
                <p className="company-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-type-package-container">
            <div className="location-and-type-container">
              <MdLocationOn color="#ffffff" size="20" />
              <p className="job-location-and-type">{location}</p>
              <BsBriefcaseFill color="#ffffff" size="20" />
              <p className="job-location-and-type">{employmentType}</p>
            </div>
            <div>
              <p className="package-per-annum">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="separate-line" />
          <h1 className="job-description-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </Link>
      </li>
    )
  }
}

export default JobCard
