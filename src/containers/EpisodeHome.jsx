import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { db } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { async } from "@firebase/util";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";

function EpisodeHome() {
  const albumCollectionRef = collection(db, "Albums");

  const [albums, setAlbums] = useState([]);
  const [loader, setloader] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const getAlbums = async () => {
      const data = await getDocs(albumCollectionRef);
      setAlbums(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      setloader("a");
    };

    getAlbums();
  }, []);

  return (
    <div className="bg-[#F9F9F9] w-screen h-screen grid grid-cols-12">
      <div className="">
        <Sidebar status="episode" />
      </div>
      <div className="col-span-11 mx-auto my-auto">
        <div className="grid grid-cols-12 grid-rows-6 bg-white w-[65rem] h-[40rem] mt-[2rem] rounded-2xl drop-shadow-2xl">
          <div className="col-span-12">
            <h2 className="font-semibold text-4xl ml-6 mt-6">Albums</h2>
          </div>
          <div className="row-span-5 my-auto">
            <div className="h-full w-full">
              <div className="mx-auto w-[65rem]  mt-0 h-[33rem]">
                <div className="overflow-auto h-[26rem] mx-16 mt-5">
                  <table className="border-collapse w-full ">
                    <thead>
                      <tr>
                        <th className="py-2 px-2 uppercase bg-white text-left sticky top-0 z-1">
                          name
                        </th>
                        <th className="py-2 px-2 uppercase bg-white text-left sticky top-0 z-1">
                          author
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loader == "a" ? (
                        albums.map((album) => {
                          return (
                            <tr
                              className="even:bg-white odd:bg-slate-100 cursor-pointer"
                              onClick={() => {
                                navigate("/episodes/" + album.AlbumID);
                              }}
                            >
                              <td className=" py-2 px-2">{album.AlbumName}</td>
                              <td className=" py-2 px-2">{album.AuthorName}</td>
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

export default EpisodeHome;
