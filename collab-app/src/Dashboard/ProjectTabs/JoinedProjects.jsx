import { CheckCircle2 } from "lucide-react";

function JoinedProjects() {
  return (
    <div className="text-center text-gray-500 py-10">
      <CheckCircle2 size={40} className="mx-auto mb-3 text-gray-400" />
      <p>No teams joined currently</p>
    </div>
  );
}

export default JoinedProjects;