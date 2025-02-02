import React, { useState } from "react";
import axios from "axios"
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

import Header from "../../../Components/Header";

const EventsTable = () => {
  const loadEvents = () => {
    const savedEvents = localStorage.getItem("calendarEvents");
    return savedEvents ? JSON.parse(savedEvents) : [];
  };
  const token = "dasdasd"
  axios.post("dasdadasdas", {
    headers: {
      Authorization: "Bearer " + token
    }
  }, {
    data: {
      title: "Concert meeting",
    description: "Monthly sync-up meeting with the team.",
      time: {
        start: "10:00 AM",
        end: "11:00 AM"
      },
      addres: "123 Main Street, City",
      date: "2024-08-15"
    }
  })
  const [events, setEvents] = useState(loadEvents);
  const onActionComplete = (args) => {
    if (["eventCreated", "eventChanged", "eventRemoved"].includes(args.requestType)) {
      let updatedEvents = [];
      if (args.requestType === "eventRemoved") {
        updatedEvents = events.filter((e) => e.Id !== args.data[0].Id);
      } else {
        const newEvents = Array.isArray(args.data) ? args.data : [args.data];
        updatedEvents = events.filter(e => !newEvents.some(ne => ne.Id === e.Id)).concat(newEvents);
      }
      setEvents(updatedEvents);
      localStorage.setItem("calendarEvents", JSON.stringify(updatedEvents));
    }
  };


  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 rounded-3xl">
      <Header title="Events Table" />
      <ScheduleComponent
        height="[500%]"
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