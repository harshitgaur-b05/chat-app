import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    console.log("Logged authUser:", authUser);
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ avatar: base64Image });
    };
    reader.readAsDataURL(file);
  };

  // ✅ Guard against null
  if (!authUser) {
    return (
      <div className="text-center text-white mt-10 text-lg">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="bg-blue-950 rounded-2xl shadow-lg w-[30vw] max-w-md h-[70vh] flex flex-col items-center py-6 px-4 gap-4">
        {/* Avatar Upload */}
        <div className="relative">
          <img
            src={selectedImg || authUser?.avatar?.url || "/avatar.png"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-amber-50"
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute bottom-0 right-0 
              bg-blue-600 hover:bg-blue-700 hover:scale-105
              p-2 rounded-full cursor-pointer 
              transition-all duration-200
              ${isUpdatingProfile ? "animate-pulse pointer-events-none opacity-50" : ""}
            `}
          >
            <Camera className="w-4 h-4 text-white" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />
          </label>
        </div>

        {/* Info */}
        <div className="text-center space-y-1">
          <h2 className="text-lg font-semibold text-slate-50">{authUser.name}</h2>
          <p className="text-sm text-slate-50">@{authUser.username}</p>
        </div>

        <div className="w-full px-4 text-center">
          <p className="text-sm text-slate-50 italic">"{authUser.bio}"</p>
        </div>

        <div className="w-full border-t pt-4 text-center text-sm text-slate-50">
          Joined on {new Date(authUser.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
