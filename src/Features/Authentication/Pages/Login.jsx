import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../../assets/logo.png";
import {
  KeyRound,
  Mail,
  Loader2,
  Eye,
  EyeOff,
  Code2,
  Sparkles,
} from "lucide-react";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../../store/slices/authSlice";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginStart());

    // Check credentials
    if (email === "user@soilsoft.ai" && password === "SoilSoft@ai") {
      const user = {
        email: email,
        name: "SoilSoft User",
        role: "admin",
      };

      // Simulate API delay
      setTimeout(() => {
        dispatch(loginSuccess(user));
        navigate("/dashboard", { replace: true });
      }, 1000);
    } else {
      dispatch(loginFailure("Invalid credentials"));
    }
  };

  const fillSampleCredentials = () => {
    setEmail("user@soilsoft.ai");
    setPassword("SoilSoft@ai");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-blue-500/20"></div>
        {/* API Testing Visual Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-4 gap-8 opacity-5">
            {Array.from({ length: 16 }).map((_, i) => (
              <Code2
                key={i}
                className="w-12 h-12 text-blue-200 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo and Caption Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <img src={logo} alt="APIGEN Logo" className="w-64" />
          </div>
          <p className="text-gray-200 ">
            Advanced API TestCase Generator & Executer{" "}
          </p>
        </div>

        <div className="bg-white backdrop-blur-xl rounded-2xl p-8 shadow-2xl animate-slideUp">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-blue-900">
              Welcome back!
            </h1>
            <p className="text-gray-600 mt-2 animate-fadeIn">
              Sign in to your account
            </p>
          </div>

          {/* Sample Credentials Card */}
          <div className="mb-6">
            <button
              onClick={fillSampleCredentials}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
            >
              <Sparkles className="h-5 w-5 text-green-500 group-hover:animate-ping" />
              <span className="text-sm text-green-700">Soil Soft User</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slideRight">
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="animate-slideLeft">
              <div className="relative group">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-medium shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed animate-fadeIn"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-blue-200">
            © 2025 APIGen. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
