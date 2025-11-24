import { Clock } from "lucide-react";

function PendingProjects() {
  return (
    <div className="text-center text-gray-500 py-10">
      <Clock size={40} className="mx-auto mb-3 text-gray-400" />
      <p>No pending requests currently</p>
    </div>
  );
}

export default PendingProjects;