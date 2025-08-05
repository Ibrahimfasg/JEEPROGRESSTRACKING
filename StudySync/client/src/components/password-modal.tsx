import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (password: string) => void;
  avatar: string;
  userType: 'boy' | 'girl';
}

export default function PasswordModal({ isOpen, onClose, onLogin, avatar, userType }: PasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
    setPassword("");
  };

  const handleCancel = () => {
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism border-white/20 max-w-md">
        <DialogTitle className="text-2xl font-bold text-white text-center mb-6">
          Enter Your Password
        </DialogTitle>
        <div className="text-center">
          <div className="text-6xl mb-6 animate-bounce">{avatar}</div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:ring-blue-400"
              autoFocus
            />
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
                className="flex-1 bg-gray-500 hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`flex-1 ripple transition-all duration-300 ${
                  userType === 'boy' 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
