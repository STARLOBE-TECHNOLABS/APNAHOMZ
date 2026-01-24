
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import { BiBuildingHouse, BiLayer, BiCube, BiCloud } from 'react-icons/bi';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const notify = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateInput = () => {
    const { username, email, password, phone } = formData;
    
    if (!username.trim()) {
      notify({ content: "Username is required", type: "warning" });
      return false;
    }
    
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notify({ content: "Please enter a valid email address", type: "warning" });
      return false;
    }
    
    if (password.length < 6) {
      notify({ content: "Password must be at least 6 characters long", type: "warning" });
      return false;
    }
    
    // Basic phone validation (allow digits, spaces, dashes, plus)
    const phoneRegex = /^[\d\s\-\+]{8,}$/;
    if (!phoneRegex.test(phone)) {
      notify({ content: "Please enter a valid phone number", type: "warning" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      notify({ content: "Account created successfully!", type: "success" });
      navigate('/plans/all');
    } else {
      notify({ content: result.error || "Registration failed", type: "error" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* Left Panel - Feature Showcase Theme */}
      <div className="hidden lg:flex lg:w-2/5  relative bg-zinc-900 flex-col justify-between p-12 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        {/* Top Content: Headline & Features */}
        <div className="relative z-10 mt-8">
           <h2 className="text-4xl font-bold text-white mb-2">Built for Architects,</h2>
           <h2 className="text-4xl font-bold text-blue-500 mb-10">Designed for Everyone.</h2>
           
           
        </div>

        {/* Bottom Content: Image Composition */}
        <div className="relative z-10 mt-1 h-64 w-full">
           <div className="absolute bottom-0 right-0 w-[120%] h-full transform translate-x-12 translate-y-12">
             <img 
               src="/landing/screen2.png" 
               className="absolute bottom-16 right-10 w-3/4 rounded-xl shadow-2xl border border-zinc-700/50 z-10 opacity-60"
               alt="3D View Background"
             />
             
             {/* Interactive 2D to 3D Card */}
             <div className="absolute bottom-36 right-32 w-3/4 z-20 transform -rotate-3 hover:rotate-0 transition-transform duration-500 group cursor-pointer">
               <div className="relative rounded-xl shadow-2xl border border-zinc-700/50 overflow-hidden bg-zinc-800">
                  {/* 2D Plan (Visible by default) */}
                  <img 
                    src="/landing/screen1.png" 
                    className="w-full h-auto object-cover transition-opacity duration-700 group-hover:opacity-0"
                    alt="2D View"
                  />
                  
                  {/* 3D Render (Visible on hover) */}
                  <img 
                    src="/landing/3dimage.png" 
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                    alt="3D Render"
                  />
                  
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-xs font-medium text-white transition-all duration-300">
                    <span className="block group-hover:hidden">2D Drafting</span>
                    <span className="hidden group-hover:block text-blue-400">3D Rendering</span>
                  </div>
               </div>
             </div>
           </div>
        </div>

        {/* Feature List */}
           <div className="space-y-8">
              <div className="flex items-start gap-4 group">
                 <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-blue-600 transition-colors duration-300 shadow-lg border border-zinc-700">
                   <BiLayer size={24} className="text-blue-400 group-hover:text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-1">Smart 2D Drafting</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                     Intuitive drag-and-drop tools to create precise floor plans in minutes.
                   </p>
                 </div>
              </div>

              <div className="flex items-start gap-4 group">
                 <div className="p-3 bg-zinc-800 rounded-xl group-hover:bg-purple-600 transition-colors duration-300 shadow-lg border border-zinc-700">
                   <BiCube size={24} className="text-purple-400 group-hover:text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-white mb-1">Instant 3D Visualization</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
                     Watch your 2D plans transform into immersive 3D models automatically.
                   </p>
                 </div>
              </div>

             
           </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md lg:w-xl">
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start items-center mb-6">
               <img 
                 src="https://apnahomz.com/wp-content/uploads/2025/06/webs.png" 
                 alt="ApnaHomz" 
                 className="h-12 w-auto"
               />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start designing your floor plans today
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
              <form className="space-y-6" onSubmit={handleSubmit}>
                
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/login"
                    className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
