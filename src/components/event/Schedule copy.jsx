import React, { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Box } from "@mui/system";

const localizer = dayjsLocalizer(dayjs);

const Schedule = ({
  events,
  addEvent,
  updateEvent,
  selectedEvent,
  deleteEvent,
  clickedEvent,
}) => {
  const [id, setId] = useState();
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(dayjs());
  const [end, setEnd] = useState(dayjs());
  const [desc, setDesc] = useState("");
  const [openSlot, setOpenSlot] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);

  const handleClose = () => {
    setOpenEvent(false);
    setOpenSlot(false);
  };

  const handleSlotSelected = (slotInfo) => {
    setTitle("");
    setDesc("");
    setStart(dayjs(slotInfo.slots[0])); // Convert to Dayjs
    setEnd(dayjs(slotInfo.slots.slice(-1)[0])); // Convert to Dayjs
    setOpenSlot(true);
  };

  const handleNewAppointment = () => {
    const appointment = {
      title,
      desc,
      start: start.format("YYYY-MM-DD HH:mm"), // Format for API
      end: end.format("YYYY-MM-DD HH:mm"), // Format for API
    };
    addEvent(appointment);
  };

  const handleEventSelected = (event) => {
    setOpenEvent(true);
    selectedEvent(event);
    setId(event.id);
    setStart(dayjs(event.start)); // Convert to Dayjs
    setEnd(dayjs(event.end)); // Convert to Dayjs
    setTitle(event.title);
    setDesc(event.desc);
  };

  const handleUpdateEvent = () => {
    const appointment = {
      id,
      title,
      desc,
      start: start.format("YYYY-MM-DD HH:mm"), // Format for API
      end: end.format("YYYY-MM-DD HH:mm"), // Format for API
    };

    // Check if any changes were made
    if (
      appointment.title === clickedEvent.title &&
      appointment.desc === clickedEvent.desc &&
      appointment.start === dayjs(clickedEvent.start).format("YYYY-MM-DD HH:mm") &&
      appointment.end === dayjs(clickedEvent.end).format("YYYY-MM-DD HH:mm")
    ) {
      alert("Nothing changed!");
      return;
    }

    updateEvent(appointment);
  };

  return (
    <div id="Calendar">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable={true}
        onSelectEvent={(event) => handleEventSelected(event)}
        onSelectSlot={(slotInfo) => handleSlotSelected(slotInfo)}
        style={{ height: 500, margin: "50px" }}
      />

      {/* Dialog for creating a new event */}
      <Dialog open={openSlot} onClose={handleClose}>
        <DialogTitle>{`Make Event on ${start.format("MMMM Do YYYY")}`}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& > :not(style)": {
                m: 1,
                width: "75%",
                display: "grid",
              },
            }}
          >
            <TextField
              required
              label="Title"
              variant="standard"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              required
              label="Description"
              variant="standard"
              onChange={(e) => setDesc(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={start}
                onChange={(date) => setStart(date)} // Use Dayjs object
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                label="End Time"
                value={end}
                onChange={(date) => setEnd(date)} // Use Dayjs object
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              handleNewAppointment();
              handleClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for editing an existing event */}
      <Dialog open={openEvent} onClose={handleClose}>
        <DialogTitle>{`View/Edit Event on ${start.format("MMMM Do YYYY")}`}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              "& > :not(style)": {
                m: 1,
                width: "75%",
                display: "grid",
              },
            }}
          >
            <TextField
              required
              label="Title"
              variant="standard"
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              required
              label="Description"
              variant="standard"
              defaultValue={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Start Time"
                value={start}
                onChange={(date) => setStart(date)} // Use Dayjs object
                renderInput={(params) => <TextField {...params} />}
              />
              <TimePicker
                label="End Time"
                value={end}
                onChange={(date) => setEnd(date)} // Use Dayjs object
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => {
              deleteEvent();
              handleClose();
            }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              handleUpdateEvent();
              handleClose();
            }}
          >
            Confirm Edit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Schedule;