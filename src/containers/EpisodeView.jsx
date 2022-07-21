import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import { confirmAlert } from "react-confirm-alert";
import { db } from "../firebase.config";
import { getDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

import "react-confirm-alert/src/react-confirm-alert.css";
import back from "../images/back.svg";

function EpisodeView() {
  const { epiID } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [EpisodeID, setEpisodeID] = useState("");
  const epiRef = doc(db, "Episodes", epiID);

  useEffect(() => {
    getDoc(epiRef).then((doc) => {
      setEpisode(doc.data());
      setTitle(doc.data().Title);
      setContent(doc.data().Content);
      setEpisodeID(doc.data().AlbumID);
    });
  }, []);

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

  const updateEpisode = async (newTitle, newContent) => {
    const episodeDoc = doc(db, "Episodes", epiID);
    const newFields = {
      Title: newTitle,
      Content: newContent,
    };

    if (title === "") {
      ErrMsg("Please fill the required fields!");
    } else if (content === "") {
      ErrMsg("Please fill the required fields!");
    } else {
      await updateDoc(episodeDoc, newFields).then(
        navigate("/episodes/" + EpisodeID)
      );
    }
  };

  const deleteEpisode = async () => {
    const episodeDoc = doc(db, "Episodes", epiID);
    await deleteDoc(episodeDoc).then(navigate("/episodes/" + EpisodeID));
  };

  return (
    <div className="bg-[#F9F9F9] w-screen h-screen grid grid-cols-12">
      <div className="">
        <Sidebar status="episode" />
      </div>
      <div className="col-span-11 mx-auto my-auto">
        <ToastContainer />
        <div className="grid grid-cols-12 grid-rows-6 bg-white w-[65rem] h-[48rem]  rounded-2xl drop-shadow-2xl">
          <div className="col-span-12">
            <div className="flex flex-row items-end ml-8">
              <img
                className="cursor-pointer"
                src={back}
                alt="back"
                onClick={() => {
                  navigate("/episodes/" + EpisodeID);
                }}
              />
              <h2 className="pb-[2px] font-semibold text-4xl ml-6 mt-8">
                Episodes
              </h2>
            </div>
          </div>
          {episode.AlbumID ? (
            <div className="col-start-2 col-span-10 grid grid-cols-12 border-2 border-[#E2E8F0] rounded-lg h-[36rem] overflow-y-auto">
              <div className="col-start-1 col-span-12 ml-12">
                <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-9 ">
                  Episode Title
                </p>
                <input
                  defaultValue={title}
                  type="text"
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
                />
                <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                  Content
                </p>
                <textarea
                  defaultValue={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="border-2 w-[48rem] rounded-md h-[20rem] py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
                />
                <button
                  className="mt-4 mr-4 mb-8 font-bold text-white inline-block px-10 py-3 bg-red-500 leading-tight rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => {
                    confirmAlert({
                      message:
                        "Are you sure to delete this episode? This action cannot be undone later.",
                      buttons: [
                        {
                          label: "Yes",
                          onClick: () => {
                            deleteEpisode();
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
                  Delete
                </button>
                <button
                  className="mt-4 mb-8 font-bold text-white inline-block px-10 py-3 bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => {
                    confirmAlert({
                      message: "Are you sure to update this episode?",
                      buttons: [
                        {
                          label: "Yes",
                          onClick: () => {
                            updateEpisode(title, content);
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
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div className="col-start-2 col-span-10 flex justify-center	pt-[10rem] border-2 border-[#E2E8F0] rounded-lg h-[36rem] ">
              <ReactLoading
                type="spinningBubbles"
                color="#333333"
                height={567}
                width={275}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EpisodeView;
