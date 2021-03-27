import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import axios, { AxiosRequestConfig } from "axios";
import NavBar from "./NavBar";
import { useForm } from "react-hook-form";
import { isObjectBindingPattern } from "typescript";

function DashboardClient() {
  const history = useHistory();
  const [timeslot, setTimeslot] = useState<any[]>([]);
  const [selectSlot, setSelectSlot] = useState<any>();
  const [add, setAdd] = useState<any>();
  const [worker, setWorker] = useState<any[]>([]);
  const [hire, setHireTime] = useState<any[]>([]);
  const [workernearby, setWorkernearby] = useState<any[]>([]);
  const { register, handleSubmit, errors } = useForm({
    criteriaMode: "all",
  });

  const time = (data: any) => {
    axios
      .get(`http://localhost:5000/api/worker/post/${data}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setTimeslot(response.data.timeslots);
      });
  };

  const timeslotSubmit = (e: any) => {
    e.preventDefault();
    var slotArray = selectSlot.split("+");
    const selectedSlot = {
      start: { startTime: slotArray[0], startFormat: slotArray[1] },
      end: { endTime: slotArray[2], endFormat: slotArray[3] },
    };
    var selected = new Array();
    var time = document.getElementById("timeslot");

    if (time) {
      var ticks = time.getElementsByTagName("input");

      for (var i = 0; i < ticks.length; i++) {
        if (ticks[i].checked) {
          selected.push(ticks[i].value);
        }
      }
    }
    let config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const timeslotData: any = {
      timeslots: selectedSlot,
      accepted: false,
      workerId: add.workerId,
      services: add.services,
      pay: add.pay,
    };

    axios
      .post("http://localhost:5000/api/worker/request", timeslotData, config)
      .then((response) => {
        console.log(response);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/nearby", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setWorkernearby(response.data);
      });
  }, []);

  const filterData: any = {
    services: [],
  };

  useEffect(() => {
    axios
      .post("http://localhost:5000/api/worker/filter", filterData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data);
        setWorker(response.data);
      });
  }, []);

  const filterServiceSubmit = (data: any) => {
    var selected = new Array();
    var service = document.getElementById("service");

    if (service) {
      var ticks = service.getElementsByTagName("input");

      for (var i = 0; i < ticks.length; i++) {
        if (ticks[i].checked) {
          selected.push(ticks[i].value);
        }
      }
    }

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const filterData: any = {
      services: selected,
    };
    console.log(filterData);
    axios
      .post("http://localhost:5000/api/worker/filter", filterData, config)
      .then((response) => {
        setWorker(response.data);
      });
  };

  return (
    <div>
      {Cookies.get("user") ? (
        <div className="w-full bg-gray-300 h-full flex flex-col">
          <NavBar />
          <div className="w-full  h-full flex justify-center">
            <div className="w-1/5 px-7 py-7 font-bold  bg-gray-200 shadow-2xl rounded-2xl h-full mr-5 mt-5">
              <div className="mb-3">Select the service: </div>
              <div className="mb-5">
                <form onSubmit={handleSubmit(filterServiceSubmit)} id="service">
                  <div className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="Search"
                      className="mt-1 mb-5 h-8 px-2 py-2 block w-full shadow-sm text-black sm:text-sm bg-gray-300 rounded-md"
                    ></input>
                    <input
                      className="cursor-pointer h-7 w-12 flex ml-3 mb-4 shadow-lg justify-center items-center px-3 p-b-3 border border-transparent text-xs rounded-md text-white bg-gray-600 hover:bg-grey-900"
                      type="submit"
                    />
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      name="plumber"
                      type="radio"
                      value="Plumber"
                      ref={register}
                      className="focus:ring-gray-800 h-3 w-3 text-gray-800 border-gray-300 mr-5"
                    />
                    <label>Plumber</label>
                  </div>

                  <div className="flex items-center mb-2">
                    <input
                      name="Chef"
                      type="radio"
                      value="chef"
                      ref={register}
                      className="focus:ring-gray-800 h-3 w-3 text-gray-800 border-gray-300 mr-5"
                    />
                    <label>Chef</label>
                  </div>

                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="Driver"
                      value="Driver"
                      ref={register}
                      className="focus:ring-gray-800 h-3 w-3 text-gray-800 border-gray-300 mr-5"
                    />
                    <label>Driver</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="Cleaning"
                      value="cleaning"
                      ref={register}
                      className="focus:ring-gray-800 h-3 w-3 text-gray-800 border-gray-300 mr-5"
                    />
                    <label>Cleaning</label>
                  </div>
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="Carpenter"
                      value="carpenter"
                      ref={register}
                      className="focus:ring-gray-800 text-gray-800 border-gray-300 mr-5"
                    />
                    <label>Carpenter</label>
                  </div>
                </form>
              </div>
              Selected workers:
              {/* {hiredworker.map((obj) => ( */}
              <div className="flex px-5 py-5 bg-indigo-100 rounded-xl mt-6 w-full h-full hover:bg-indigo-200 shadow-inner">
                <div className="flex flex-col float-left">Thala</div>
                <a className="flex flex-col float-right ml-24 mt-2 cursor-pointer">
                  <i className="far fa-comments"></i>
                </a>
              </div>
              {/* ))} */}
            </div>

            <div className="w-1/2 h-full mr-4">
              {worker.map((obj) => (
                <form onSubmit={timeslotSubmit} id="timeslot">
                  <div
                    className="flex justify-between cursor-pointer bg-indigo-50 ml-6 mt-8 w-11/12 shadow-inner sm:rounded-2xl border-b-4 
               border-green-800 
               transition duration-300 ease-in-out hover:scale-y-125 hover:bg-indigo-100
               "
                  >
                    {" "}
                    <img
                      className="h-8 w-8 ml-6 mt-7 rounded-b-full"
                      src="https://images.unsplash.com/photo-1521710696740-c8144a7eaf88?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                      alt=""
                    ></img>
                    <h1 className="ml-5 mt-6 mr-5 font-display text-xl text-green-800">
                      {obj.user.username}
                    </h1>
                    <p className="flex-row mt-16 mr-5 -ml-12 font-display text-sm font-bold text-green-800">
                      Age{obj.user.age}
                    </p>
                    <div className="flex-col">
                      <p className="ml-1 mt-9 mr-2 mb-3 font-display text-mg text-green-800">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Odit repellat quas velit.
                      </p>
                      <div className="text-xs flex">
                        {obj.services.map((item: any) => (
                          <p
                            className="mt-2 mr-2 bg-gray-700 text-white shadow-2xl p-2 rounded-full text-xs flex-row 
                        hover:scale-125"
                          >
                            {item}
                          </p>
                        ))}
                      </div>
                      <div className="text-xs flex">
                        {obj.timeslots.map((time: any) => (
                          <div className="flex-row mb-2">
                            <input
                              className="mr-20"
                              type="radio"
                              name="time"
                              value={`${time.start.startTime} + ${time.start.startFormat} + ${time.end.endTime} + ${time.end.endFormat}`}
                              onChange={(e) => setSelectSlot(e.target.value)}
                            />
                            <div className="flex flex-row bg-gray-400 p-2 rounded-full text-xs">
                              <p>{time.start.startTime} </p>
                              <p>{time.start.startFormat}</p> -
                              <p>{time.end.endTime}</p>
                              <p>{time.end.endFormat}</p>
                            </div>
                          </div>
                        ))}
                        <input
                          type="submit"
                          onClick={() =>
                            setAdd({
                              pay: obj.pay,
                              services: obj.services,
                              workerId: obj.user._id,
                            })
                          }
                        />
                      </div>
                    </div>
                    <a className="ml-2 -mr-10 mt-12 w-12 h-12 px-5 py-5 shadow-lg flex items-center justify-center rounded-full bg-green-300 hover:bg-green-500">
                      <i className="far fa-comments"></i>
                    </a>
                    <p className="flex mt-28 mr-5 font-cursive text-xl text-green-800">
                      <b>₹{obj.pay}</b>
                    </p>
                  </div>
                </form>
              ))}
            </div>

            <div className="bg-gray-200 shadow-2xl rounded-2xl h-full mt-5">
              <div className="font-bold text-black text-lg px-5 py-7">
                Workers Near By:
                {workernearby.map((obj) => (
                  <div className="flex px-5 py-2 bg-indigo-100 rounded-xl mt-6 w-full hover:bg-indigo-200 shadow-inner">
                    <div className="text-sm">
                      <div className="text-sm flex-col">
                        {obj.user.username}
                      </div>
                      <div className="text-xs flex-row">₹{obj.pay}</div>
                      <div className="text-xs flex">
                        {obj.services.map((item: any) => (
                          <p className="mt-2 mr-2 bg-gray-400 p-2 rounded-full text-xs flex-row">
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center h-screen">
          <div className="bg-red-600 rounded-lg flex items-center flex-col justify-center w-1/2 h-1/3">
            <h1 className="text-yellow-300 text-xl">
              You are not Authenticated ma{" "}
            </h1>
            <h3 className="text-yellow-300 text-xl">Go back</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardClient;
