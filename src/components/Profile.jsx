
import React, { useState } from 'react';
import { useSelector } from 'react-redux';  
import EditProfile from './EditProfile'; 
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../redux/userSlice';

const Profile = () => {
  // Fetch userData from the Redux store
  const dispatch = useDispatch();

  const { userData, loading, error } = useSelector((state) => state.user);
  
  // State to manage the edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  // Handle profile update
  const handleProfileUpdate = async(updatedProfile) => {
    try {
      const phoneNumber = userData.phone;
      const formattedPhoneNumber = phoneNumber.startsWith('+') ? phoneNumber.slice(1) : phoneNumber;

      // Log the updated profile data for debugging
      // console.log("Updated Profile Data:", updatedProfile);

      // Make the PATCH request to update the profile
      const response = await fetch(`https://b2c-49u4.onrender.com/api/v1/customer/user/${phoneNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      // console.log("API Response:", response); // Log response for debugging

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Failed to update profile: ${response.statusText} - ${errorDetails}`);
      }
      dispatch(fetchUserData(phoneNumber));

      const data = await response.json();
      // console.log("Profile updated:", data);
      setIsEditing(false);  // Exit edit mode after successful update

    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle canceling the edit
  const handleEditCancel = () => {
    setIsEditing(false); // Exit edit mode without saving
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!userData) {
    return <p>No profile data available</p>;
  }

  return (
    <div className="relative h-2/3 overflow-y-auto border-2 border-gray-200 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>

      {!isEditing ? (
        <div className="space-y-4">
          <p className="flex items-center">
            <strong className="w-24 text-xl font-semibold">Name:</strong>
            <span className="ml-2 w-full p-2 border-2 border-x-gray-100 rounded-lg text-lg font-normal ">
              {userData.name || 'N/A'}
            </span>
          </p>
          <p className="flex items-center">
            <strong className="w-24 text-xl font-semibold">Mobile:</strong>
            <span className="ml-2 w-full p-2 border-2 border-x-gray-100 rounded-lg text-lg font-normal">
              {userData.phone.slice(2) || 'N/A'} {/* Displaying the phone number without the country code */}
            </span>
          </p>
          <p className="flex items-center">
            <strong className="w-24 text-xl font-semibold">Email:</strong>
            <span className="ml-2 w-full p-2 border-2 border-x-gray-100 rounded-lg text-lg font-normal">
              {userData.email || 'N/A'}
            </span>
          </p>
          <p className="flex items-center">
            <strong className="w-24 text-xl font-semibold">Gender:</strong>
            <span className="ml-2 w-full p-2 border-2 border-x-gray-100 rounded-lg text-lg font-normal">
              {userData.gender || 'N/A'}
            </span>
          </p>
          <p className="flex items-center">
            <strong className="w-24 text-xl font-semibold">Age:</strong>
            <span className="ml-2 w-full p-2 border-2 border-x-gray-100 rounded-lg text-lg font-normal">
              {userData.age || 'N/A'}
            </span>
          </p>

          <button
            onClick={handleEditClick}
            className="mt-4 bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <EditProfile
          profile={userData}    
          onProfileUpdate={handleProfileUpdate}
          onCancel={handleEditCancel}
        />
      )}
    </div>
  );
};

export default Profile; 
