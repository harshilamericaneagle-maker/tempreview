"use client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
  getBusinessByOwner,
  getTasksByBusiness,
  addTask,
  updateTaskStatus,
  IssueTask,
  Business,
  getReviewsByBusiness,
  Review,
} from "@/lib/store";
import { CheckCircle2, Circle, Clock, MoreHorizontal, Plus, AlertCircle } from "lucide-react";

export default function TasksPage() {
  const { user, activeLocation } = useAuth();
  const [business, setBusiness] = useState<Business | null>(null);
  const [tasks, setTasks] = useState<IssueTask[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    reviewId: "",
    department: "housekeeping",
    issueType: "",
    priority: "medium",
    roomNumber: "",
  });

  const refresh = () => {
    if (!user) return;
    const biz = getBusinessByOwner(user.id);
    if (!biz) return;
    setBusiness(biz);
    setTasks(
      getTasksByBusiness(biz.id).filter(
        (t) => !activeLocation || t.locationId === activeLocation.id,
      ),
    );
    setReviews(
      getReviewsByBusiness(biz.id).filter(
        (r) => !activeLocation || r.locationId === activeLocation.id,
      ),
    );
  };

  useEffect(() => {
    refresh();
  }, [user, activeLocation]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    addTask({
      businessId: business.id,
      reviewId: newTask.reviewId || undefined,
      department: newTask.department as any,
      issueType: newTask.issueType,
      priority: newTask.priority as any,
      status: "open",
      roomNumber: newTask.roomNumber || undefined,
      locationId: activeLocation?.id,
    });
    setShowNewTaskModal(false);
    setNewTask({
      reviewId: "",
      department: "housekeeping",
      issueType: "",
      priority: "medium",
      roomNumber: "",
    });
    refresh();
  };

  const handleStatusChange = (taskId: string, newStatus: IssueTask["status"]) => {
    updateTaskStatus(taskId, newStatus);
    refresh();
  };

  if (!business) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const columns = [
    {
      id: "open",
      title: "Open Issues",
      color: "border-blue-500/30 bg-blue-500/5",
      icon: AlertCircle,
    },
    {
      id: "in_progress",
      title: "In Progress",
      color: "border-amber-500/30 bg-amber-500/5",
      icon: Clock,
    },
    {
      id: "resolved",
      title: "Resolved",
      color: "border-emerald-500/30 bg-emerald-500/5",
      icon: CheckCircle2,
    },
  ] as const;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "high":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "low":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    }
  };

  return (
    <div className="p-8 h-screen overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Action Tracker</h1>
          <p className="text-muted-foreground text-sm">
            Track operational fixes derived from guest reviews.
          </p>
        </div>
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full pb-8 min-w-[900px]">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="flex-1 flex flex-col min-w-[300px]">
                <div
                  className={`px-4 py-3 rounded-t-xl border-t border-x ${col.color} border-b-transparent flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2">
                    <col.icon className="w-4 h-4 text-foreground/70" />
                    <h3 className="font-semibold text-sm capitalize">{col.title}</h3>
                  </div>
                  <span className="text-xs bg-background/50 px-2.5 py-1 rounded-full text-muted-foreground font-medium">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex-1 border-x border-b border-border/50 bg-secondary/10 rounded-b-xl p-3 overflow-y-auto space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground/50 text-xs">
                      No tasks
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="glass-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          <div className="flex gap-1 relative opacity-0 group-hover:opacity-100 transition-opacity">
                            {col.id !== "open" && (
                              <button
                                onClick={() => handleStatusChange(task.id, "open")}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-white"
                              >
                                <Circle className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {col.id !== "in_progress" && (
                              <button
                                onClick={() => handleStatusChange(task.id, "in_progress")}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-white"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {col.id !== "resolved" && (
                              <button
                                onClick={() => handleStatusChange(task.id, "resolved")}
                                className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-white"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <h4 className="text-sm font-medium text-white mb-1">{task.issueType}</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="capitalize">{task.department.replace("_", " ")}</span>
                          {task.roomNumber && (
                            <span className="bg-white/5 px-2 py-0.5 rounded">
                              Room {task.roomNumber}
                            </span>
                          )}
                        </div>
                        {task.reviewId && (
                          <div className="pt-3 border-t border-border/50">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                              Linked Review
                            </span>
                            <p className="text-xs text-foreground/80 mt-1 line-clamp-1 italic">
                              "
                              {reviews.find((r) => r.id === task.reviewId)?.text ||
                                "Deleted Review"}
                              "
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleCreateTask}
            className="glass-card rounded-2xl p-6 w-full max-w-md border border-border"
          >
            <h3 className="text-lg font-bold text-white mb-4">Create New Task</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Issue Description
                </label>
                <input
                  required
                  value={newTask.issueType}
                  onChange={(e) => setNewTask({ ...newTask, issueType: e.target.value })}
                  type="text"
                  placeholder="e.g. Clean AC filter"
                  className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Department
                  </label>
                  <select
                    value={newTask.department}
                    onChange={(e) => setNewTask({ ...newTask, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
                  >
                    <option value="housekeeping">Housekeeping</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="front_desk">Front Desk</option>
                    <option value="management">Management</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Room / Area (Optional)
                  </label>
                  <input
                    value={newTask.roomNumber}
                    onChange={(e) => setNewTask({ ...newTask, roomNumber: e.target.value })}
                    type="text"
                    placeholder="e.g. 112"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Link Review (Optional)
                  </label>
                  <select
                    value={newTask.reviewId}
                    onChange={(e) => setNewTask({ ...newTask, reviewId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm max-w-[200px] truncate"
                  >
                    <option value="">None</option>
                    {reviews
                      .filter((r) => r.rating <= 3)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.customerName} - {r.rating}★
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowNewTaskModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
