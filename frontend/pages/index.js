// import { useState, useEffect } from "react";

// export default function Home() {
//   const [count, setCount] = useState(0); // Counter state
  

//   // Fetch the current counter value when the page loads
//   useEffect(() => {
//     fetch("http://localhost:5000/api/counter")
//       .then((response) => response.json())
//       .then((data) => setCount(data.count))
//       .catch((error) => console.error("Error fetching counter:", error));
//   }, []);

//   // Increment counter and update value in real-time
//   const incrementCounter = () => {
//     fetch("http://localhost:5000/api/counter/increment", {
//       method: "POST",
//     })
//       .then((response) => response.json())
//       .then((data) => setCount(data.count))
//       .catch((error) => console.error("Error incrementing counter:", error));
//   };
  
// // Increment counter using plugin
// const incrementWithPlugin = () => {
//   fetch('http://localhost:5000/api/counter/plugin-increment', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ value: count }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then((data) => setCount(data.count))
//     .catch((error) => {
//       console.error('Error incrementing with plugin:', error);
//       alert(`Error: ${error.message}`); // Display an error message to the user
//     });
// };

//   return (
//     <div
//       style={{
//         textAlign: "center",
//         marginTop: "50px",
//         fontFamily: "Arial, sans-serif",
//       }}
//     >
//       <h1>Counter-Up App</h1>
//       <h2>Current Count: {count}</h2>
//       <button
//         style={{
//           padding: "10px 20px",
//           fontSize: "16px",
//           backgroundColor: "#0070f3",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//           marginTop: "10px",
//         }}
//         onClick={incrementCounter} 
//       >
//         Increment
        
//       </button>
//       <button onClick={incrementWithPlugin}>Increment with Plugin</button>
//     </div>
//   );
// }
import { useState, useEffect } from "react";

export default function Home() {
  const [count, setCount] = useState(0); // Counter state
  const [usePlugin, setUsePlugin] = useState(false); // Plugin toggle state

  // Fetch the current counter value when the page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/counter")
      .then((response) => response.json())
      .then((data) => setCount(data.count))
      .catch((error) => console.error("Error fetching counter:", error));

    // Fetch the current plugin state when the page loads
    fetch("http://localhost:5000/api/plugin-status")
      .then((response) => response.json())
      .then((data) => setUsePlugin(data.pluginEnabled))
      .catch((error) => console.error("Error fetching plugin status:", error));
  }, []);

  // Increment counter and update value in real-time
  const incrementCounter = () => {
    const endpoint = usePlugin
      ? "http://localhost:5000/api/counter/plugin-increment"
      : "http://localhost:5000/api/counter/increment";

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: count }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setCount(data.count))
      .catch((error) => console.error("Error incrementing counter:", error));
  };

  // Toggle plugin on/off
  const togglePlugin = () => {
    fetch("http://localhost:5000/api/plugin-toggle", {
      method: "POST",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsePlugin(data.pluginEnabled);
        alert(`Plugin is now ${data.pluginEnabled ? "Enabled" : "Disabled"}`);
      })
      .catch((error) => console.error("Error toggling plugin:", error));
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Counter-Up App</h1>
      <h2>Current Count: {count}</h2>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={incrementCounter}
      >
        Increment {usePlugin ? "with Plugin" : ""}
      </button>
      <br />
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: usePlugin ? "#f00" : "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
        onClick={togglePlugin}
      >
        {usePlugin ? "Disable Plugin" : "Enable Plugin"}
      </button>
    </div>
  );
}
