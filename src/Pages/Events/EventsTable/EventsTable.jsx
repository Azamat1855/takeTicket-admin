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
import { IoIosSend } from "react-icons/io";

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const { sendRequest } = useApiRequest();
  const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    sendRequest(API_URL, "GET").then((response) => {
      if (response) setEvents(response);
    });
  }, [sendRequest, API_URL]);

  const onActionComplete = (args) => {
    if (["eventCreated", "eventChanged", "eventRemoved"].includes(args.requestType)) {
      let updatedEvents = [];

      if (args.requestType === "eventRemoved") {
        updatedEvents = events.filter((e) => !args.data.some((ne) => ne.Id === e.Id));
      } else {
        const newEvents = Array.isArray(args.data) ? args.data : [args.data];
        updatedEvents = events.filter((e) => !newEvents.some((ne) => ne.Id === e.Id)).concat(newEvents);
      }

      setEvents(updatedEvents);
      sendRequest(API_URL, "POST", updatedEvents);
    }
  };

  const openModal = () => document.getElementById("my_modal_2").showModal();
  const closeModal = () => document.getElementById("my_modal_2").close();


  return (
    <div className=" md:m-4 p-2 md:p-10 ">
      <Header />
      <div className="flex flex-wrap items-center justify-between">
        <p className="text-accent p-2 font-bold text-3xl">Send Date</p>
        <button className="btn btn-accent" onClick={openModal}>
          <IoIosSend /> Add Date
        </button>
        <dialog id="my_modal_2" className="modal">
          <div className="modal-box bg-accent w-full max-w-2xl rounded-2xl h-[80vh] overflow-auto flex flex-col gap-2">
            <div className="p-5">
              <p className="font-bold text-3xl text-error-content">Konsert kunlarini qoshish:</p>
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
            <button className="btn btn-error mt-4" onClick={closeModal}>Close</button>
          </div>
        </dialog>
      </div>
      <div>
      <div className="mt-4">
        <ScheduleComponent
        height="w-[200%]"
        width="h-[100%]"
        eventSettings={{ dataSource: events }}
        selectedDate={new Date(2024, 0, 10)}
        actionComplete={onActionComplete}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
        </div>
      </div>
    </div>
  );
};

export default EventsTable;
