import { createElement, useState } from "https://esm.sh/react@18";
import { createRoot } from "https://esm.sh/react-dom@18/client";

const HUMAN_NEEDS = [
  "Drink Water",
  "Stretch",
  "Take Vitamins",
  "Lunch",
  "Restroom Break",
  "Snack",
  "Breathing Exercise"
];

const ICONS = {
  "Drink Water": "💧",
  "Stretch": "🧘",
  "Take Vitamins": "💊",
  "Lunch": "🍴",
  "Restroom Break": "🚻",
  "Snack": "🍎",
  "Breathing Exercise": "🌬️",
  "Reminder": "⏰",
  "Treadmill - 15 min": "🏃"
};

function App() {
  const [selectedNeeds, setSelectedNeeds] = useState([...HUMAN_NEEDS]);
  const [schedule, setSchedule] = useState([
    { time: "10:00 AM", activity: "Drink Water" },
    { time: "11:30 AM", activity: "Stretch" },
    { time: "1:00 PM", activity: "Lunch" },
    { time: "3:00 PM", activity: "Take Vitamins" }
  ]);
  const [command, setCommand] = useState("");

  const handleToggleNeed = (need) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const handleCommand = () => {
    const cmd = command.toLowerCase();
    let updatedSchedule = [...schedule];

    if (cmd.includes("no lunch")) {
      updatedSchedule = updatedSchedule.filter((item) => item.activity !== "Lunch");
    } else if (cmd.includes("remind me in 20 minutes")) {
      updatedSchedule.push({ time: "In 20 min", activity: "Reminder" });
    } else if (cmd.includes("treadmill")) {
      updatedSchedule.push({ time: "Today", activity: "Treadmill - 15 min" });
    }

    setSchedule(updatedSchedule);
    setCommand("");
  };

  return createElement("div", { className: "app-container" },
    createElement("header", null,
      createElement("h1", null, "HumanTime"),
      createElement("p", null, "Your built-in wellness assistant ⏳")
    ),
    createElement("section", { className: "section" },
      createElement("h2", null, "🛠️ Choose Your Human Needs"),
      createElement("div", { className: "grid" },
        HUMAN_NEEDS.map((need) =>
          createElement("label", { key: need, className: "checkbox-card" },
            createElement("input", {
              type: "checkbox",
              checked: selectedNeeds.includes(need),
              onChange: () => handleToggleNeed(need)
            }),
            createElement("span", null, ICONS[need] + " " + need)
          )
        )
      )
    ),
    createElement("section", { className: "section" },
      createElement("h2", null, "📅 Today's Schedule"),
      createElement("div", { className: "schedule" },
        schedule.map((item, index) =>
          createElement("div", { key: index, className: "card" },
            createElement("span", { className: "time" }, item.time),
            createElement("span", { className: "activity" }, ICONS[item.activity] || "🔔", " ", item.activity)
          )
        )
      )
    ),
    createElement("section", { className: "section" },
      createElement("h2", null, "🎙️ Simulate a Voice Command"),
      createElement("div", { className: "voice-box" },
        createElement("input", {
          type: "text",
          placeholder: "e.g., 'No lunch today'",
          value: command,
          onChange: (e) => setCommand(e.target.value)
        }),
        createElement("button", { onClick: handleCommand }, "Submit")
      )
    )
  );
}

const root = createRoot(document.getElementById("root"));
root.render(createElement(App));
