import { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    password: "",
    avatar:""
  });
  const navigate=useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Name is required");
      return false;
    }
    if (!formData.username.trim()) {
      alert("Username is required");
      return false;
    }
    if (!formData.bio.trim()) {
      alert("Bio is required");
      return false;
    }
    if (!formData.password) {
      alert("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const success = validateForm();

  if (success === true) {
    const defaultAvatar = {
      public_id: "default_avatar",
      url:"https://gravatar.com/avatar/8442e11d00c2a5f3bd82025496bf4f53?s=400&d=robohash&r=x"
      // url:"https://gravatar.com/avatar/8442e11d00c2a5f3bd82025496bf4f53?s=400&d=robohash&r=x" : "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.name.trim()),
    };

    const userData = {
      ...formData,
      avatar: defaultAvatar,
    };

    try {
      await signup(userData);
      navigate("/");
    } catch (error) {
      console.error('Signup error:', error);
    }
  }
};

  return (
    <div className="min-h-screen w-full flex justify-center items-center  text-white p-4">
      <div className="w-full max-w-sm bg-[#191a1a] rounded-2xl shadow-lg px-6 py-6">
        {/* Logo / Heading */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center hover:bg-blue-600/30 transition-colors">
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <h1 className="text-2xl font-semibold">Create Account</h1>
          <p className="text-white/60 text-xs text-center">Get started with your free account</p>
        </div>

        <div className="flex flex-col gap-4">
          <InputField
            label="Name"
            icon={<User className="h-4 w-4 text-gray-500" />}
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <InputField
            label="Username"
            icon={<User className="h-4 w-4 text-gray-500" />}
            type="text"
            placeholder="johndoe123"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />

          <TextAreaField
            label="Bio"
            icon={<MessageSquare className="h-4 w-4 text-gray-500" />}
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <div className="w-full">
            <label className="block text-xs font-medium text-white/80 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-gray-300 text-black rounded-xl w-full pl-10 pr-10 py-2 text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSigningUp}
            className="bg-blue-600 text-white rounded-xl py-2.5 w-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium mt-2"
          >
            {isSigningUp ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Account"
            )}
          </button>

          <div className="text-center text-xs opacity-60 my-1">— or —</div>

          <button
            type="button"
            className="text-center text-sky-50 text-xs hover:text-blue-400 transition-colors"
            onClick={() => navigate("/login")}
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, icon, type, placeholder, value, onChange }) => (
  <div className="w-full">
    <label className="block text-xs font-medium text-white/80 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-gray-300 text-black rounded-xl w-full pl-10 pr-4 py-2 text-sm"
      />
    </div>
  </div>
);

const TextAreaField = ({ label, icon, placeholder, value, onChange }) => (
  <div className="w-full">
    <label className="block text-xs font-medium text-white/80 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute top-2 left-3 pointer-events-none">
        {icon}
      </div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows="2"
        className="bg-gray-300 text-black rounded-xl w-full pl-10 pr-4 py-2 resize-none text-sm"
      />
    </div>
  </div>
);

export default SignUpPage;