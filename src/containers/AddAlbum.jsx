import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../components/Sidebar";
import back from "../images/back.svg";
import bin from "../images/bin.svg";
import { storage } from "../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";

/**
 * This functional component handles adding albums
 */
function AddAlbum() {
  // Firestore collection reference
  const albumCollectionRef = collection(db, "Albums");

  // This useNavigate uses to naviagate between other components
  const navigate = useNavigate();

  const [selected, setSelected] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // This handles adding an image after clicking "Choose Cover"
  const handleImageChange = (e) => {
    const selected = e.target.files[0];
    setSelected(selected);
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    if (selected && ALLOWED_TYPES.includes(selected.type)) {
      let reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selected);
    } else {
      errNotify();
    }
  };

  const [searchTags, setSearchTags] = useState([]);
  const [value, setValue] = useState(null);

  const [albumName, setAlbumName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("");
  const [episodeCount, setEpisodeCount] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [tagline, setTagline] = useState("");
  const [ISBN, setISBN] = useState("");

  /************************ Generating an Album ID ************************/
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
  const AlbumID = parseFloat(formatedDate);
  const CreateDate = Number(year.substr(2, 3) + month + day);

  // Handles adding a search tag after clicking "add"
  const handleAddSearchTag = () => {
    if (value === "" || value === null) {
      ErrMsg("Search tag should not be null");
    } else {
      setSearchTags([...searchTags, value]);
      setValue(null);
      setValue("");
    }
  };

  // Handles removing a search tag after clicking the bin icon in the added search tag list
  const handleDelete = (index) => {
    let list = [...searchTags];
    list.splice(index, 1);
    setSearchTags(list);
  };

  // Handles error notification toasts
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

  // Handles adding a new Album after clicking "Add New"
  const handleAddNew = () => {
    const imageRef = ref(storage, `BooksImages/${selected.name}`);
    if (selected == "") {
      ErrMsg("Cover image must be added!");
    } else if (AlbumID == 0) {
      ErrMsg("Album ID Error!");
    } else if (authorName == "") {
      ErrMsg("Fill the required fields!");
    } else if (albumName == "") {
      ErrMsg("Fill the required fields!");
    } else if (category == "") {
      ErrMsg("Fill the required fields!");
    } else if(ISBN == ""){
      ErrMsg("Fill the required fields!");
    }
    else if (previewText == "") {
      ErrMsg("Fill the required fields!");
    } else if (searchTags == "") {
      ErrMsg("Search Tags must be added!");
    } else if (tagline == "") {
      ErrMsg("Fill the required fields!");
    } else if (CreateDate == "") {
      ErrMsg("Date Error!");
    } else {
      notify();
      uploadBytes(imageRef, selected).then(() => {
        getDownloadURL(imageRef).then((url) => {
          SendData(url);
        });
      });
    }
  };

  // Handles success notification toast
  const notify = () =>
    toast.success("🤩 Album is saving....", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  // Handles sending Album details to firestore collection
  const SendData = async (url) => {
    if (url == "") {
      ErrMsg("Cover URL Error!");
    } else {
      const data = {
        AlbumID: AlbumID,
        AuthorName: authorName,
        CoverURL: url,
        AlbumName: albumName,
        CategoryID: parseInt(category),
        EpiCount: parseInt(episodeCount),
        PreviewText: previewText,
        SearchTags: searchTags,
        Tagline: tagline,
        CreatedDate: CreateDate,
        ViewCount: 0,
        ISBN : ISBN
      };
      await setDoc(doc(db, "Albums", `${AlbumID}`), data).then(navigate("/"));
    }
  };

  // Handles the error toast of adding an unsupported file format to album cover
  const errNotify = () =>
    toast.error("File format not supported!", {
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
        <Sidebar status="album" />
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
                  navigate("/");
                }}
              />
              <h2 className="pb-[2px] font-semibold text-4xl ml-6 mt-8">
                Albums
              </h2>
            </div>
          </div>
          <div className="col-start-2 col-span-10 grid grid-cols-12 border-2 border-[#E2E8F0] rounded-lg h-[36rem] overflow-y-auto">
            <div className="col-start-2 col-span-4 text-center">
              <div
                className="w-[320px] h-[450px] bg-slate-200 mx-auto rounded-lg mt-10 drop-shadow-md flex items-center justify-center"
                style={{
                  background: imagePreview
                    ? `url('${imagePreview}')no-repeat center/cover`
                    : "#D9D9D9",
                }}
              >
                {!imagePreview && (
                  <>
                    <label
                      htmlFor="fileUpload"
                      className="cursor-pointer text-black font-semibold text-sm text-center py-[100px] px-[45px]"
                    >
                      Choose Cover
                    </label>
                    <input
                      type="file"
                      id="fileUpload"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                    />
                  </>
                )}
              </div>
              {imagePreview && (
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setSelected("");
                  }}
                  className="mt-4 inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                  remove
                </button>
              )}
            </div>
            <div className="col-start-7 col-span-5">
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-10 ">
                Album Name
              </p>
              <input
                type="text"
                onChange={(e) => setAlbumName(e.target.value)}
                className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
              />
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                Author Name
              </p>
              <input
                type="text"
                onChange={(e) => setAuthorName(e.target.value)}
                className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
              />
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 px-3 py-1 bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md focus:ring-1"
              >
                <option value="" disabled selected hidden></option>
                <option value="0">Novels</option>
                <option value="1">Short Stories</option>
                <option value="2">Translation</option>
                <option value="3">Other</option>
              </select>
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                Episode Count
              </p>
              <input
                type="number"
                onChange={(e) => setEpisodeCount(e.target.value)}
                className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
              />
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                  ISBN
                </p>
                <input
                  defaultValue={ISBN}
                  type="text"
                  onChange={(e) => setISBN(e.target.value)}
                  className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
                />
            </div>
            <div className="col-start-2 col-span-10">
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-9 ">
                Preview Text
              </p>
              <textarea
                onChange={(e) => setPreviewText(e.target.value)}
                className=" border-2 w-[48rem] rounded-md h-20 py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
              />
              <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-9 ">
                Tagline
              </p>
              <textarea
                onChange={(e) => setTagline(e.target.value)}
                className=" border-2 w-[48rem] rounded-md h-20 py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
              />
              <div className="flex flex-row items-center gap-4 mt-[1rem]">
                <div>
                  <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 ">
                    Search Tags
                  </p>
                  <input
                    value={value}
                    type="text"
                    onChange={(e) => setValue(e.target.value)}
                    className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
                  />
                </div>
                <button
                  className="mt-[2.4rem] mr-4 mb-[1rem] font-bold text-white inline-block px-8 py-2 bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800  active:shadow-lg transition duration-150 ease-in-out"
                  onClick={handleAddSearchTag}
                >
                  add
                </button>
              </div>
              <div className="h-36 w-96 bg-slate-200 rounded-lg mt-2 mb-4 overflow-y-auto">
                {searchTags.map((object, index) => (
                  <div className="flex flex-row justify-between mt-2">
                    <h2 className="ml-4">{object}</h2>
                    <button
                      className="mr-4 mb-4"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      <img src={bin} alt="bin" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 mb-8 font-bold text-white inline-block px-10 py-3 bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  handleAddNew();
                }}
              >
                Add New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddAlbum;
