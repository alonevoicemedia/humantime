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
  const generateSchedule = (needs) => {
    const startHour = 10; // Start at 10:00 AM
    return needs.map((need, index) => {
      const hour = startHour + index;
      const suffix = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour;
      return {
        time: `${displayHour}:00 ${suffix}`,
        activity: need
      };
    });
  };

const [selectedNeeds, setSelectedNeeds] = useState(() => {
  const saved = localStorage.getItem("humanNeeds");
  return saved ? JSON.parse(saved) : [...HUMAN_NEEDS];
});
  const [schedule, setSchedule] = useState(generateSchedule(HUMAN_NEEDS));
  const [command, setCommand] = useState("");

  const handleToggleNeed = (need) => {
  let updated;
  if (selectedNeeds.includes(need)) {
    updated = selectedNeeds.filter((n) => n !== need);
  } else {
    updated = [...selectedNeeds, need];
  }
  setSelectedNeeds(updated);
  localStorage.setItem("humanNeeds", JSON.stringify(updated));
    
    if ("Notification" in window && Notification.permission === "granted") {
    new Notification("✅ Preferences saved to HumanTime");
  }

  const newSchedule = generateSchedule(updated);
  setSchedule(newSchedule);
  scheduleNotifications(newSchedule); // ⬅️ This line is new!
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
const scheduleNotifications = (items) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  items.forEach((item, index) => {
    setTimeout(() => {
      new Notification(`${ICONS[item.activity] || "⏰"} Time for ${item.activity}`);
    }, (index + 1) * 60000); // sends each notification 1 min apart (demo pacing)
  });
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
    ),
  createElement("section", { className: "section" },
    createElement("h2", null, "🔔 Notifications"),
    createElement("button", {
      onClick: () => {
        requestNotificationPermission();
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("💧 Time to hydrate!");
        }
      }
    }, "Send Test Notification")
  )
);
}

const root = createRoot(document.getElementById("root"));
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("✅ Notifications enabled for HumanTime!");
      }
    });
  }
}

root.render(createElement(App));
