import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getForm = async (e) => {
    e.preventDefault();
    try {
      const loginPromise = fetch(
        "https://ai-chat-bot-backend.vercel.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.Message === "Success") {
            console.log(data);
            localStorage.setItem("token", data.TOKEN);
            localStorage.setItem("Name", data.Name);
            navigate("/");
            return data;
          } else {
            throw new Error(data.Message);
          }
        });
      toast.promise(loginPromise, {
        loading: "checking Credentials",
        success: "Login success!",
        error: "Please Provide Valid Credentials",
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-96 p-3 m-auto bg-#191919 rounded-lg shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-green-700">
          Login
        </h1>
        <form className="mt-6" onSubmit={getForm}>
          <div className="mb-2">
            <label className="block text-sm font-semibold text-white">
              Email
            </label>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="block w-full px-4 py-2 mt-2 text-white bg-[#212121] border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-semibold text-white">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="block w-full px-4 py-2 mt-2 text-white bg-[#212121] border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <Link
            to={"/forgetPassword"}
            href="#"
            className="text-xs text-green-600 hover:underline"
          >
            Forget Password?
          </Link>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-500 rounded-md hover:bg-green-900 focus:outline-none focus:bg-green-600"
            >
              Login
            </button>
          </div>
        </form>
        <p className="mt-8 text-xs font-light text-center text-white">
          {" "}
          Dont have an account?{" "}
          <Link
            to="/signUp"
            className="font-medium text-green-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
