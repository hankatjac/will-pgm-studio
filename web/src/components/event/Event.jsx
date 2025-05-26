import React, { useState, useEffect, useContext } from "react";
import Schedule from "./Schedule";
import moment from "moment";
import axios from "axios";
import { AppContext } from "../../contexts/appContext";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { MdDeleteForever } from "react-icons/md";
import Confirm from "../Confirm";

const Event = () => {
  const [isLoading] = useState(false);
  const nav = useNavigate();
  const { logout, events, getEvents } = useContext(AppContext);
  // const [events, setEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog
  const [eventIdToDelete, setEventIdToDelete] = useState(''); // ID of the event to delete

  useEffect(() => {
    getEvents(); // Fetch events when the component mounts
  }, [getEvents]);

  const addEvent = async (event) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/events/`, event);
      await getEvents(); // Fetch the latest events after adding
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
      await axios.put(
        `${process.env.REACT_APP_API_URL}/events/${event.id}`,
        event
      );
      await getEvents(); // Fetch the latest events after updating
    } catch (err) {
      alert(err.response.data);
      console.log(err);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
    }
  };

  const handleDeleteClick = (id) => {
    setEventIdToDelete(id); // Set the ID of the event to delete
    setOpenDialog(true); // Open the confirmation dialog
  };

  const confirmDeleteEvent = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/events/${eventIdToDelete}`
      );
      await getEvents(); // Fetch the latest events after deleting
      // setEvents((prevEvents) =>
      //   prevEvents.filter((event) => event.id !== eventIdToDelete)
      // ); // Update state
      setOpenDialog(false); // Close the dialog
    } catch (err) {
      console.log(err);
      alert(err.response.data);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
    }
  };

  return (
    <div className="container my-5">
      <div className="row">
        <h1 className="text-center fw-bolder">Upcoming events</h1>
        <div id="main" className="col-12 col-md-5 pt-5">
          {isLoading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            events.map((event, index) => {
              const { id, title, desc, start, end } = event;
              return (
                <div className="card mb-2" key={index}>
                  <div className="card-body">
                    <h2 className="card-title">
                      <button className="btn btn-outline-primary">
                        {title}
                      </button>
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
                    onClick={() => handleDeleteClick(id)} // Trigger the dialog
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
          />
        </div>
      </div>

      {/* Reusable Confirmation Dialog */}
      <Confirm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDeleteEvent}
        title="Confirm Deletion"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default Event;
