import React, { useState, useEffect, useContext } from "react";
import Schedule from "./Schedule";
import moment from "moment";
import axios from "axios";
import { API_URL } from "../../apiPath";
import { AppContext } from "../../contexts/appContext";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "react-loader-spinner";
import { MdDeleteForever } from "react-icons/md";

const Event = () => {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const { logout } = useContext(AppContext);
  const [fetch, setFetch] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (fetch) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const res = await axios.get(`${API_URL}/events`);
          const data = res.data;
          setEvents(
            data.map((event) => {
              return {
                ...event,
                start: new Date(event.start),
                end: new Date(event.end),
              };
            })
          );
          console.log(events);
        } catch (err) {
          // setErr(err.response.data);
          alert(err.response.data);
          console.log(err);
          return;
        }
        setFetch(false);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [fetch, setFetch]);

  const addEvent = async (event) => {
    try {
      await axios.post(`${API_URL}/events/`, event);
      setFetch(true);
    } catch (err) {
      alert(err.response.data);
      console.log(err);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
    }
  };

  const updateEvent = async (event) => {
    try {
      await axios.put(`${API_URL}/events/${event.id}`, event);
      setFetch(true);
    } catch (err) {
      alert(err.response.data);
      console.log(err);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
      return;
    }

    // const index = events.findIndex((event) => event === clickedEvent);
    // const updatedEvents = events.slice();
    // updatedEvents[index].title = event.title;
    // updatedEvents[index].desc = event.desc;
    // updatedEvents[index].start = new Date(event.start);
    // updatedEvents[index].end = new Date(event.end);
    // setEvents(updatedEvents);
  };

  //  filters out specific event that is to be deleted and set that variable to state
  const deleteEvent = async (id) => {
    if (confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/events/${id}`);
        setFetch(true);

        // Update the events state by filtering out the deleted event
        // setEvents((previousEvents) => previousEvents.filter((event) => event.id !== id));
      } catch (err) {
        // setErr(err.response.data);
        console.log(err);
        alert(err.response.data);
        if (err.response.status === 401) {
          logout();
          nav("/login");
        }
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <h1 className="text-center fw-bolder">Upcoming events</h1>
        <div id="main" className="col-12 col-md-5 pt-5">
          {isLoading ? (
            <ProgressBar
              height="80"
              width="100%"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass="progress-bar-wrapper"
              borderColor="#F4442E"
              barColor="#51E5FF"
            />
          ) : (
            events.map((event, index) => {
              const { id, title, desc, start, end } = event;
              return (
                <div className="card mb-2" key={index}>
                  {" "}
                  <div className="card-body">
                    <h2 className="card-title">
                      <a href="#">{title}</a>
                    </h2>
                    <p className="card-text">{desc} </p>
                  </div>
                  <div className="card-footer text-muted">
                    <time>
                      Start{" "}
                      <span>{moment(start).format("YYYY-MM-DD HH:mm")}</span>
                    </time>{" "}
                    <time>
                      End <span>{moment(end).format("YYYY-MM-DD HH:mm")}</span>
                    </time>
                  </div>
                  <MdDeleteForever
                    size={30}
                    color="red"
                    onClick={() => deleteEvent(id)}
                  />
                </div>
              );
            })
          )}
        </div>
        <div className="col-12 col-md-7">
          <Schedule
            events={events}
            addEvent={addEvent}
            updateEvent={updateEvent}
            deleteEvent={deleteEvent}
          />
        </div>
      </div>
    </div>
  );
};

export default Event;
