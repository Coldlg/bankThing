// Using Tailwind CSS and React (optional comment annotations explain each law)
export default function UXCard() {
  return (
    <div className="max-w-sm mx-auto rounded-2xl shadow-lg bg-white p-6 space-y-4 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      {/* 🧠 Serial Position Effect: Place important info first */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Start Your Project</h2>
        {/* 🎯 Von Restorff Effect: Visually distinctive action */}
        <span className="px-2 py-1 text-sm font-semibold bg-indigo-100 text-indigo-700 rounded-full">
          New
        </span>
      </div>

      {/* 🧠 Working Memory + Chunking */}
      <ol className="text-gray-600 text-sm space-y-1 list-decimal pl-4">
        <li>Set your goal</li>
        <li>Add team members</li>
        <li>Track progress</li>
      </ol>

      {/* 🧩 Mental Model: Familiar toggle */}
      <div className="flex items-center justify-between">
        <label htmlFor="notifications" className="text-sm text-gray-700">
          Enable Notifications
        </label>
        <input
          type="checkbox"
          id="notifications"
          className="toggle toggle-primary"
        />
      </div>

      {/* ⚙️ Zeigarnik Effect: Progress bar shows task is incomplete */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-indigo-600 h-2 rounded-full w-2/5 transition-all duration-500"></div>
      </div>
      <p className="text-xs text-gray-500">40% complete</p>

      {/* ⚙️ Peak-End Rule: Microinteraction */}
      <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl transition duration-300">
        Launch Project 🚀
      </button>

      {/* ⚙️ Postel’s Law: Lenient input UI, hint of flexibility */}
      <input
        type="text"
        placeholder="Project name (any format)"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
