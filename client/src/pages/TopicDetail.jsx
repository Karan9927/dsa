import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import { FiArrowLeft, FiCheck, FiPlay, FiExternalLink, FiFileText } from 'react-icons/fi';

export default function TopicDetail() {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/topics/${id}/problems`)
      .then((res) => {
        setTopic(res.data.topic);
        setProblems(res.data.problems);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const toggleProgress = async (problemId) => {
    try {
      await API.put(`/progress/${problemId}`);
      setProblems((prev) =>
        prev.map((p) =>
          p._id === problemId ? { ...p, completed: !p.completed } : p
        )
      );
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const completedCount = problems.filter((p) => p.completed).length;
  const progress = problems.length > 0 ? Math.round((completedCount / problems.length) * 100) : 0;

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
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-700 transition-colors no-underline mb-6"
        >
          <FiArrowLeft size={15} />
          Back to all topics
        </Link>

        {/* Topic Header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #fff7ed, #fff1e6, #fff)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{topic?.name}</h1>
                <p className="text-sm text-gray-500">{topic?.description}</p>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#f3f4f6" strokeWidth="5" />
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#e8590c" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${progress * 1.634} 163.4`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{progress}%</span>
                  </div>
                </div>

                <div>
                  <div className="text-xl font-bold text-gray-900">{completedCount}/{problems.length}</div>
                  <div className="text-xs text-gray-400 font-medium">completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 lg:px-8 py-3 bg-gray-50 border-b border-gray-200">
            <div className="col-span-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</div>
            <div className="col-span-5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Problem</div>
            <div className="col-span-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Difficulty</div>
            <div className="col-span-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Practice / Resources</div>
          </div>

          {problems.map((problem, index) => (
            <div
              key={problem._id}
              className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-6 lg:px-8 py-4 items-center hover:bg-orange-50/40 transition-colors ${
                index < problems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="md:col-span-1 flex md:justify-center">
                <button
                  onClick={() => toggleProgress(problem._id)}
                  className={`custom-check ${problem.completed ? 'checked' : ''}`}
                >
                  {problem.completed && <FiCheck className="text-white" size={12} strokeWidth={3} />}
                </button>
              </div>

              <div className="md:col-span-5">
                <span className={`text-sm font-medium ${
                  problem.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}>
                  {problem.order}. {problem.title}
                </span>
              </div>

              <div className="md:col-span-2">
                <span className={`inline-block text-[11px] font-semibold px-3 py-1 rounded-full ${
                  problem.difficulty === 'Easy'
                    ? 'bg-green-100 text-green-700'
                    : problem.difficulty === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="md:col-span-4 flex items-center gap-2 flex-wrap">
                {problem.youtubeUrl && (
                  <a href={problem.youtubeUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold no-underline transition-all hover:-translate-y-0.5 bg-red-50 text-red-600 border border-red-100">
                    <FiPlay size={11} /> YouTube
                  </a>
                )}
                {problem.leetcodeUrl && (
                  <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold no-underline transition-all hover:-translate-y-0.5 bg-orange-50 text-orange-600 border border-orange-100">
                    <FiExternalLink size={11} /> LeetCode
                  </a>
                )}
                {problem.articleUrl && (
                  <a href={problem.articleUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold no-underline transition-all hover:-translate-y-0.5 bg-blue-50 text-blue-600 border border-blue-100">
                    <FiFileText size={11} /> Article
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
