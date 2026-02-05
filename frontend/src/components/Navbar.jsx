import { Link, useLocation } from 'react-router-dom'

// KITE Logo matching the official website
const KiteLogo = () => (
  <div className="flex flex-col">
    <div className="flex items-end">
      <span className="text-4xl font-bold text-[#1a1f4e] leading-none" style={{fontFamily: 'Georgia, serif'}}>K</span>
      <span className="text-4xl font-bold text-[#1a1f4e] leading-none" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>i</span>
      <span className="text-4xl font-bold text-[#1a1f4e] leading-none" style={{fontFamily: 'Georgia, serif'}}>T</span>
      <span className="text-4xl font-bold text-[#1a1f4e] leading-none" style={{fontFamily: 'Georgia, serif'}}>E</span>
      <div className="ml-1 mb-2 flex flex-col gap-0.5">
        <div className="w-6 h-1.5 bg-[#f97316] transform -skew-x-12 rounded-r-full"></div>
        <div className="w-5 h-1 bg-[#1a1f4e] transform -skew-x-12 rounded-r-full"></div>
      </div>
    </div>
    <span className="text-[9px] font-bold text-[#1a1f4e] tracking-wide">KGISL INSTITUTE OF TECHNOLOGY</span>
    <span className="text-[8px] text-gray-500 italic">We Script your Career</span>
  </div>
)

function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')
  
  return (
    <header className="w-full">
      {/* White Header with Logo */}
      <div className="bg-white py-3 px-6 flex justify-between items-center border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <KiteLogo />
        </Link>
        <Link 
          to="/hr/dashboard" 
          className="px-5 py-2 bg-[#1a365d] text-white rounded text-sm font-medium hover:bg-[#2d4a7c] transition-colors"
        >
          Login Portal
        </Link>
      </div>
      
      {/* Navy Blue Navigation Bar */}
      <nav className="bg-[#1a365d] py-2 px-6">
        <div className="flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-[#f97316]' : 'text-white hover:text-[#f97316]'}`}
          >
            Home
          </Link>
          <Link 
            to="/jobs" 
            className={`text-sm font-medium transition-colors ${isActive('/jobs') && !location.pathname.includes('/create') ? 'text-[#f97316]' : 'text-white hover:text-[#f97316]'}`}
          >
            Careers
          </Link>
          <Link 
            to="/hr/dashboard" 
            className={`text-sm font-medium transition-colors ${isActive('/hr') ? 'text-[#f97316]' : 'text-white hover:text-[#f97316]'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/jobs/create" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/jobs/create' ? 'text-[#f97316]' : 'text-white hover:text-[#f97316]'}`}
          >
            Post Job
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
