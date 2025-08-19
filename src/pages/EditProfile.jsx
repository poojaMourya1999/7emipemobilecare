import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { UPLOAD, USER, USER_UPDATE } from '../services/apiUrl';

const EditProfile = ({user, onSuccess}) => {
    console.log("user : ", user)
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: user.name || 'John Doe', // Dummy data
        email: user.email || 'john@example.com', // Dummy data (read-only)
        age: user.age || '28',
        gender: user.gender || 'male',
        bio: user.bio || 'Software developer passionate about building great user experiences',
        profilePic: user.profilePic 
    });

    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    // Gender options for dropdown
    const genderOptions = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ];

    // In a real app, you would fetch actual user data here
    useEffect(() => {
        // Simulate loading user data
        setPreview(form.profilePic);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.match('image.*')) {
            setErrors({ ...errors, profilePic: 'Only image files are allowed' });
            return;
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setErrors({ ...errors, profilePic: 'File size must be less than 2MB' });
            return;
        }

        setImageFile(file);
        setPreview(URL.createObjectURL(file));
        setErrors({ ...errors, profilePic: '' });
    };

    const uploadImage = async () => {
        if (!imageFile) return form.profilePic; // Return existing if no new file
        
        setUploading(true);
        const data = new FormData();
        data.append('file', imageFile);

        try {
            const res = await apiService({
                endpoint: UPLOAD,
                method: 'POST',
                data,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res?.fileUrl || '';
        } catch (err) {
            console.error('Image upload failed', err);
            setErrors({ ...errors, profilePic: 'Image upload failed' });
            return '';
        } finally {
            setUploading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (form.age && (form.age < 13 || form.age > 120)) {
            newErrors.age = 'Age must be between 13 and 120';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        setLoading(true);

        try {
            const imageUrl = await uploadImage();
            if (imageFile && !imageUrl) {
                // Don't proceed if image upload failed but file was selected
                return;
            }

            const payload = {
                name: form.name,
                age: form.age,
                gender: form.gender,
                bio: form.bio,
                profilePic: imageUrl || form.profilePic
            };

            // In a real app, you would use the actual user ID
            const res = await apiService({
                endpoint: `${USER_UPDATE}${user._id}`, // Replace with actual user ID
                method: 'PUT',
                data: payload,
            });

            alert('Profile updated successfully!');
            // navigate('/profile');
            onSuccess()
        } catch (err) {
            setServerError(err.response?.data?.error || 'Update failed. Please try again.');
            console.error('Update error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Edit Profile</h2>
            
            {serverError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {serverError}
                </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                        <img
                            src={preview || '/default-avatar.png'}
                            alt="Profile preview"
                            className="w-full h-full rounded-full object-cover border-2 border-indigo-200"
                        />
                    </div>
                    <label className="cursor-pointer">
                        <span className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700">
                            Change Photo
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                    {errors.profilePic && (
                        <p className="mt-1 text-sm text-red-600">{errors.profilePic}</p>
                    )}
                </div>

                {/* Name Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Email Field (read-only) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Age Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleChange}
                            min="13"
                            max="120"
                            className={`w-full p-2 border rounded-md ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.age && (
                            <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                        )}
                    </div>

                    {/* Gender Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            {genderOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bio Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </span>
                    ) : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;