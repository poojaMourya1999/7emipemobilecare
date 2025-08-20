import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { PROFILE_BY_ID } from '../services/apiUrl';
import MyModal from '../components/MyModal';
import EditProfile from './EditProfile';
import { FiUser, FiMail, FiAward, FiBriefcase, FiEdit, FiStar } from 'react-icons/fi';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editProfileModal, setEditProfileModal] = useState(false);

  const getUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    try {
      const res = await apiService({
        endpoint: `${PROFILE_BY_ID}/${userId}`,
        method: 'GET',
      });
      setUser(res?.data?.user); // Access the user object from response
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  // Function to calculate success rate
  const calculateSuccessRate = (created, solved) => {
    if (!created || created === 0) return 0;
    return Math.min(100, Math.round((solved / created) * 100));
  };

  // Calculate success rate based on current user stats
  const successRate = calculateSuccessRate(
    user?.stats?.problemsPosted || 0, 
    user?.stats?.solutionsProvided || 0
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-12">Failed to load profile</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6 relative">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center -mt-16">
            <img
              src={user?.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            <div className="mt-4 md:mt-0 md:ml-6 flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-700">
                        {user.rating || 'No ratings yet'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditProfileModal(true)}
                  className="mt-3 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <FiEdit size={16} />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Main Profile Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <FiMail className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">{user.email || 'Not provided'}</p>
                    </div>
                  </div>

                  {user.bio && (
                    <div className="flex items-start">
                      <FiUser className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Bio</p>
                        <p className="text-gray-800">{user.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {user.skills && user.skills.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Professional Info */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h2>

                <div className="space-y-4">
                  {user.experience && (
                    <div className="flex items-start">
                      <FiAward className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Experience</p>
                        <p className="text-gray-800">
                          {user.experience} {user.experience === 1 ? 'year' : 'years'}
                        </p>
                      </div>
                    </div>
                  )}

                  {user.organization && (
                    <div className="flex items-start">
                      <FiBriefcase className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Organization</p>
                        <p className="text-gray-800">{user.organization}</p>
                      </div>
                    </div>
                  )}

                  {user.industry && (
                    <div className="flex items-start">
                      <FiBriefcase className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Industry</p>
                        <p className="text-gray-800">{user.industry}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Section */}
              <div className="bg-indigo-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity Stats</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{user?.stats?.problemsPosted || 0}</p>
                    <p className="text-sm text-gray-500">Problems Created</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{user?.stats?.solutionsProvided || 0}</p>
                    <p className="text-sm text-gray-500">Problems Solved</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{successRate}%</p>
                    <p className="text-sm text-gray-500">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editProfileModal && (
        <MyModal
          isOpen={editProfileModal}
          onClose={() => setEditProfileModal(false)}
          title="Edit Profile"
        >
          <EditProfile
            user={user}
            onSuccess={() => {
              setEditProfileModal(false);
              getUserProfile(); // Refresh profile data
            }}
          />
        </MyModal>
      )}
    </div>
  );
};

export default Profile;