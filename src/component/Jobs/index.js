import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const jwtToken = Cookies.get('jwt_token')
const options = {
  headers: {
    Authorization: `Bearer ${jwtToken}`,
  },
  method: 'GET',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobDetails: [],
    jobDetailsApiStatus: apiStatusConstants.initial,
    typeOfEmployment: [],
    salaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedProfileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails: updatedProfileDetails,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {typeOfEmployment, salaryRange, searchInput} = this.state
    const employmentType = typeOfEmployment.join(',')
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${salaryRange}&search=${searchInput}`
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedJobDetails = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        jobDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchText = event => {
    if (event.key === 'Enter') {
      this.getJobsDetails()
    }
  }

  changeEmploymentType = event => {
    const {typeOfEmployment} = this.state
    if (event.target.checked) {
      this.setState(
        prevState => ({
          typeOfEmployment: [...prevState.typeOfEmployment, event.target.value],
        }),
        this.getJobsDetails,
      )
    } else {
      const filteredEmploymentType = typeOfEmployment.filter(
        employmentType => employmentType !== event.target.value,
      )
      this.setState(
        {typeOfEmployment: filteredEmploymentType},
        this.getJobsDetails,
      )
    }
  }

  changeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsDetails)
  }

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    return (
      <div className="profile-container">
        <img
          className="profile-pic"
          src={profileDetails.profileImageUrl}
          alt="profile"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="short-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderProfileFailure = () => (
    <div className="profile-failure">
      <button
        onClick={this.getProfileDetails}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileLoading = () => (
    <div className="profile-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileApiStatus = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetails()
      case apiStatusConstants.failure:
        return this.renderProfileFailure()
      case apiStatusConstants.inProgress:
        return this.renderProfileLoading()
      default:
        return null
    }
  }

  renderJobDetails = () => {
    const {jobDetails} = this.state
    return (
      <>
        {jobDetails.length > 0 ? (
          <ul className="job-details-item-list">
            {jobDetails.map(eachJob => (
              <JobCard key={eachJob.id} jobDetails={eachJob} />
            ))}
          </ul>
        ) : (
          <div className="no-jobs-found-container">
            <img
              className="no-job-img"
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1 className="no-jobs-heading">No Jobs Found</h1>
            <p className="no-jobs-describe">
              We could not find any jobs. Try Other filters.
            </p>
          </div>
        )}
      </>
    )
  }

  renderJobDetailsFailure = () => (
    <div className="job-details-failure-container">
      <img
        className="job-details-failure-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-describe">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={this.getJobsDetails} className="retry-btn" type="button">
        Retry
      </button>
    </div>
  )

  renderJobDetailsLoading = () => (
    <div className="job-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobApiStatus = () => {
    const {jobDetailsApiStatus} = this.state

    switch (jobDetailsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetails()
      case apiStatusConstants.failure:
        return this.renderJobDetailsFailure()
      case apiStatusConstants.inProgress:
        return this.renderJobDetailsLoading()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filter-container">
            <div className="search-container">
              <input
                onChange={this.changeSearchInput}
                onKeyDown={this.searchText}
                className="search-input"
                type="search"
                placeholder="Search"
                value={searchInput}
              />
              <button
                onClick={this.getJobsDetails}
                data-testid="searchButton"
                className="search-btn"
                type="button"
              >
                <BsSearch color="#f8fafc" size="15" />
              </button>
            </div>
            {this.renderProfileApiStatus()}
            <hr />
            <div>
              <h1 className="filter-heading">Type of Employment</h1>
              <ul className="filter-type-list">
                {employmentTypesList.map(eachType => (
                  <li className="filter-item" key={eachType.employmentTypeId}>
                    <input
                      onChange={this.changeEmploymentType}
                      id={eachType.employmentTypeId}
                      type="checkbox"
                      value={eachType.employmentTypeId}
                    />
                    <label
                      className="filter-type-label"
                      htmlFor={eachType.employmentTypeId}
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h1 className="filter-heading">Salary Range</h1>
              <ul className="filter-type-list">
                {salaryRangesList.map(eachSalary => (
                  <li className="filter-item" key={eachSalary.salaryRangeId}>
                    <input
                      onChange={this.changeSalaryRange}
                      id={eachSalary.salaryRangeId}
                      type="radio"
                      name="salary"
                      value={eachSalary.salaryRangeId}
                    />
                    <label
                      className="filter-type-label"
                      htmlFor={eachSalary.salaryRangeId}
                    >
                      {eachSalary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="job-details-container">
            <div className="search-container-large">
              <input
                onChange={this.changeSearchInput}
                onKeyDown={this.searchText}
                className="search-input"
                type="search"
                placeholder="Search"
                value={searchInput}
              />
              <button
                onClick={this.getJobsDetails}
                data-testid="searchButton"
                className="search-btn"
                type="button"
              >
                <BsSearch color="#f8fafc" size="15" />
              </button>
            </div>
            {this.renderJobApiStatus()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
