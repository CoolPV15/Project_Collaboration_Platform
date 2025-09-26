import React from "react";

{/*Component to display the available teams*/}
function JoinTeam() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Join a Team
      </h2>
      <p className="text-gray-500">
        No teams available to join currently.  
        Check back later!
      </p>
    </div>
  );
}

export default JoinTeam;