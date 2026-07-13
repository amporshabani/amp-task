export interface ITask {
  _id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  subTasks?: ITask[];
  createdAt: string;
  updatedAt: string;
}
