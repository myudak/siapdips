export type Status = string;

export interface Label {
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: "🔥 PENTING!!" | "⏳ Diperhatikan" | "🌿 santai" | "none";
  labels?: Label[];
  subtasks?: Task[];
  comments?: string[];
  _delete?: boolean;
}

export interface Column {
  id: Status;
  title: string;
  tasks: Task[];
  position: number;
}
