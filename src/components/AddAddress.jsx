import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/userSlice';

const AddAddress = ({ onClose }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    flatNo: '',
    area: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const handleChange = (e) => {
    console.log(`Changing field ${e.target.name}: ${e.target.value}`);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    console.log("Attempting to save new address...");

    const newAddress = {
      fullAddress: {
        flatNo: formData.flatNo,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      coordinates: {
        lat: null, 
        long: null,
      },
    };

    const phoneNumber = userData.phone;
    const existingAddresses = userData.addresses || [];

    const updatedAddresses = [newAddress]; // Only adding the new address.

    const updatedUserData = {
      addresses: JSON.stringify(updatedAddresses),
      // removeAddr: 2, 
    };

    console.log("Updated User Data:", updatedUserData);

    try {
      const response = await fetch(`https://b2c-49u4.onrender.com/api/v1/customer/user/${phoneNumber}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });

      if (response.ok) {
        console.log('Address added successfully');
        dispatch(fetchUserData(phoneNumber));
      } else {
        const errorMessage = await response.text();
        console.error('Failed to add address:', errorMessage);
      }
    } catch (error) {
      console.error('Error during save:', error);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px] relative">
        <h2 className="text-xl font-bold mb-4">Enter Complete Address</h2>

        <form className="space-y-4">
          <input
            type="text"
            name="flatNo"
            value={formData.flatNo}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Flat/Building No."
          />
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Area/Locality/Sector"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="State"
          />
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Zip Code"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            placeholder="Country"
          />
        </form>

        <div className="mt-6 flex justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#f87709] text-white rounded hover:bg-green-600">
            Save Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddress;
