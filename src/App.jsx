import Chat from "./components/Chat";

function App() {
  return (
    <>
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: #090d18;
        }
      `}</style>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "center",
          background: "radial-gradient(circle at top left, #1f2937 0%, #111827 28%, #090d18 100%)",
          padding: 0,
          margin: 0,
          overflow: "hidden",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#e5e7eb",
        }}
      >
        <Chat />
      </div>
    </>
  );
}

export default App;