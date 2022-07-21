import React from "react";
import { useNavigate } from "react-router-dom";
import album from "../images/albums.svg";
import episodes from "../images/episodes.svg";
import notifications from "../images/notifications.svg";
import logout from "../images/logout.svg";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

/*
 * This is sidebar of the admin pannel
 */
function Sidebar({ status }) {
  const navigate = useNavigate();

  // this function handles logging out of a user
  const handleLogout = () => {
    confirmAlert({
      message: "Are you sure to logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            window.localStorage.clear();
            window.location.reload(false);
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  /* This function is responsible for showing the active tab with a white background color */
  const activeTab = (status) => {
    if (status == "album") {
      return (
        <div className="flex flex-col gap-[1px] list-none w-full items-center">
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl  bg-slate-300 hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <div>
              <img src={album} alt="albums" />
            </div>
          </li>
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/episodes");
            }}
          >
            <img src={episodes} alt="episodes" />
          </li>
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/notifications");
            }}
          >
            <img src={notifications} alt="notifications" />
          </li>
        </div>
      );
    } else if (status == "episode") {
      return (
        <div className="flex flex-col gap-[1px] list-none w-full items-center">
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl  hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <div>
              <img src={album} alt="albums" />
            </div>
          </li>
          <li
            className="bg-slate-300 w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/episodes");
            }}
          >
            <img src={episodes} alt="episodes" />
          </li>
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/notifications");
            }}
          >
            <img src={notifications} alt="notifications" />
          </li>
        </div>
      );
    } else if (status == "notification") {
      return (
        <div className="flex flex-col gap-[1px] list-none w-full items-center">
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl  hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <div>
              <img src={album} alt="albums" />
            </div>
          </li>
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/episodes");
            }}
          >
            <img src={episodes} alt="episodes" />
          </li>
          <li
            className="bg-slate-300 w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/notifications");
            }}
          >
            <img src={notifications} alt="notifications" />
          </li>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-[1px] list-none w-full items-center">
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl  hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            <div>
              <img src={album} alt="albums" />
            </div>
          </li>
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/episodes");
            }}
          >
            <img src={episodes} alt="episodes" />
          </li>
          <li
            className="w-full h-12 items-center flex justify-center rounded-r-xl   hover:bg-slate-200 cursor-pointer"
            onClick={() => {
              navigate("/notifications");
            }}
          >
            <img src={notifications} alt="notifications" />
          </li>
        </div>
      );
    }
  };
  return (
    <div>
      <div className="flex flex-col bg-white h-screen items-center pt-12 rounded-r-2xl justify-between pb-12">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/prototype-storyflix.appspot.com/o/web%2Flogo.svg?alt=media&token=99810c96-a9bc-4751-bcfb-f5649835c285"
          alt="logo"
          className="w-10"
        />

        {activeTab(status)}

        <div>
          <img
            src={logout}
            alt="logout"
            className="cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
