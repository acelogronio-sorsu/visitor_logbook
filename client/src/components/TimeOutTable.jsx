export default function TimeOutTable({ visitors, handleTimeOut, setExpanded }) {
  return (
    <div className="timeout-table">
      <button className="expanded-hide-btn" onClick={() => setExpanded(false)}>
        Hide
      </button>
      <table>
        <thead>
          <tr>
            <th className="th-name">Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor, index) => (
            <tr key={index}>
              <td>{visitor[1]}</td>
              <td>
                <button
                  onClick={() => {
                    handleTimeOut(visitor[0]);
                    setExpanded(false);
                  }}
                  type="submit"
                >
                  Time Out
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
