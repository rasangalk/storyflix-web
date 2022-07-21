import React from "react";
import { useState } from "react";
import logo from "../images/logo.svg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const ErrMsg = (errMsg) => {
    toast.error(errMsg, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const login = async () => {
    if (email === "" || password === "") {
      ErrMsg("Please fill the required fields!");
    } else {
      const user = await signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          const token = user._tokenResponse.idToken;
          localStorage.setItem("token", token);
          navigate("/");
        })
        .catch((err) => {
          if (err.code === "auth/wrong-password") {
            ErrMsg("Please enter the correct password!");
          } else if (err.code === "auth/user-not-found") {
            ErrMsg("Please check the email and try again!");
          }
        });
    }
  };
  return (
    <div className="flex h-screen w-screen bg-[#F9F9F9] items-center justify-center">
      <ToastContainer />
      <div className="bg-white h-[28rem] w-[23rem] rounded-xl drop-shadow-2xl flex flex-column">
        <div className="mx-6">
          <div className="flex flex-row gap-2 mt-6 items-center">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/prototype-storyflix.appspot.com/o/web%2Flogo.svg?alt=media&token=99810c96-a9bc-4751-bcfb-f5649835c285"
              alt="logo"
              className="w-9 h-10"
            />
            <h2 className="font-semibold text-2xl opacity-[84%]">Log in</h2>
          </div>
          <div>
            <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-[4rem] font-semibold">
              Email
            </p>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[20rem] sm:w-[20rem] rounded-md text-base focus:ring-1 px-3 py-[0.3rem]"
            />
            <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-4 font-semibold">
              Password
            </p>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[20rem] sm:w-[20rem] rounded-md text-base focus:ring-1 px-3 py-[0.3rem]"
            />
          </div>
          <div>
            <button
              className="mt-16 mb-4 font-semibold text-white inline-block w-[20rem]  py-[0.7rem] bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-[#0478E2] active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                login();
              }}
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
