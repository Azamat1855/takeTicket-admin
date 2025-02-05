import React, { useState, useEffect } from "react";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import useApiRequest from "../../../hooks/useApiRequest";
import { Header } from "../../../Components/";
import { MdAlarmAdd } from "react-icons/md";


const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const { sendRequest } = useApiRequest();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    sendRequest(`${"API_URL"}/events`, "GET").then((response) => {
      if (response) setEvents(response);
    })
  }, [sendRequest, API_URL]);

  const onActionComplete = (args) => {
    if (["eventCreated", "eventChanged"].includes(args.requestType)) {
      const newEvents = Array.isArray(args.data) ? args.data : [args.data];

      setEvents((prevEvents) => [...prevEvents, ...newEvents]);
      newEvents.forEach((event) => {
        sendRequest(`${API_URL}/events`, "POST", event);
      });
    }
  };


  const openModal = () => document.getElementById("my_modal_2").showModal();
  const closeModal = () => document.getElementById("my_modal_2").close();
  const saveModal = () => document.getElementById("my_modal_2")

  return (
    <div className=" md:m-4 p-2 md:p-10 ">
      <Header />
      <div className="flex flex-wrap items-center justify-between">
        <p className="text-accent p-2 font-bold text-3xl">Send Date</p>
        <button className="btn btn-accent" onClick={openModal}>
          <MdAlarmAdd />
          Add Date
        </button>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-accent w-full max-w-2xl rounded-2xl h-[80vh] overflow-auto flex flex-col gap-2">
            <div className="p-5">
              <p className="font-bold text-3xl text-base-100">Konsert kunlarini qoshish:</p>
            </div>
            <ScheduleComponent
              height="100%"
              width="100%"
              eventSettings={{ dataSource: events }}
              selectedDate={new Date(2024, 0, 10)}
              actionComplete={onActionComplete}
            >
              <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
            </ScheduleComponent>
            <div className="flex justify-end items-end gap-2">
              <button className="btn btn-error mt-4 w-[18%]" onClick={closeModal}>Close</button>
              <button className="btn btn-warning mt-4 w-[18%]" onClick={saveModal}>Save Modal</button>
            </div>
          </div>
        </dialog>
      </div>
      <div>
      <div className="mt-5">
  <table id="table" className="w-full">
    <thead>
      <tr className="bg-success">
        <th>#</th>
        <th>Subject</th>
        <th>Location</th>
        <th>Start Time</th>
      </tr>
    </thead>
    <tbody>
      {events.map((event, index) => (
        <tr key={event.Id} className=" border">
          <th>{index + 1}</th>
          <td>{event.Subject}</td>
          <td>{event.Location || "Noma'lum"}</td>
          <td>{new Date(event.StartTime).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      </div>
    </div>
  );
};

export default EventsTable;
