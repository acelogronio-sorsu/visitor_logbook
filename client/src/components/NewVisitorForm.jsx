import React, { useEffect } from "react";
import RequiredTag from "./RequiredTag";
import FormDropdown from "./FormDropdown";

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

  // Add or edit the selection for the purpose dropdown on the form
  const purposeOptions = [
    " -- Select Purpose --",
    "Submit Research Document/s",
    "Claiming of Document",
    "Request for Honorarium",
    "Request for Incentives",
    "Consultation",
    "Other",
  ];

  // Add or edit document options for the dropdown
  const researchDocumentOptions = [
    " -- Select Document --",
    "Accomplishment Report",
    "Terminal Report",
    "Research Proposal/s",
  ];

  //
  const incentiveOptions = [
    "-- Select Incentive --", "Publication", "Presentation", "Citation"
  ]

  // Get the current time
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
      <div className="visitor-top">
        <button
          className="view-time-out-table-btn"
          type="button"
          onClick={() => setExpanded(true)}
        >
          Time Out Now
        </button>
        <p className="date-time">
          {dateToday} -{" "}
          {currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
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
            autoFocus
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
              setFormdata((old) => ({ ...old, purpose: e.target.value, particulars: "" }));
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
          formdata.purpose === "Claim Document" || formdata.purpose === "Request for Honorarium" ? (
          <div className="input-grp">
            <label htmlFor="particulars">Particulars <RequiredTag /></label>
            <input
              type="text"
              name="particulars"
              id="particulars"
              value={formdata.particulars}
              autoComplete="off"
              placeholder="Write the details/title..."
              onChange={(e) =>
                setFormdata((old) => ({
                  ...old,
                  particulars: e.target.value,
                }))
              }
            />
          </div>
        ) : null}

        {
          formdata.purpose === "Request for Incentives" && (
            <FormDropdown label="Request for Incentives" optionList={incentiveOptions} />
          )
        }

        {formdata.purpose === "Submit Research Document/s" && (
          <div className="input-grp">
            <label htmlFor="researchDocument">Research Document <RequiredTag /></label>
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
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
