import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert";
import { db } from "../firebase.config";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";

import "react-confirm-alert/src/react-confirm-alert.css";
import back from "../images/back.svg";

/**
 * This functional component is responsible fot adding a new episode to an album
 */
function AddEpisode() {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const episodeCollectionRef = collection(db, "Episodes");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  var today = new Date();
  // returns year as YY
  var year = today.getFullYear().toString();
  // returns month
  var month;
  var month = parseInt(today.getMonth().toString());
  month = month + 1;
  month = month.toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  // returns day
  var day = today.getDate().toString();
  if (day.length == 1) {
    day = "0" + day;
  }
  // returns hours
  var hours = today.getHours().toString();
  if (hours.length == 1) {
    hours = "0" + hours;
  }
  // returns minutes
  var minutes = today.getMinutes().toString();
  if (minutes.length == 1) {
    minutes = "0" + minutes;
  }
  // returns seconds
  var seconds = today.getSeconds().toString();
  if (seconds.length == 1) {
    seconds = "0" + seconds;
  }
  // returns formatted date
  var formatedDate =
    year.substr(2, 3) + month + day + "." + hours + minutes + seconds;
  const EpisodeId = parseFloat(formatedDate);
  const CreateDate = Number(year.substr(2, 3) + month + day);

  // Handles error notification toast message
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

  // Handles adding a new episode to an album
  const saveEpisode = async () => {
    if (title === "") {
      ErrMsg("Please fill the required fields!");
    } else if (content === "") {
      ErrMsg("Please fill the required fields!");
    } else {
      const data = {
        AlbumID: parseFloat(albumId),
        Content: content,
        CreatedDate: CreateDate,
        EpiID: EpisodeId,
        Title: title,
      };

      await setDoc(doc(db, "Episodes", `${EpisodeId}`), data)
        .then(navigate("/"))
        .then(navigate("/episodes/" + albumId));
    }
  };

  return (
    <div className="bg-[#F9F9F9] w-screen h-screen grid grid-cols-12">
      <div className="">
        <Sidebar status="episode" />
      </div>
      <div className="col-span-11 mx-auto my-auto">
        <ToastContainer />
        <div className="grid grid-cols-12 grid-rows-6 bg-white w-[65rem] h-[48rem] mt-[2rem] rounded-2xl drop-shadow-2xl">
          <div className="col-span-12">
            <div className="flex flex-row items-end ml-8">
              <img
                className="cursor-pointer"
                src={back}
                alt="back"
                onClick={() => {
                  navigate(-1);
                }}
              />
              <h2 className="pb-[2px] font-semibold text-4xl ml-6 mt-8">
                Episodes
              </h2>
            </div>
          </div>

          <div className="col-start-2 col-span-10 grid grid-cols-12 border-2 border-[#E2E8F0] rounded-lg h-[36rem] overflow-y-auto">
            <div className="col-start-1 col-span-12 ml-12">
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-9 ">
                Episode Title
              </p>
              <input
                type="text"
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
              />
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                Content
              </p>
              <textarea
                onChange={(e) => setContent(e.target.value)}
                className="border-2 w-[48rem] rounded-md h-[20rem] py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
              />
              <button
                className="mt-4 mb-8 font-bold text-white inline-block px-10 py-3 bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  confirmAlert({
                    message: "Are you sure to save this episode?",
                    buttons: [
                      {
                        label: "Yes",
                        onClick: () => {
                          saveEpisode();
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
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEpisode;
