"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

// Define initial checklist items
const initialChecklistItems = [
  { id: 1, text: "Register for the event", completed: false },
  { id: 2, text: "Join a team", completed: false },
  { id: 3, text: "Read the Code of Conduct", completed: false },
  { id: 4, text: "Review the event schedule", completed: false },
  { id: 5, text: "Pack your laptop and charger", completed: false },
  { id: 6, text: "Bring your student ID", completed: false },
  { id: 7, text: "Prepare your hack ideas", completed: false },
];

export default function ChecklistPage() {
  // Manage task completion state with `useState`
  const [tasks, setTasks] = useState(initialChecklistItems);

  // Calculate the number of completed tasks
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;

  // Handle task toggle
  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Your Pre-Hackathon Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 mb-4">
            Complete these tasks to be fully prepared for the event.
          </p>
          <Progress value={progress} className="mb-4 h-2" />
          <div className="space-y-3">
            {/* Render each task item */}
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span
                  className={`text-lg ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.text}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Display congratulatory message when all tasks are completed */}
    </div>
  );
}
