import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #e8590c, #f76707)' }}>
              DS
            </div>
            <div>
              <span className="text-base font-bold text-gray-900 block leading-tight">DSA Sheet</span>
              <span className="text-[10px] text-gray-400 font-medium">A2Z DSA Course</span>
            </div>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 rounded-full px-4 py-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #e8590c, #f76707)' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <FiLogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
