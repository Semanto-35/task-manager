import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DndContext, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from "@dnd-kit/core";
import axios from "axios"
import TaskColumn from "./TaskColumn";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export default function TaskBoard() {
  const queryClient = useQueryClient();
  const categories = ["To Do", "In Progress", "Done"];

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);
      return data;
    },
  });

  console.log(tasks);

  const addTaskMutation = useMutation({
    mutationFn: (newTask) => axios.post(`${import.meta.env.VITE_API_URL}/tasks`, newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, category, order }) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/tasks/${id}`, { category, order }),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id;
    const overId = over.id;
  
    const activeTask = tasks.find((task) => task._id === activeId);
    const overTask = tasks.find((task) => task._id === overId);
  
    if (!activeTask || !overTask) return;
  
    if (activeTask.category !== overTask.category) {
      updateTaskMutation.mutate({ id: activeId, category: overTask.category, order: tasks.length });
    } else {
      const categoryTasks = tasks.filter((task) => task.category === activeTask.category);
      const oldIndex = categoryTasks.findIndex((task) => task._id === activeId);
      const newIndex = categoryTasks.findIndex((task) => task._id === overId);
      const reorderedTasks = arrayMove(categoryTasks, oldIndex, newIndex);
      reorderedTasks.forEach((task, index) => updateTaskMutation.mutate({ id: task._id, order: index }));
    }
  };
  

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Task Manager</h1>
      <input
        type="text"
        placeholder="New Task..."
        onKeyDown={(e) => e.key === "Enter" && addTaskMutation.mutate({ title: e.target.value, category: "To Do" })}
      />
  
      {isLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {categories.map((category) => (
              <TaskColumn key={category} category={category} tasks={tasks.filter((task) => task.category === category)} />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
  
}
