import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase.config";
import { getDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { storage } from "../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import back from "../images/back.svg";
import bin from "../images/bin.svg";

function AlbumView() {
  let { albumId } = useParams();
  const [album, setAlbum] = useState("");
  const [selected, setSelected] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTags, setSearchTags] = useState([]);
  const [value, setValue] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [category, setCategory] = useState("");
  const [episodeCount, setEpisodeCount] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [tagline, setTagline] = useState("");
  const [cat, setCat] = useState("");
  const [ISBN, setISBN] = useState("");

  const navigate = useNavigate();

  const albumRef = doc(db, "Albums", albumId);

  useEffect(() => {
    getDoc(albumRef).then((doc) => {
      setAlbum(doc.data());
      setImagePreview(doc.data().CoverURL);
      setSearchTags(doc.data().SearchTags);
      setAlbumName(doc.data().AlbumName);
      setAuthorName(doc.data().AuthorName);
      setCategory(doc.data().CategoryID);
      setEpisodeCount(doc.data().EpiCount);
      setPreviewText(doc.data().PreviewText);
      setTagline(doc.data().Tagline);
      setISBN(doc.data().ISBN);
      categorySelector();
    });
  }, []);

  const categorySelector = () => {
    if (category == 0) {
      setCat("Novels");
    } else if (category == 1) {
      setCat("Short Stories");
    } else if (category == 2) {
      setCat("Translation");
    } else if (category == 3) {
      setCat("Other");
    } else {
      setCat("Invalid Category");
    }
  };

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

  const handleAddSearchTag = () => {
    if (value === "" || value === null) {
      ErrMsg("Search tag should not be null");
    } else {
      setSearchTags([...searchTags, value]);
      setValue(null);
      setValue("");
    }
  };

  const handleDelete = (index) => {
    let list = [...searchTags];
    list.splice(index, 1);
    setSearchTags(list);
  };

  var today = new Date();
  // returns year as YY
  var year = today.getFullYear().toString();
  // returns month
  var month = today.getMonth().toString();
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
  const CreateDate = Number(year.substr(2, 3) + month + day);

  const updateAlbum = async (
    newAlbumName,
    newAuthorName,
    newCategory,
    newEpisodeCount,
    newISBN,
    newPreviewText,
    newTagline,
    newSearchTags,
    newCreatedDate
  ) => {
    const albumDoc = doc(db, "Albums", albumId);

    if (selected == "" && imagePreview == null) {
      ErrMsg("Please choose a cover image");
    } else if (selected == "" && imagePreview != "") {
      /* this section handles if the user does not modify the image but other text fields*/
      if (authorName == "") {
        ErrMsg("Please fill the required fields!");
      } else if (albumName == "") {
        ErrMsg("Please fill the required fields!");
      } else if (category == "") {
        ErrMsg("Please select an album category!");
      } else if (episodeCount == "") {
        ErrMsg("Please fill the required fields!");
      } else if(ISBN == ""){
        ErrMsg("Please fill the required fields!");
      }
      else if (previewText == "") {
        ErrMsg("Please fill the required fields!");
      } else if (searchTags == "") {
        ErrMsg("Search Tags must be added!");
      } else if (tagline == "") {
        ErrMsg("Please fill the required fields!");
      } else if (CreateDate == "") {
        ErrMsg("Date Error!");
      } else {
        const newFields = {
          AlbumName: newAlbumName,
          AuthorName: newAuthorName,
          CategoryID: parseInt(newCategory),
          CoverURL: imagePreview,
          CreatedDate: newCreatedDate,
          EpiCount: parseInt(newEpisodeCount),
          ISBN: newISBN,
          PreviewText: newPreviewText,
          SearchTags: newSearchTags,
          Tagline: newTagline,
        };
        await updateDoc(albumDoc, newFields).then(navigate("/"));
      }
    } else if (selected != "" && imagePreview == null) {
      console.log("Something wrong with the image preview");
    } else {
      //handle image upload and then update the document
      const imageRef = ref(storage, `BooksImages/${selected.name}`);
      if (selected == "") {
        ErrMsg("Cover image must be added!");
      } else {
        uploadBytes(imageRef, selected).then(() => {
          getDownloadURL(imageRef).then((url) => {
            if (authorName == "") {
              ErrMsg("Fill the required fields!");
            } else if (url == "") {
              ErrMsg("Cover URL Error!");
            } else if (albumName == "") {
              ErrMsg("Fill the required fields!");
            } else if (category == "") {
              ErrMsg("Please select an album category!");
            } else if (episodeCount == "") {
              ErrMsg("Fill the required fields!");
            } else if (previewText == "") {
              ErrMsg("Fill the required fields!");
            } else if (searchTags == "") {
              ErrMsg("Search Tags must be added!");
            } else if (tagline == "") {
              ErrMsg("Fill the required fields!");
            } else if (CreateDate == "") {
              ErrMsg("Date Error!");
            } else {
              const newFields = {
                AlbumName: newAlbumName,
                AuthorName: newAuthorName,
                CategoryID: newCategory,
                CoverURL: url,
                CreatedDate: newCreatedDate,
                EpiCount: newEpisodeCount,
                PreviewText: newPreviewText,
                SearchTags: newSearchTags,
                Tagline: newTagline,
              };
              updateDoc(albumDoc, newFields).then(navigate("/"));
            }
          });
        });
      }
    }
  };

  const deleteAlbum = async () => {
    const albumDoc = doc(db, "Albums", albumId);
    deleteDoc(albumDoc).then(navigate("/"));
  };

  console.log(album);


  const displayCategory = (cat) =>{
    if(cat === '0'){
      return("Novels")
    }else if(cat === '1'){
      return("Short Stories")
    }else if(cat == '2'){
      return("Translation")
    }else if(cat == '3'){
      return("Other")
    }
  }

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
                Edit Album
              </h2>
            </div>
          </div>
          {albumName ? (
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
                    className="mt-4 inline-block px-6 py-2.5 bg-red-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
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
                  defaultValue={albumName}
                  onChange={(e) => setAlbumName(e.target.value)}
                  className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
                />
                <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                  Author Name
                </p>
                <input
                  type="text"
                  defaultValue={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md text-base focus:ring-1 px-3 py-1"
                />
                <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                  Category
                </p>
                <select
                  defaultValue={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 px-3 py-1 bg-white border border-slate-300 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block lg:w-[25rem] sm:w-[25rem] rounded-md focus:ring-1"
                >
                  <option value={category.toString()} disabled selected hidden>
                  {displayCategory(category.toString())}
                  </option>
                  <option value="0">Novels</option>
                  <option value="1">Short Stories</option>
                  <option value="2">Translation</option>
                  <option value="3">Other</option>
                </select>
                <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-8 ">
                  Episode Count
                </p>
                <input
                  defaultValue={episodeCount}
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
                  defaultValue={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className=" border-2 w-[48rem] rounded-md h-20 py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
                />
                <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-9 ">
                  Tagline
                </p>
                <textarea
                  defaultValue={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className=" border-2 w-[48rem] rounded-md h-20 py-1 px-2 resize-none mt-1 outline-0 focus:border-sky-500 focus:ring-sky-500 "
                />
                <div className="flex flex-row items-end gap-4 mt-[-1rem]">
                  <div>
                    <p className="after:content-['*'] after:ml-0.5 after:text-red-500 capitalize text-base text-slate-700 text-sm mb-1 mt-14 ">
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
                    className="mt-4 inline-block px-6 py-2.5 bg-[#0085FF] text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out h-9"
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
                  className="mt-4 mr-4 mb-8 font-bold text-white inline-block px-10 py-3 bg-red-500 leading-tight rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => {
                    confirmAlert({
                      message:
                        "Are you sure to delete this album? This action cannot be undone later.",
                      buttons: [
                        {
                          label: "Yes",
                          onClick: () => {
                            deleteAlbum();
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
                      message: "Are you sure to update this album?",
                      buttons: [
                        {
                          label: "Yes",
                          onClick: () => {
                            updateAlbum(
                              albumName,
                              authorName,
                              category,
                              episodeCount,
                              ISBN,
                              previewText,
                              tagline,
                              searchTags,
                              CreateDate
                            );
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

export default AlbumView;
