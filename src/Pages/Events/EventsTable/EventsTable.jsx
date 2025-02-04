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

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const { sendRequest, loading, error } = useApiRequest();
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

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 rounded-3xl">
      <Header title="Events Table" send="Send Date" />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ScheduleComponent
        height="w-[500%]"
        eventSettings={{ dataSource: events }}
        selectedDate={new Date(2024, 0, 10)}
        actionComplete={onActionComplete}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  );
};

export default EventsTable;
