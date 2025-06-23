import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
const Login = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();
  const navigate=useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!formData.username || !formData.password) {
    alert('Please enter username and password');
    return;
  }

  try {
    await login(formData);
    navigate("/");
  } catch (error) {
    console.error('Login error:', error);
  }
};

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="min-h-[70vh] min-w-[40vw] bg-[#191a1a] w-full max-w-md mx-auto text-white flex justify-center items-center rounded-[20px] shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/15">
        <div className="flex flex-col justify-center text-center w-full px-10">
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center hover:bg-blue-600/30 transition-colors">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-4xl font-semibold">Welcome Back</h3>
            <p className="text-white/60 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5 items-center w-full">
            {/* Username Input */}
            <div className="relative w-4/5">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-gray-300 text-black rounded-2xl w-full pl-12 pr-4 py-3"
              />
            </div>

            {/* Password Input */}
            <div className="relative w-[80%]">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-amber-800" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-gray-300 text-black rounded-2xl w-full pl-12 py-3"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-blue-600 text-white rounded-3xl py-2 w-32 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <h3 className="text-sm opacity-60">-----or-----</h3>

            <button
              type="button"
              className="text-sky-50 hover:cursor-pointer text-sm hover:text-blue-400 transition-colors"
              onClick={()=>navigate("/signup")}
            >
              Don't have an account? Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
