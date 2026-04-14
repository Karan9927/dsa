import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { FiChevronRight, FiBookOpen, FiStar, FiTarget } from 'react-icons/fi';

export default function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/topics')
      .then((res) => setTopics(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalProblems = topics.reduce((sum, t) => sum + t.totalProblems, 0);
  const totalCompleted = topics.reduce((sum, t) => sum + t.completedProblems, 0);
  const overallProgress = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-9 w-9 border-[3px] border-orange-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full px-6 lg:px-10 py-8">
        {/* Hero Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="px-8 py-8" style={{ background: 'linear-gradient(135deg, #fff7ed, #fff1e6, #fff)' }}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                  DSA Sheet — A2Z DSA Course
                </h1>
                <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                  Master Data Structures and Algorithms from basics to advanced. Solve curated problems with video tutorials, articles, and practice links.
                </p>
              </div>

              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#e8590c" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={`${overallProgress * 2.136} 213.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900">{overallProgress}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2">
                    <FiTarget size={16} className="text-green-600" />
                    <div>
                      <div className="text-xs text-green-600 font-medium">Solved</div>
                      <div className="text-lg font-bold text-green-700">{totalCompleted}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-orange-50 rounded-lg px-4 py-2">
                    <FiStar size={16} className="text-orange-600" />
                    <div>
                      <div className="text-xs text-orange-600 font-medium">Total</div>
                      <div className="text-lg font-bold text-orange-700">{totalProblems}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics List */}
        <div className="space-y-3">
          {topics.map((topic, index) => {
            const progress = topic.totalProblems > 0
              ? Math.round((topic.completedProblems / topic.totalProblems) * 100)
              : 0;

            return (
              <Link
                key={topic._id}
                to={`/topic/${topic._id}`}
                className="block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all no-underline group"
              >
                <div className="flex items-center gap-4 lg:gap-6 px-5 lg:px-8 py-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #e8590c, #f76707)' }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{topic.description}</p>
                  </div>

                  <div className="hidden sm:flex items-center gap-5 flex-shrink-0">
                    <div className="relative w-11 h-11">
                      <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                        <circle cx="22" cy="22" r="18" fill="none" stroke="#e8590c" strokeWidth="3" strokeLinecap="round"
                          strokeDasharray={`${progress * 1.131} 113.1`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-700">{progress}%</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {topic.completedProblems}/{topic.totalProblems}
                      </div>
                      <div className="text-[10px] text-gray-400 font-medium">problems</div>
                    </div>
                  </div>

                  <FiChevronRight className="text-gray-300 group-hover:text-orange-500 transition-colors flex-shrink-0" size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
