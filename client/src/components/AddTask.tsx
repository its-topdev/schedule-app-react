import { useTaskContext } from "../context/taskContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const { addTask } = useTaskContext();
  const [title, setTitle] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [flexible, setFlexible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [timer, setTimer] = useState("");
  const [time, setTime] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [daysRecurring, setDaysRecurring] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (time !== "") {
      const [startTimeStr, endTimeStr] = time.split("-");
      const startTime = new Date();
      const [startHours, startMins] = startTimeStr.split(":");
      startTime.setHours(parseInt(startHours));
      startTime.setMinutes(parseInt(startMins));
      const endTime = new Date();
      const [endHours, endMins] = endTimeStr.split(":");
      endTime.setHours(parseInt(endHours));
      endTime.setMinutes(parseInt(endMins));

      setStartTime(startTime.toLocaleTimeString());
      setEndTime(endTime.toLocaleTimeString());
      setStartDate(startTime);
      setEndDate(endTime);
    }
  }, [time]);

  useEffect(() => {
    if (timer) {
      const timeInMinutes = parseInt(timer);
      const currentTime = new Date();
      const endTime = new Date(currentTime.getTime() + timeInMinutes * 60000); // Convert minutes to milliseconds

      setStartTime(currentTime.toLocaleTimeString());
      setEndTime(endTime.toLocaleTimeString());
      setStartDate(currentTime);
      setEndDate(endTime);
    }
  }, [timer]);

  const task = {
    isRecurring: false,
    rRule: "",
    scheduled: false,
    flexible: false,
    isCompleted: false,
    startTime: "",
    endTime: "",
    startDate: new Date(),
    endDate: new Date(),
    start: new Date(),
    end: new Date(),
    time: "",
    timer: "",
    title: "",
    text: "",
    daysRecurring
  };

  const generateRRule = (daysArr: string[]) => {
    const daysAbbreviated = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    const selectedDays = daysArr.filter(day => daysAbbreviated.includes(day.slice(0, 2)));
    const frequency = selectedDays.length === 7 ? "DAILY" : "WEEKLY";
    const rRule = `RRULE:FREQ=${frequency};BYDAY=${selectedDays.join(",")}`;
    return rRule;
  };

  const handleSubmit = async () => {
    task.title = title;
    task.text = title;
    task.isRecurring = isRecurring;
    task.scheduled = scheduled;
    task.flexible = flexible;
    task.isCompleted = isCompleted;
    task.startTime = startTime;
    task.endTime = endTime;
    task.startDate = startDate,
    task.endDate = endDate;
    task.start = startDate;
    task.end = endDate;
    task.daysRecurring = [...daysRecurring];
    task.rRule = generateRRule(daysRecurring);
    try {
      const response = await fetch("https://task-scheduler-app.onrender.com/api/tasks/add-task", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(task)
      });

      if (response.ok) {
        const data = await response.json();
        addTask(data.task);
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
      <h3>Add Task</h3>
      <form onSubmit={event => {
        event.preventDefault();
        handleSubmit();
      }}
      method="post"
      className="container-fluid"
      >
        <fieldset className="mb-3">
          <legend>Enter task information</legend>
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            name="title"
            title="enter title for task"
            className="form-control title"
            value={title}
            onChange={event => setTitle(event.target.value)}
            required
          />
          <div className="form-check form-switch">
            <label htmlFor="scheduled" className="form-label">Scheduled Time</label>
            <input
              type="checkbox"
              name="scheduled"
              title="is task scheduled"
              className="form-check-input"
              checked={scheduled}
              onChange={event => setScheduled(!event.target.checked)}
            />
          </div>
          {(scheduled && !flexible) && (
            <>
              <label htmlFor="time" className="form-label">Time</label>
              <input
                type="text"
                name="time"
                title="set scheduled time for task"
                className="form-control"
                value={time}
                onChange={event => setTime(event.target.value)}
                required={scheduled}
                placeholder="7:00AM-8:00AM"
              />
            </>
          )}{(scheduled && !flexible) && (
            <div className="form-check form-switch">
              <label htmlFor="recurring" className="form-label">Recurring</label>
              <input
                type="checkbox"
                name="recurring"
                title="is task recurring"
                className="form-check-input"
                checked={isRecurring}
                onChange={event => setIsRecurring(!event.target.checked)}
              />
            </div>
          )}{(!scheduled && flexible) && (
            <>
              <label htmlFor="timer" className="form-label">Timer</label>
              <input
                type="text"
                name="timer"
                title="set flexible time for task"
                className="form-control"
                value={timer}
                onChange={event => setTimer(event.target.value)}
                required={flexible}
                placeholder="30mins"
              />
              <div className="form-check form-switch">
                <label htmlFor="flexible" className="form-label">Flexible</label>
                <input
                  type="checkbox"
                  name="flexible"
                  title="is task flexible"
                  className="form-check-input"
                  checked={flexible}
                  onChange={event => setFlexible(!event.target.checked)}
                />
              </div>
            </>
          )}{isRecurring && (
            <>
              {days.map(day => {
                if (daysRecurring.includes(day)) {
                  const answer =
                    confirm(`Are you sure you want to remove ${day} from the list of days recurring?`)
                  ;
                  if (answer) {
                    daysRecurring.splice(daysRecurring.indexOf(day), 1);
                  }
                }

                return (
                  <button
                    type="button"
                    title="day"
                    key={day}
                    onClick={() => {
                      const newDaysRecurring = [...daysRecurring];
                      newDaysRecurring.push(day);
                      setDaysRecurring(newDaysRecurring);
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

export default AddTask;