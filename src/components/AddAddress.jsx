import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../redux/userSlice';

const AddAddress = ({ onClose }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: userData?.phoneNumber || '', // Pre-fill phoneNumber number from userData
    email: '',
    age: '',
    gender: '',
    flatNo: '',
    addressLine1: '',
    addressLine2: '',
    area: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [useLocation, setUseLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invalidFields, setInvalidFields] = useState({});

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setInvalidFields((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const initializeMap = (lat, long) => {
    if (mapRef.current) {
      const initialMap = L.map(mapRef.current).setView([lat, long], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(initialMap);

      setMap(initialMap);
      const newMarker = L.marker([lat, long], { draggable: true }).addTo(initialMap);
      setMarker(newMarker);
      fetchAddress(lat, long);

      newMarker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        fetchAddress(newPos.lat, newPos.lng);
      });
    }
  };

  useEffect(() => {
    if (showMap && !map && useLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setTimeout(() => initializeMap(latitude, longitude), 100);
          },
          () => alert('Failed to get your location.')
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    }
  }, [showMap, map, useLocation]);

  const handleUseCurrentLocation = () => {
    setLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLoadingLocation(false);
          setShowMap(true);
          initializeMap(latitude, longitude);
          setUseLocation(true);
        },
        () => {
          alert('Geolocation permission denied or an error occurred.');
          setLoadingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  const fetchAddress = async (lat, long) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json&accept-language=en`
      );
      const address = response.data.address;
      const addressLine2 = [address.road, address.suburb].filter(Boolean).join(', ');

      setFormData((prevData) => ({
        ...prevData,
        addressLine2: addressLine2 || '',
        area: address.neighbourhood || '',
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        zipCode: address.postcode || '',
        country: address.country || '',
      }));
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  const handleSaveAddress = async () => {
    const invalid = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        invalid[key] = true;
      }
    });

    if (Object.keys(invalid).length > 0) {
      setInvalidFields(invalid);
      return;
    }

    setIsLoading(true);
    const coordinates = marker
      ? { lat: marker.getLatLng().lat, long: marker.getLatLng().lng }
      : { lat: null, long: null };

    const newAddress = {
      fullAddress: {
        flatNo: formData.flatNo,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        area: formData.area,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      coordinates,
    };

    const updatedUserData = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      age: formData.age,
      gender: formData.gender,
      addresses: JSON.stringify([newAddress]), // Stringify the addresses array
    };

    try {
      const response = await fetch(
        `https://b2c-backend-1.onrender.com/api/v1/customer/user/${formData.phoneNumber}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUserData),
        }
      );

      if (response.ok) {
        dispatch(fetchUserData(formData.phoneNumber));
        onClose();
      } else {
        console.error('Failed to add address:', await response.text());
      }
    } catch (error) {
      console.error('Error during save:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-60">
          <div className="loader border-t-4 border-blue-500 w-16 h-16 rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[90%] md:max-w-[700px] relative flex flex-col md:flex-row overflow-y-auto max-h-[90vh] z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black text-xl font-bold"
          disabled={isLoading}>
          &times;
        </button>

        {showMap && (
          <div className="w-full md:w-1/2 pr-0 md:pr-4 mb-4 md:mb-0">
            <div ref={mapRef} style={{ height: '300px', width: '100%' }}></div>
          </div>
        )}

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Add Address</h2>

          {useLocation === null && (
            <button
              onClick={handleUseCurrentLocation}
              className="w-full px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600">
              Use Current Location / Mark Location on Map
            </button>
          )}

          {useLocation !== null && (
            <form className="space-y-4">
              {/* New fields */}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  invalidFields.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  invalidFields.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Email"
                required
              />
              {/* <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  invalidFields.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Age"
                required
              /> */}
              {/* <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  invalidFields.gender ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select> */}

              {/* Existing address fields */}
              {Object.keys(formData)
                .filter((key) => !['name', 'phoneNumber', 'email', 'age', 'gender'].includes(key))
                .map((key) => (
                  <input
                    key={key}
                    type="text"
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${
                      invalidFields[key] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={key.replace(/([A-Z])/g, ' $1')}
                    required
                  />
                ))}
            </form>
          )}

          {useLocation !== null && (
            <button
              onClick={handleSaveAddress}
              className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isLoading}>
              Save Address
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddAddress;