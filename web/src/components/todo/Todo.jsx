import { useState, useEffect, useContext } from "react";
import Header from "./Header";
// import Tasks from "./Tasks";
import AddTask from "./AddTask";
import axios from "axios";
import { AppContext } from "../../contexts/appContext";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import Confirm from "../Confirm";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";

const Todo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();
  const { logout } = useContext(AppContext);
  const [showAddTask, setShowAddTask] = useState(false);
  const [fetch, setFetch] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [taskIdToDelete, setTaskIdToDelete] = useState("");

  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false); // State for confirmation dialog

  // Fetch Task
  useEffect(() => {
    if (fetch) {
      setIsLoading(true);
      const fetchData = async () => {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/todos`);
          setTasks(res.data);
        } catch (err) {
          // setErr(err.response.data);
          if (err.response.status === 401) {
            logout();
            nav("/login");
          }
          console.log(err);
          alert(err.response.data);
        }
        setFetch(false);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [fetch, logout, nav]);

  // const fetchTask = async (id) => {
  //   const res = await fetch(`http://localhost:5000/tasks/${id}`);
  //   const data = await res.json();
  //   return data;
  // };

  // Add Task
  const addTask = async (task) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/todos/`, task);
      setFetch(true);
    } catch (err) {
      alert(err.response.data);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
      console.log(err);
    }
    // setTasks([...tasks, task]);
  };

  // Toggle Reminder
  const toggleReminder = async (task) => {
    const updatedTask = { ...task, reminder: !task.reminder };
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/todos/${task.id}`,
        updatedTask
      );
    } catch (err) {
      alert(err.response.data);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
      console.log(err);
      return;
    }
    console.log(task.id);
    const index = tasks.findIndex((t) => t === task);
    const updatedTasks = tasks.slice();
    updatedTasks[index].reminder = !task.reminder;
    setTasks(updatedTasks);

    // setTasks(
    //   tasks.map((task) =>
    //     task.id === id ? { ...task, reminder: !task.reminder } : task
    //   )
    // );
  };

  //pass the task for edit
  const editTaskClick = (task) => {
    console.log(task.id);
    setShowAddTask(!showAddTask);
    // tasks.map((task) => (task.id === id ? setEditTask(task) : ""));
    setEditTask(task);
  };
  // console.log("task for edit", editTask);

  // save updatedtask to database
  const handleEditTask = async (task) => {
    console.log(task.id);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/todos/${task.id}`,
        task
      );
    } catch (err) {
      // setErr(err.response.data);
      alert(err.response.data);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
      console.log(err);
      return;
    }
    const index = tasks.findIndex((t) => t === editTask);
    const updatedTasks = tasks.slice();
    updatedTasks[index].text = task.text;
    updatedTasks[index].day = task.day;
    updatedTasks[index].reminder = task.reminder;
    setTasks(updatedTasks);
  };

  const handleDeleteClick = (id) => {
    setTaskIdToDelete(id); // Set the ID of the event to delete
    setOpenDialog(true); // Open the confirmation dialog
  };

  // Delete Task
  const confirmDeleteTask = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/todos/${taskIdToDelete}`
      );
      // setTasks(tasks.filter((task) => task.id !== id));
      setFetch(true)
      setOpenDialog(false);
    } catch (err) {
      alert(err.response.data);
      if (err.response.status === 401) {
        logout();
        nav("/login");
      }
    }
  };

  return (
    <div className="container my-5">
      <Header
        toggleAdd={() => setShowAddTask(!showAddTask)}
        showAddTask={showAddTask}
        setEditTask={() => setEditTask("")}
      />

      {showAddTask && (
        <AddTask
          onAdd={addTask}
          onEdit={handleEditTask}
          editTask={editTask}
          setShowAddTask={setShowAddTask}
        />
      )}
      {isLoading ? (
        <Spinner animation="border" variant="primary" />
      ) : tasks.length > 0 ? (
        tasks.map((task) => {
          return (
            <div
              className={`task ${task.reminder && "reminder"} container `}
              onDoubleClick={() => toggleReminder(task)}
            >
              <div className="row">
                <div className="col-md-8">
                  <h3>{task.text}</h3>
                  <p>{task.day}</p>
                </div>
                <div className="col-md-2 my-3">
                  <MdDelete
                    style={{
                      color: "red",
                      cursor: "pointer",
                      width: "30px",
                      height: "30px",
                    }}
                    onClick={() => handleDeleteClick(task.id)}
                  />
                </div>
                <div className="col-md-2 my-3">
                  <GrEdit
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      width: "30px",
                      height: "30px",
                    }}
                    onClick={() => editTaskClick(task)}
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        "No Tasks To Show"
      )}

      {/* Reusable Confirmation Dialog */}
      <Confirm
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={confirmDeleteTask}
        title="Confirm Deletion"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
};

export default Todo;
