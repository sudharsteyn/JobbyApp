import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'
import {HiOutlineExternalLink} from 'react-icons/hi'

import Header from '../Header'
import SimilarJob from '../SimilarJob'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetail extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobItemDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skills: data.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          imageUrl: eachSkill.image_url,
        })),
      }
      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobItemDetails: updatedJobItemDetails,
        similarJobs: updatedSimilarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemDetails = () => {
    const {jobItemDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      companyWebsiteUrl,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobItemDetails
    return (
      <div>
        <div className="job-item-detail-container">
          <div className="company-and-role-container">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
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
          <div className="description-and-company-site">
            <h1 className="job-description-heading">Description</h1>
            <a className="company-site-link" href={companyWebsiteUrl}>
              <p className="visit-text">Visit</p>
              <HiOutlineExternalLink className="external-link-icon" />
            </a>
          </div>
          <p className="job-description">{jobDescription}</p>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-item-list">
            {skills.map(eachSkill => (
              <li className="skills-item" key={eachSkill.name}>
                <img
                  className="skill-img"
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <div className="company-life-container">
            <div>
              <h1 className="life-at-company-heading">Life at Company</h1>
              <p className="company-life-description">
                {lifeAtCompany.description}
              </p>
            </div>
            <img
              className="company-life-img"
              src={lifeAtCompany.imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-job-item-list">
          {similarJobs.map(eachJob => (
            <SimilarJob key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="job-item-failure-container">
      <img
        className="job-details-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-describe">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        onClick={this.getJobItemDetails}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderLoading = () => (
    <div className="job-item-details-loading-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderApiStatus()}
        </div>
      </>
    )
  }
}

export default JobItemDetail
