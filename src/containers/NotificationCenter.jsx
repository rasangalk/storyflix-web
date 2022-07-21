import React from "react";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import { useState } from "react";

function NotificationCenter() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

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

  const handleSend = () => {
    if (title === "") {
      ErrMsg("Please fill the required fields!");
    } else if (body === "") {
      ErrMsg("Please fill the required fields!");
    } else {
      notify();
      setTitle("");
      setBody("");
    }
  };

  // Handles success toast message
  const notify = () =>
    toast.success("🤩 Notification sent....", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  return (
    <div className="bg-[#F9F9F9] w-screen h-screen grid grid-cols-12">
      <div className="">
        <Sidebar status="notification" />
      </div>
      <div className="col-span-11 mx-auto my-auto">
        <ToastContainer />
        <div className="grid grid-cols-12 grid-rows-6 bg-white w-[65rem] h-[38rem] mt-[2rem] rounded-2xl drop-shadow-2xl">
          <div className="col-span-12">
            <div className="flex flex-row items-end ml-8">
              <h2 className="pb-[2px] font-semibold text-4xl ml-6 mt-8">
                Notification Center
              </h2>
            </div>
          </div>

          <div className="mt-12 col-start-2 col-span-10 grid grid-cols-12 border-2 border-[#E2E8F0] rounded-lg h-[22rem] overflow-y-auto">
            <div className="col-start-1 col-span-12 ml-12">
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-9 ">
                Notification Title
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
              />
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                Notification Body
              </p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="border-2 w-[48rem] rounded-md h-[5rem] py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
              />

              <button
                className="mt-8 mb-4 font-bold text-white inline-block px-10 py-3 bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  confirmAlert({
                    message: "Are you sure to send this notification?",
                    buttons: [
                      {
                        label: "Yes",
                        onClick: () => {
                          handleSend();
                        },
                      },
                      {
                        label: "No",
                        onClick: () => {},
                      },
                    ],
                  });
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationCenter;
