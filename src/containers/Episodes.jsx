import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase.config";
import { collection, getDocs, query, where } from "firebase/firestore";
import ReactLoading from "react-loading";

function Episodes() {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const id = parseFloat(albumId);
  const [episodes, setEpisodes] = useState([]);
  const [loader, setloader] = useState("");

  const episodesRef = collection(db, "Episodes");
  const q = query(episodesRef, where("AlbumID", "==", id));

  useEffect(() => {
    const getEpisodes = async () => {
      const data = await getDocs(q);
      setEpisodes(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      setloader("a");
    };

    getEpisodes();
  }, []);

  return (
    <div className="bg-[#F9F9F9] w-screen h-screen grid grid-cols-12">
      <div className="">
        <Sidebar status="episode" />
      </div>
      <div className="col-span-11 mx-auto my-auto">
        <button
          className="mt-[1rem] ml-[55rem] font-bold text-white inline-block px-10 py-3 bg-[#0085FF] leading-tight rounded shadow-md hover:bg-[#017CED] hover:shadow-lg focus:bg-[#0478E2] focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          onClick={() => {
            navigate("/episode/create/" + albumId);
          }}
        >
          Add New
        </button>
        <div className="grid grid-cols-12 grid-rows-6 bg-white w-[65rem] h-[38rem] mt-[2rem] rounded-2xl drop-shadow-2xl">
          <div className="col-span-12">
            <h2 className="font-semibold text-4xl ml-6 mt-8">Episodes</h2>
          </div>
          <div className="row-span-5 my-auto">
            <div className="h-full w-full">
              <div className="mx-auto w-[65rem]  mt-0 h-[33rem]">
                <div className="overflow-auto h-[25rem] mx-16 mt-5">
                  <table className="border-collapse w-full ">
                    <thead>
                      <tr>
                        <th className="py-2 px-2 uppercase bg-white text-left sticky top-0 z-1">
                          id
                        </th>
                        <th className="py-2 px-2 uppercase bg-white text-left sticky top-0 z-1">
                          title
                        </th>
                        <th className="py-2 px-2 uppercase bg-white text-left sticky top-0 z-1">
                          date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loader == "a" ? (
                        episodes.map((epi) => {
                          let date = epi.CreatedDate.toString();
                          let yy = date.slice(0, 2);
                          let mm = date.slice(2, 4);
                          let dd = date.slice(4, 6);
                          date = yy + "/" + mm + "/" + dd;
                          return (
                            <tr
                              className="even:bg-white odd:bg-slate-100 cursor-pointer"
                              onClick={() => {
                                navigate("/episode/" + epi.id);
                              }}
                            >
                              <td className=" py-2 px-2">{epi.EpiID}</td>
                              <td className=" py-2 px-2">{epi.Title}</td>
                              <td className=" py-2 px-2">{date}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <>
                          <tr>
                            <td className=" py-2 px-2">
                              <ReactLoading
                                type="cylon"
                                color="#333333"
                                height={100}
                                width={50}
                              />
                            </td>
                            <td className=" py-2 px-2">
                              <ReactLoading
                                type="cylon"
                                color="#333333"
                                height={100}
                                width={50}
                              />
                            </td>
                            <td className=" py-2 px-2">
                              <ReactLoading
                                type="cylon"
                                color="#333333"
                                height={100}
                                width={50}
                              />
                            </td>
                            <td className=" py-2 px-2">
                              <ReactLoading
                                type="cylon"
                                color="#333333"
                                height={100}
                                width={50}
                              />
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Episodes;
