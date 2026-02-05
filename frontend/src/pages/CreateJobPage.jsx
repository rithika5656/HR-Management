import JobForm from '../components/JobForm'

function CreateJobPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-kite-blue mb-2">Post a New Job</h1>
        <p className="text-gray-600">Create a job posting to attract candidates - KITE Recruitment</p>
      </div>
      <JobForm />
    </div>
  )
}

export default CreateJobPage
