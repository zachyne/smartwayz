import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";

const AuthPages = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = () => {
    console.log("Login:", loginData);
  };

  const handleSignupSubmit = () => {
    console.log("Signup:", signupData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B163C] via-[#2D2570] to-[#0A0E27] flex items-center justify-center p-4 font-[Kanit] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      {/* Auth Container */}
      <div className="relative w-full max-w-5xl flex bg-[#1E1C3A]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2E2470] to-[#1B163C] p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-5xl font-extrabold text-white mb-4 tracking-tight">
              SMARTWAYZ
            </div>

            <div className="space-y-4 text-gray-300">
              <p className="text-sm leading-relaxed">
                SMARTWAYZ is an infrastructure and hazard report management system designed to help 
                local governments and citizens monitor, report, and respond to urban issues efficiently. 
                It also features a traffic simulation component to support data-driven decision-making 
                for road safety and city planning.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3">
            {[
              "Real-time report tracking",
              "Direct communication with authorities",
              "Traffic Simulation",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400">
                  ✓
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="text-3xl font-extrabold text-white mb-1">SMARTWAYZ</div>
            <div className="text-emerald-400 font-semibold text-sm">LGU NAVAL</div>
          </div>

          {/* Tab Switcher */}
          <div className="flex gap-2 bg-[#0F0C1F] p-1 rounded-xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                isLogin
                  ? "bg-gradient-to-r from-[#2E2470] to-[#4338ca] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !isLogin
                  ? "bg-gradient-to-r from-[#2E2470] to-[#4338ca] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
                <p className="text-gray-400 text-sm">Login to access your account</p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-[#0F0C1F] text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="w-full bg-[#0F0C1F] text-white pl-10 pr-12 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-[#0F0C1F]" />
                  <span>Remember me</span>
                </label>
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                onClick={handleLoginSubmit}
                className="w-full bg-gradient-to-r from-[#2E2470] to-[#4338ca] hover:from-[#3730a3] hover:to-[#4f46e5] text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Login to Account
              </button>
            </div>
          ) : (
            // Sign Up Form
            <div className="space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                <p className="text-gray-400 text-sm">Join us to report and track issues</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    placeholder="Juan Dela Cruz"
                    className="w-full bg-[#0F0C1F] text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="juan@example.com"
                    className="w-full bg-[#0F0C1F] text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      placeholder="********"
                      className="w-full bg-[#0F0C1F] text-white pl-10 pr-12 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={signupData.confirmPassword}
                      onChange={(e) =>
                        setSignupData({ ...signupData, confirmPassword: e.target.value })
                      }
                      placeholder="********"
                      className="w-full bg-[#0F0C1F] text-white pl-10 pr-12 py-3 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSignupSubmit}
                className="w-full mt-4 bg-gradient-to-r from-[#2E2470] to-[#4338ca] hover:from-[#3730a3] hover:to-[#4f46e5] text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPages;
