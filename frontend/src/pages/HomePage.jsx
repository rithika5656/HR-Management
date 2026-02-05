import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div 
        className="relative min-h-[500px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.3) 100%), url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right'
        }}
      >
        <div className="container mx-auto px-8">
          <div className="max-w-xl">
            <h1 className="text-5xl font-bold mb-2">
              <span className="text-[#1a365d]">Co-Kreating</span>
            </h1>
            <h1 className="text-5xl font-bold text-[#f97316] mb-6">
              Careers
            </h1>
            <p className="text-gray-700 text-lg mb-2">
              Join the next generation of professionals at KGiSL Institutions.
            </p>
            <p className="text-gray-700 text-lg mb-8">
              Start your career journey today.
            </p>
            <Link 
              to="/jobs" 
              className="inline-block px-8 py-3 bg-[#f97316] text-white rounded font-semibold text-lg hover:bg-[#ea580c] transition-colors shadow-lg"
            >
              Apply Now
            </Link>
          </div>
        </div>
        
        {/* KGiSL Institute of Technology text on right */}
        <div className="absolute right-8 top-8 text-right">
          <span className="text-3xl font-bold">
            <span className="text-[#f97316]">KGi</span>
            <span className="text-[#1a365d]">SL</span>
          </span>
          <span className="text-2xl text-[#1a365d] font-light italic ml-2">Institute of Technology</span>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-8">
          <h2 className="text-3xl font-bold text-[#1a365d] text-center mb-12">HR Recruitment Portal</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-[#1a365d]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1a365d] mb-2">Job Postings</h3>
              <p className="text-gray-600">Create and manage campus recruitment opportunities with detailed requirements.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-[#f97316]">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#f97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1a365d] mb-2">Easy Applications</h3>
              <p className="text-gray-600">Students can apply with resume upload and track application status.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center border-t-4 border-[#1a365d]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1a365d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1a365d] mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor candidates through hiring pipeline from applied to selected.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Flow Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-8">
          <div className="bg-gradient-to-r from-[#1a365d] to-[#2d4a7c] rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold text-center mb-8">Recruitment Pipeline</h2>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className="px-5 py-2 bg-white/20 rounded-full font-medium backdrop-blur">Applied</div>
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <div className="px-5 py-2 bg-yellow-500/80 rounded-full font-medium">Shortlisted</div>
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <div className="px-5 py-2 bg-purple-500/80 rounded-full font-medium">Interview</div>
              <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              <div className="px-5 py-2 bg-green-500/80 rounded-full font-medium">Selected</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
