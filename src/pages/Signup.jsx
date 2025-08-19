import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiUpload } from 'react-icons/fi';

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        bio: '',
        skills: [],
        experience: 0,
        organization: '',
        industry: ''
    });

    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [skillsInput, setSkillsInput] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSkillsChange = (e) => {
        setSkillsInput(e.target.value);
    };

    const addSkill = () => {
        if (skillsInput.trim() && !form.skills.includes(skillsInput.trim())) {
            setForm({
                ...form,
                skills: [...form.skills, skillsInput.trim()]
            });
            setSkillsInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setForm({
            ...form,
            skills: form.skills.filter(skill => skill !== skillToRemove)
        });
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!form.name.trim()) newErrors.name = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        if (!form.password) newErrors.password = 'Password is required';
        if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(true);

        try {
            // Prepare form data (including file upload if needed)
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('bio', form.bio);
            form.skills.forEach(skill => formData.append('skills[]', skill));
            formData.append('experience', form.experience);
            formData.append('organization', form.organization);
            formData.append('industry', form.industry);
            if (imageFile) formData.append('profilePic', imageFile);

            // Simulate API call (replace with actual fetch)
            console.log('Submitting:', Object.fromEntries(formData));
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Registration successful!');
            navigate('/signin');
        } catch (err) {
            alert(err?.message || 'Registration failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                    <h1 className="text-3xl font-bold">Create Your Account</h1>
                    <p className="opacity-90">Join our community to start solving problems</p>
                </div>

                <form onSubmit={handleSignup} className="p-6 md:p-8 space-y-6">
                    {/* Basic Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FiUser className="mr-2" /> Name *
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="John Doe"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FiMail className="mr-2" /> Email *
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="john@example.com"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FiLock className="mr-2" /> Password *
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300' : 'border-gray-300'} focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center text-sm font-medium text-gray-700">
                                <FiUser className="mr-2" /> Profile Picture
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="cursor-pointer">
                                    <div className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center">
                                        <FiUpload className="mr-2" />
                                        Upload Image
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange} 
                                            className="hidden" 
                                        />
                                    </div>
                                </label>
                                {preview && (
                                    <img 
                                        src={preview} 
                                        alt="Preview" 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-200" 
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">About You</label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tell us about yourself..."
                            rows="3"
                        />
                    </div>

                    {/* Skills Section */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {form.skills.map(skill => (
                                <span 
                                    key={skill} 
                                    className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                                >
                                    {skill}
                                    <button 
                                        type="button"
                                        onClick={() => removeSkill(skill)}
                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={skillsInput}
                                onChange={handleSkillsChange}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Add a skill (e.g. JavaScript)"
                            />
                            <button
                                type="button"
                                onClick={addSkill}
                                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Experience (years)</label>
                            <input
                                name="experience"
                                type="number"
                                min="0"
                                value={form.experience}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Organization Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Organization (optional)</label>
                            <input
                                name="organization"
                                value={form.organization}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Company name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Industry (optional)</label>
                            <input
                                name="industry"
                                value={form.industry}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g. Technology, Healthcare"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </motion.button>
                    </div>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/signin" className="text-blue-600 hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Signup;