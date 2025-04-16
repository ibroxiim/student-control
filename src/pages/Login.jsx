import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState(""); // bu faqat 9 xonali qismi
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (error) {
      timer = setTimeout(() => {
        setError("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  const validateForm = () => {
    const phoneRegex = /^\d{9}$/; // faqat 9 ta raqam

    if (!phone || !password) {
      setError("Barcha maydonlarni to'ldiring.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      setError("Telefon raqam: faqat 9 xonali raqam kiriting.");
      return false;
    }

    if (password.length < 8) {
      setError("Parol kamida 8ta belgidan iborat bo'lishi kerak.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "https://kuro001.pythonanywhere.com/api/user/login/",
        {
          phone_number: `+998${phone}`,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/user");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        setError(
          err.response.data.message ||
            "Login muvaffaqiyatsiz. Raqam yoki parol xato."
        );
      } else {
        setError("Login muvaffaqiyatsiz. Raqam yoki parol xato.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-100"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login
        </h2>

        {error && (
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 border border-red-100 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Telefon raqam
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition">
            <span className="text-gray-700 mr-2 select-none font-medium">
              +998
            </span>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="901234567"
              maxLength={9}
              className="w-full outline-none"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-2 font-medium text-gray-700">Parol</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Parol kamida 8 ta belgidan iborat bo'lishi kerak
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-purple-600 text-white py-3 rounded-lg transition font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"
          }`}
        >
          {loading ? "Kirish..." : "Kirish"}
        </button>

        <p className="mt-6 text-center text-gray-600">
          Akkount yo'qmi?{" "}
          <span
            className="text-purple-600 cursor-pointer font-medium hover:text-purple-800 transition"
            onClick={() => navigate("/register")}
          >
            Ro'yxatdan o'tish
          </span>
        </p>
      </form>
    </div>
  );
}
