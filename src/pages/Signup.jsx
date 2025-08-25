import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    skills: [],
    experience: "",
    organization: "",
    industry: "",
  });

  // ✅ Form validation
  const validateForm = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Name, Email, and Password are required!");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Invalid email format!");
      return false;
    }
    return true;
  };

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setForm({ ...form, skills: skillsArray });
  };

  // ✅ API call
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        bio: form.bio,
        skills: form.skills,
        experience: Number(form.experience),
        organization: form.organization,
        industry: form.industry,
      };

      const response = await fetch("https://toolsapi-1.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration failed");
      }

      await response.json();
      alert("🎉 Registration successful!");
      navigate("/signin");
    } catch (err) {
      alert(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl p-8 border border-gray-100">
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us and explore amazing features 🚀
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="organization"
              placeholder="Organization"
              value={form.organization}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={form.experience}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={form.industry}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bio full width */}
          <textarea
            name="bio"
            placeholder="Short Bio"
            value={form.bio}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />

          {/* Skills full width */}
          <input
            type="text"
            placeholder="Skills (comma separated)"
            value={form.skills.join(", ")}
            onChange={handleSkillsChange}
            className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold text-lg transition-all shadow-md disabled:bg-blue-300"
          >
            {loading ? "⏳ Registering..." : "Sign Up"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
