import Hero from "../components/Hero";
import TimeOutTable from "../components/TimeOutTable";
import NewVisitorForm from "../components/NewVisitorForm";
import { useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Confetti from "../components/Confetti";


export default function Home() {
  const dialogReff = useRef(null);
  const dialogReffOut = useRef(null);
  const dialogInput = useRef(null);
  const [visible, setVisible] = useState(false);
  const [visibleOut, setVisibleOut] = useState(false);
  const [visibleInputError, setVisibleInputError] = useState(false);
  const [nextRow, setNextRow] = useState();
  const [visitors, setVisitors] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [formdata, setFormdata] = useState({
    name: "",
    affiliation: "",
    purpose: "",
    particulars: "",
    in: "",
  });

  const removePerson = (index) => {
    setVisitors((old) => old.filter((row) => row[0] !== index));
  };

  // Hnadle time out for a visitor
  const handleTimeOut = useCallback(async (index) => {
    const timeOut = new Date().toLocaleTimeString();

    await fetch(`${import.meta.env.VITE_SERVER_URL}/timeout`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ index, timeOut }),
    })
      .then((response) => response.text())
      .then((data) => {
        removePerson(index);
        dialogReffOut.current.showModal();
        setVisibleOut(true);
        console.log("Success Time Out:", data);
      })
      .catch((error) => {
        console.error("Error timing out visitor:", error);
      });
  }, []);

  // fetch visitors with blank time out
  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"

      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNextRow(data.nextRow); // set next row to the last row in the sheet
        setVisitors([...data.visitors]);
      })
      .catch((error) => console.error("Error fetching visitors:", error));
  }, []);

  // modal time out for visitor logging in
  useEffect(() => {
    let timer;
    if (visible) {
      // Set a timer to hide the modal after 3 seconds (3000ms)
      timer = setTimeout(() => {
        dialogReff.current.close();
        setVisible(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [visible]);

  // modal time out for Visitor Time out
  useEffect(() => {
    let timer;
    if (visibleOut) {
      // Set a timer to hide the modal after 3 seconds (3000ms)
      timer = setTimeout(() => {
        dialogReffOut.current.close();
        setVisibleOut(false);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [visibleOut]);

  // Modal time out for input error
  useEffect(() => {
    let timer;
    if (visibleInputError) {
      // Set a timer to hide the modal after 3 seconds (3000ms)
      timer = setTimeout(() => {
        dialogInput.current.close();
        setVisibleInputError(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [visibleInputError]);

  // handles the submission of a new visitor
  const handleSubmitAPI = async (e) => {
    e.preventDefault();



    // if required fields are empty, then don't continue
    if (formdata.name === "" || formdata.affiliation === "" || formdata.purpose === "" ||
      ((formdata.purpose !== "Claiming of Documents" && formdata.purpose !== "Consultation") && formdata.particulars === "")) {
      dialogInput.current.showModal()
      setVisibleInputError(true)
      return;
    }

    await fetch(`${import.meta.env.VITE_SERVER_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        date: new Date().toLocaleDateString(),
        name: formdata.name || "-- Juan --",
        affiliation: formdata.affiliation || "--",
        purpose: formdata.purpose || "Consultation",
        particulars: formdata.particulars || "--",
        timeIn: formdata.in || new Date().toLocaleTimeString(), // Default to current time if out is not set
      }),
    })
      .then((res) => res.text())
      .then(() => {
        setVisible(true);
        dialogReff.current.showModal();
        setFormdata({
          name: "",
          affiliation: "",
          purpose: "",
          particulars: "",
          in: "",
        });
        setNextRow((old) => old + 1); // increment next row by 1
        setVisitors((old) => [...old, [nextRow + 1, formdata.name]]); // add new visitor to the visitors states
      })
      .catch((error) => console.log(error))
      .finally(() => { });
  };

  return (
    <div id="home-container">
      <div className="home-content">
        <dialog className="modal" ref={dialogReff}>
          {visible && <Confetti />}
          <p className="modal-icon">🎉</p>
          <p className="modal-message">
            Successfully Recorded <br /> Your Visit!
          </p>
        </dialog>

        <dialog className="modal" ref={dialogReffOut}>
          {visible && <Confetti />}
          <p className="modal-icon">😁</p>
          <p className="modal-message">
            Thank you for visiting ORD! <br />
            Please come again
          </p>
        </dialog>

        <dialog className="modal" ref={dialogInput}>
          <p className="modal-icon">⚠️</p>
          <p className="modal-message">
            Please fill out the form first <br />
            before submitting
          </p>
        </dialog>
        <div className="left hero-container">
          {!expanded ? (
            <Hero />
          ) : (
            <TimeOutTable
              visitors={visitors.reverse()}
              handleTimeOut={handleTimeOut}
              setExpanded={setExpanded}
            />
          )}
        </div>
        <div className="right">
          <NewVisitorForm
            formdata={formdata}
            setFormdata={setFormdata}
            handleSubmitAPI={handleSubmitAPI}
            setExpanded={setExpanded}
          />
        </div>
        {/* <Footer /> */}
      </div>
    </div>
  );
}
