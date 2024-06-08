import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const form = async (e) => {
    e.preventDefault();
    const registrationPromise = fetch(
      "https://ai-chat-bot-backend.vercel.app/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === "Success") {
          console.log(data);
          localStorage.setItem("token", data.TOKEN);
          localStorage.setItem("Name", data.Name);
          navigate("/");
          return data;
        } else {
          throw new Error(data.Message);
        }
      });

    toast
      .promise(registrationPromise, {
        loading: "Checking Credentials",
        success: "Registration Successful",
        error: "Please Provide Valid Credentials",
      })
      .catch((error) => {
        console.error(
          "There was an error with the registration:",
          error.message
        );
        toast.error("An error occurred: " + error.message);
      });
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-96 p-3 m-auto bg-#191919 rounded-lg shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-green-700">
          Register
        </h1>
        <form className="mt-6">
          {/* UserName */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-white">
              UserName
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="UserName"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-white  bg-[#212121] border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          {/* Email */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-white">
              Email
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Email"
              type="email"
              className="block w-full px-4 py-2 mt-2 text-white  bg-[#212121]  border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          {/* Password */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-white">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Password"
              type="password"
              className="block w-full px-4 py-2 mt-2 text-white  bg-[#212121]  border rounded-md focus:border-green-400 focus:ring-green-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mt-6">
            <button
              onClick={form}
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-500 rounded-md hover:bg-green-900 focus:outline-none focus:bg-green-600"
            >
              Create An Account
            </button>
          </div>
        </form>
        <p className="mt-8 text-xs font-light text-center text-white">
          {" "}
          Already Have an account?{" "}
          <Link
            to="/Login"
            className="font-medium text-green-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
