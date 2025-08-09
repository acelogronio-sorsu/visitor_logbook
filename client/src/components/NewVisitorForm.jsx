import React, { useEffect } from "react";
import RequiredTag from "./RequiredTag";

export default function NewVisitorForm({
  formdata,
  setFormdata,
  handleSubmitAPI,
  setExpanded,
}) {
  const [currentTime, setCurrentTime] = React.useState(new Date());
  let dateToday = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    year: "numeric",
    month: "long",
  });
  const purposeOptions = [
    " -- Select Purpose --",
    "Submit Research Document",
    "Claim Document",
    "Request on Incentives for Publication",
    "Request on Incentives for Presentation",
    "Consultation",
    "Other",
  ];

  const researchDocumentOptions = [
    " -- Select Document --",
    "Accomplishment Report",
    "Research Proposal for RECO",
    "Terminal Report",
  ];

  useEffect(() => {
    // This function will run once when the component mounts
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update the time every 1000ms (1 second)

    // The return function runs when the component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="new-visitor-form">
      <p className="date-time">
        {dateToday} -{" "}
        {currentTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <h1 className="welcome-header">Welcome to the Office of</h1>
      <h1 className="welcome-header-2">Research and Development!</h1>
      <p>Please fill out the form to register as a new visitor.</p>

      <form onSubmit={handleSubmitAPI}>
        <div className="input-grp">
          <label htmlFor="name">
            Name <RequiredTag />
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Write your full name here"
            autoComplete="off"
            value={formdata.name}
            onChange={(e) =>
              setFormdata((old) => ({ ...old, name: e.target.value }))
            }
          />
        </div>
        <div className="input-grp">
          <label htmlFor="purpose">
            Purpose <RequiredTag />
          </label>
          <select
            name="purpose"
            id="purpose"
            onChange={(e) => {
              setFormdata((old) => ({ ...old, purpose: e.target.value }));
            }}
          >
            {purposeOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        {formdata.purpose === "Other" ||
          (formdata.purpose === "Claim Document" && (
            <div className="input-grp">
              <label htmlFor="particulars">Particulars</label>
              <input
                type="text"
                name="particulars"
                id="particulars"
                value={formdata.particulars}
                autoComplete="off"
                onChange={(e) =>
                  setFormdata((old) => ({
                    ...old,
                    particulars: e.target.value,
                  }))
                }
              />
            </div>
          ))}

        {formdata.purpose === "Submit Research Document" && (
          <div className="input-grp">
            <label htmlFor="researchDocument">Research Document</label>
            <select
              name="researchDocument"
              id="researchDocument"
              onChange={(e) =>
                setFormdata((old) => ({
                  ...old,
                  particulars: e.target.value,
                }))
              }
            >
              {researchDocumentOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="input-grp-btn">
          <button
            className="view-time-out-table-btn"
            type="button"
            onClick={() => setExpanded(true)}
          >
            Time Out Now
          </button>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
