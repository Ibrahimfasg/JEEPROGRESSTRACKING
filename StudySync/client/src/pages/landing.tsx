import { useState } from "react";
import { GraduationCap } from "lucide-react";
import PasswordModal from "@/components/password-modal";

interface LandingProps {
  onLogin: (userType: 'boy' | 'girl', password: string) => void;
}

export default function Landing({ onLogin }: LandingProps) {
  const [selectedUser, setSelectedUser] = useState<'boy' | 'girl' | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleAvatarClick = (userType: 'boy' | 'girl') => {
    setSelectedUser(userType);
    setShowPasswordModal(true);
  };

  const handleLogin = (password: string) => {
    if (selectedUser) {
      onLogin(selectedUser, password);
      setShowPasswordModal(false);
      setSelectedUser(null);
    }
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse-slow">
            <GraduationCap className="inline-block text-yellow-400 mr-4" size={64} />
            JEE Study Tracker
          </h1>
          <p className="text-xl text-gray-300 animate-bounce-gentle">
            Track your progress together, achieve success together
          </p>
        </div>

        {/* Avatar Selection */}
        <div className="flex justify-center gap-12 mb-8">
          {/* Boy Avatar */}
          <div className="avatar-container">
            <div 
              className="avatar-card glassmorphism rounded-3xl p-8 cursor-pointer hover-lift transition-all duration-300"
              onClick={() => handleAvatarClick('boy')}
            >
              <div className="text-8xl mb-6 animate-float">👨‍🎓</div>
              <h3 className="text-2xl font-semibold text-white mb-2">Him</h3>
              <p className="text-gray-300 mb-4">Ready to conquer JEE!</p>
              <div className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full transition-all duration-300 ripple">
                Select Profile
              </div>
            </div>
          </div>

          {/* Girl Avatar */}
          <div className="avatar-container">
            <div 
              className="avatar-card glassmorphism rounded-3xl p-8 cursor-pointer hover-lift transition-all duration-300"
              onClick={() => handleAvatarClick('girl')}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="text-8xl mb-6 animate-float" style={{ animationDelay: '0.5s' }}>👩‍🎓</div>
              <h3 className="text-2xl font-semibold text-white mb-2">Her</h3>
              <p className="text-gray-300 mb-4">Future engineer in making!</p>
              <div className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-full transition-all duration-300 ripple">
                Select Profile
              </div>
            </div>
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={handleCloseModal}
        onLogin={handleLogin}
        avatar={selectedUser === 'boy' ? '👨‍🎓' : '👩‍🎓'}
        userType={selectedUser || 'boy'}
      />
    </div>
  );
}
