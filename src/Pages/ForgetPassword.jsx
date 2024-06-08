import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const sendTokenToEmail = async (e) => {
    e.preventDefault();
    if (email === "") {
      return toast.error("Please provide a valid email address.");
    }
    if (!emailPattern.test(email)) {
      return toast.error("Please provide a valid email address.");
    }
    try {
      const response = fetch(
        "https://ai-chat-bot-backend.vercel.app/forgetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );
      toast.promise(
        response.then((res) => res.json()),
        {
          loading: "Sending code...",
          success: "Check your mail.",
          error: "Failed to send token.",
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("An error occurred: " + error.message);
    }
  };

  const checkToken = async () => {
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    try {
      const response = await fetch(
        `https://ai-chat-bot-backend.vercel.app/resetPassword/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ password, confirmPassword }),
        }
      );

      toast.promise(
        response.json().then((data) => {
          if (!response.ok) {
            throw new Error(data.message || "Failed to reset password");
          }
          console.log(data);
          navigate("/login");
          return data;
        }),
        {
          loading: "Checking password...",
          success: "Password changed.",
          error: "Failed to reset password.",
        }
      );
    } catch (error) {
      toast.error("An error occurred: " + error.message);
      console.error(error);
    }
  };

  return (
    <div className=" flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-96 h-screen p-3 m-auto bg-#191919 rounded-lg shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-green-700">
          ForgetPassword
        </h1>
        <form className="mt-6 h-screen">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              placeholder="Email Here...."
              type="email"
              className="block border-none w-full px-4 py-2 mt-2  text-white bg-[#212121] border rounded-t-md focus:border-none focus:outline-none focus:ring-0"
            />

            <button
              type={"button"}
              onClick={sendTokenToEmail}
              className="w-full px-4 py-2 tracking-wide text-white transition-colors  duration-200 transform bg-green-500 rounded-b-md active:bg-green-900 focus:outline-none focus:bg-green-600"
            >
              Send Token
            </button>
          </div>
          <div className="">
            <label className="block text-sm font-semibold text-white">
              Code
            </label>
            <input
              onChange={(e) => setToken(e.target.value)}
              value={token}
              placeholder="Token Here..."
              type="text"
              className="block border-none w-full px-4 py-2 mt-2  text-white bg-[#212121] border rounded-t-md focus:border-none focus:outline-none focus:ring-0"
            />
            <div className="mt-4">
              <label className="block text-sm font-semibold text-white">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Password Here..."
                type="password"
                className="block border-none w-full px-4 py-2 mt-2  text-white bg-[#212121] border rounded-t-md focus:border-none focus:outline-none focus:ring-0"
              />
              <label className="block text-sm font-semibold text-white mt-4">
                ConfirmPassword
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Confirm Password Here..."
                type="password"
                className="block border-none w-full px-4 py-2 mt-2  text-white bg-[#212121] border rounded-t-md focus:border-none focus:outline-none focus:ring-0"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={checkToken}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-500 rounded-b-md active:bg-green-900  focus:outline-none focus:ring-0"
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
