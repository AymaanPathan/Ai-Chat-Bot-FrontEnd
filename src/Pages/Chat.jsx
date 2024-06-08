/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import arrowImg from "../Pages/right-arrow.png";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "ldrs/ring";
import "./chat.css";
import { hatch } from "ldrs";

function Chat() {
  hatch.register();
  // Default values shown

  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState([]);
  const [imagedata, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("Name");

  const apiData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = `https://ai-chat-bot-backend.vercel.app/chats?message=${encodeURIComponent(prompt)}`;
      if (!token) {
        toast.error("You Are Not Authorized");
        navigate("/login");
        throw new Error(`You Are Not Authorized ! Status: ${401}`);
      }
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json(); // Parse JSON response
      let processedData = responseData.replace(/\*/g, " ");

      // Save the current prompt and response in the data array
      setData((prev) => [...prev, { prompt, response: processedData }]);

      setPrompt(""); // Clear prompt after successful API call
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

  const upload = async () => {
    if (file) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await axios.post(
          "https://ai-chat-bot-backend-1-eciy.onrender.com/upload",
          formData
        );
        const response = res.data;

        // Handle success if needed
        setImageData((prevData) => [...prevData, { response }]);
        setFileName(null); // Clear file state after successful upload
      } catch (err) {
        console.error("Error uploading file:", err);
        // Handle error
      } finally {
        setLoading(false);
        // setFileName(null); // Clear file state after successful upload
      }
    } else {
      console.log("Error while selecting file");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName("File has been Selected");
    } else {
      setFile(null);
      setFileName("");
    }
  };

  const deleteChats = () => {
    setData([]);
    setImageData([]);
    setFileName([]);
  };

  return (
    <div className="main">
      <button
        type="button"
        onClick={deleteChats}
        className="text-white delete-btn"
      >
        Delete Chat's
      </button>
      <div className="data-main">
        <ul>
          {data.map((item, index) => (
            <li key={index} className="">
              <div className="flex gap-2 m-4">
                <h2 className="text-green-600 whitespace-nowrap">{userName}</h2>
                <p className="text-white  "> {item.prompt}</p>
              </div>
              <div className="flex gap-2 m-4">
                <p>
                  <h2 className="text-green-600 whitespace-nowrap">MY-GPT</h2>
                </p>
                <p className="text-white  ">{item.response}</p>
              </div>
            </li>
          ))}
          {imagedata.map((item, index) => (
            <li key={index} className="">
              <div className="flex gap-2 m-4">
                <h2 className="text-green-600 whitespace-nowrap">{userName}</h2>
                <p className="text-white  ">Scan the Picture</p>
              </div>
              <div className="flex gap-2 m-4">
                <p>
                  <h2 className="text-green-600 whitespace-nowrap">MY-GPT</h2>
                </p>
                <p className="text-white  ">{item.response}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {loading ? (
        <div className="md:relative bottom-11 right-24 spinner-overlay flex justify-around items-center">
          <l-hatch size="20" stroke="4" speed="5" color="white"></l-hatch>
        </div>
      ) : (
        ""
      )}
      <div className="files_input-main  grid grid-cols-1 items-center">
        <div className="flex items-center justify-start">
          <label
            htmlFor="file-upload"
            className="custom-file-upload text-white rounded-xl m-3 cursor-pointer"
          >
            Select File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileName && <p className="text-white ml-3">{fileName}</p>}
          <button
            type="button"
            className="text-white px-3 py-2 rounded-lg mx-4 my-2 bg-green-800 active:scale-105"
            onClick={upload}
          >
            Upload
          </button>
        </div>
        <form action="" className="flex items-center">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-white outline-none rounded-md mx-3 my-2 bg-[#212121] p-2 flex-grow"
            placeholder="Enter Your Prompt"
            type="text"
          />
          <button
            type="submit"
            onClick={apiData}
            className="submit-button absolute right-4 md:right-40"
          >
            <img src={arrowImg} alt="Arrow icon" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
