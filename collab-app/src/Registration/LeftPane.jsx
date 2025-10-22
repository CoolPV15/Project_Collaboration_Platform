
export default function LeftPane() {
  {/*
    HTML component for the left pane to display the name of the website
  */}
  return (
    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-blue-700 to-blue-500 text-white w-full md:w-1/2 h-screen p-10">
      <h1 id="sitename" className="text-5xl font-extrabold mb-4">PROJECTO</h1>
      <h3 id="sitedsc" className="text-xl font-medium text-center">PROJECT COLLABORATION PLATFORM</h3>
    </div>
  );
}