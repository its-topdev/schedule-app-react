import { useTaskContext, Task } from "../context/taskContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface EditTaskProps {
  task: Task;
}

const EditTask = ({ task }: EditTaskProps) => {
  const { updateTask } = useTaskContext();
  const [updatedTask, setUpdatedTask] = useState<Task>(task);
  const navigate = useNavigate();

  useEffect(() => {
    if (updatedTask.time !== "" && updatedTask.time != task.time) {
      const [startTimeStr, endTimeStr] = updatedTask.time.split("-");
      const startTime = new Date();
      const [startHours, startMins] = startTimeStr.split(":");
      startTime.setHours(parseInt(startHours));
      startTime.setMinutes(parseInt(startMins));
      const endTime = new Date();
      const [endHours, endMins] = endTimeStr.split(":");
      endTime.setHours(parseInt(endHours));
      endTime.setMinutes(parseInt(endMins));

      setUpdatedTask(prevState => ({
        ...prevState,
        startDate: startTime,
        endDate: endTime,
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        start: startTime,
        end: endTime
      }));
    }
  }, [updatedTask.time, task.time]);

  useEffect(() => {
    if (updatedTask.timer != task.timer) {
      const timeInMinutes = parseInt(updatedTask.timer);
      const currentTime = new Date();
      const endTime = new Date(currentTime.getTime() + timeInMinutes * 60000); // Convert minutes to milliseconds

      setUpdatedTask(prevState => ({
        ...prevState,
        startDate: currentTime,
        endDate: endTime,
        start: currentTime,
        end: endTime,
        startTime: currentTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString()
      }));
    }
  }, [updatedTask.timer, task.timer]);

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `https://dragonosman-task-scheduler.onrender.com/api/tasks/edit-task/${updatedTask._id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedTask)
        });

      if (response.ok) {
        const data = await response.json();
        data.task._id && updateTask(data.task._id, data.task);
        navigate("/");
      } else {
        console.error(`${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error(`Something went wrong: ${err}`);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Satuday", "Sunday"];

  return (
    <div className="container-fluid add-task">
      <i className="fa-solid fa-angle-left" onClick={() => navigate("/")}></i>
      <h3>Edit Task</h3>
      <form onSubmit={event => {
        event.preventDefault();
        handleSubmit();
      }}
      method="post"
      className="container-fluid"
      >
        <fieldset className="mb-3">
          <legend>Edit task information</legend>
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            name="title"
            title="enter title for task"
            className="form-control title"
            value={updatedTask.title}
            onChange={event => setUpdatedTask(prevTaskData => ({
              ...prevTaskData, [event.target.name]: event.target.value }))}
          />
          <div className="form-check form-switch">
            <label htmlFor="scheduled" className="form-label">Scheduled Time</label>
            <input
              type="checkbox"
              name="scheduled"
              title="is task scheduled"
              className="form-check-input"
              checked={updatedTask.scheduled}
              onChange={event => setUpdatedTask(prevTaskData => ({
                ...prevTaskData, [event.target.name]: !event.target.checked
              }))}
            />
          </div>
          {(updatedTask.scheduled && !updatedTask.flexible) && (
            <>
              <label htmlFor="time" className="form-label">Time</label>
              <input
                type="text"
                name="time"
                title="set scheduled time for task"
                className="form-control"
                value={updatedTask.time}
                onChange={event => setUpdatedTask(prevData => ({
                  ...prevData, [event.target.name]: event.target.value
                }))}
              />
            </>
          )}{(updatedTask.scheduled && !updatedTask.flexible) && (
            <div className="form-check form-switch">
              <label htmlFor="recurring" className="form-label">Recurring</label>
              <input
                type="checkbox"
                name="isRecurring"
                title="is task recurring"
                className="form-check-input"
                checked={updatedTask.isRecurring}
                onChange={event => setUpdatedTask(prevData => ({
                  ...prevData, [event.target.name]: !event.target.checked
                }))}
              />
            </div>
          )}{(!updatedTask.scheduled && updatedTask.flexible) && (
            <>
              <label htmlFor="timer" className="form-label">Timer</label>
              <input
                type="text"
                name="timer"
                title="set flexible time for task"
                className="form-control"
                value={updatedTask.timer}
                onChange={event => setUpdatedTask(prevData => ({
                  ...prevData, [event.target.name]: event.target.value
                }))}
              />
              <div className="form-check form-switch">
                <label htmlFor="flexible" className="form-label">Flexible</label>
                <input
                  type="checkbox"
                  name="flexible"
                  title="is task flexible"
                  className="form-check-input"
                  checked={updatedTask.flexible}
                  onChange={event => setUpdatedTask(prevData => ({
                    ...prevData, [event.target.name]: !event.target.checked
                  }))}
                />
              </div>
            </>
          )}{updatedTask.isRecurring && (
            <>
              {days.map(day => {
                if (updatedTask.daysRecurring && updatedTask.daysRecurring.includes(day)) {
                  const answer =
                    confirm(`Are you sure you want to remove ${day} from the list of days recurring?`)
                  ;
                  if (answer) {
                    setUpdatedTask(prevData => {
                      const newDaysRecurring =
                        updatedTask.daysRecurring && [...updatedTask.daysRecurring]
                      ;
                      if (newDaysRecurring && updatedTask.daysRecurring) {
                        newDaysRecurring.splice(updatedTask.daysRecurring.indexOf(day), 1);
                      }

                      return {
                        ...prevData,
                        daysRecurring: newDaysRecurring
                      };
                    });
                  }
                }

                return (
                  <button
                    type="button"
                    title="day"
                    key={day}
                    onClick={() => {
                      const newDaysRecurring =
                        updatedTask.daysRecurring && [...updatedTask.daysRecurring]
                      ;
                      newDaysRecurring?.push(day);
                      setUpdatedTask(prevData => ({
                        ...prevData, daysRecurring: newDaysRecurring
                      }));
                    }}
                    className="btn btn-secondary day-btn"
                  >
                    {day.charAt(0)}
                  </button>
                );
              })}
            </>
          )}
        </fieldset>
        <input type="submit" value="Done" className="btn btn-secondary" />
      </form>
    </div>
  );
};

export default EditTask;