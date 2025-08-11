import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState as useLocalState, useEffect as useLocalEffect } from "react";
import { FaUser, FaLock, FaSignInAlt, FaEnvelope } from "react-icons/fa";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useLocalState("");
  const [message, setMessage] = useLocalState("");
  const [error, setError] = useLocalState("");
  const [submitting, setSubmitting] = useLocalState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/auth/users/reset_password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          err.email?.[0] || err.detail || "Failed to send reset email"
        );
      }
      setMessage("If the email exists, a reset link has been sent.");
      setEmail("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

const Login = () => {
  const { login, user, isAuthenticated, loading } = useContext(AuthContext);
  const [formData, setFormData] = useLocalState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useLocalState(true);
  const [showForgot, setShowForgot] = useLocalState(false);
  const [error, setError] = useLocalState("");
  const navigate = useNavigate();

  useLocalEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "supervisor") {
        navigate("/supervisor-dashboard");
      } else if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(formData.email, formData.password, rememberMe);
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            register for free
          </Link>{" "}
          {/* If you want a link back to login from register page, it's already there as 'Sign in instead' */}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <FaSignInAlt className="mr-2" />
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6"></div>
        </div>
      </div>
      {/* Forgot Password Modal */}
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}
    </div>
  );
};

export default Login;
