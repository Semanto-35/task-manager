import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function TaskCard({ task }) {
  const queryClient = useQueryClient();


  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 flex justify-between items-center mb-2">
      <span>{task.title}</span>
      <Button onClick={() => deleteTaskMutation.mutate(task._id)}>Delete</Button>
    </Card>
  );
}
