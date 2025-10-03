import React, { useState } from "react";
import { CircleUserRound, Plus, Check, Delete, Eye } from "lucide-react";
import useSWR from "swr";
import toast from "react-hot-toast";
import EditTodo from "./ui/EditTodo";
import Profile from "./Profile";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url, options = {}) => {
  const token = localStorage.getItem("access_token");

  return fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    mode: "cors",
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());
};

const TodoDetail = ({ todo, onClose }) => {
  console.log(todo);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">Note Details</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors duration-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-white/70 text-sm font-medium">Title</label>
            <p className="text-white text-lg mt-1">{todo.title}</p>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium">Status</label>
            <p
              className={`text-lg mt-1 ${
                todo.isCompleted ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {todo.isCompleted ? "Completed" : "Pending"}
            </p>
          </div>

          <div>
            <label className="text-white/70 text-sm font-medium">Created</label>
            <p className="text-white/80 text-lg mt-1">
              {(() => {
                const date = new Date(todo.createdAt || Date.now());
                const weekday = date.toLocaleString("en-US", {
                  weekday: "short",
                });
                const day = date.getDate();
                const month = date.toLocaleString("en-US", { month: "short" });
                const year = date.getFullYear();
                return `${weekday} ${day} ${month} ${year}`;
              })()}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Todos = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "https://note-app-ffeu.onrender.com/api/todos",
    fetcher
  );
  const [selectedTodo, setSelectedTodo] = useState(null);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004643] to-[#0c7b6e]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
        >
          <h1 className="text-2xl font-bold text-white">
            Something went wrong!
          </h1>
          <p className="text-white/70 mt-2">Please try again later</p>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#004643] to-[#0c7b6e]">
        <motion.div
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#f9bc60] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  function handleError(error) {
    toast.error(error);
    throw new Error(error);
  }

  async function handleAddTodo(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get("title");

    if (!title.trim().length) {
      toast.error("Todo can't be empty");
      return;
    }
    const newTodo = {
      title: `${title} adding...`,
      _id: Date.now().toString(),
      isCompleted: false,
    };

    async function addTodo() {
      const response = await fetcher(
        "https://note-app-ffeu.onrender.com/api/todos",
        {
          method: "POST",
          body: { title },
          credentials: "include",
        }
      );
      if (response.error) {
        handleError(response.error);
      }
      return [...(data || []), response];
    }

    await mutate(addTodo, {
      optimisticData: [...(data || []), newTodo],
      revalidate: true,
      rollbackOnError: true,
    });
    e.target.reset();
  }

  async function deleteTodo(id) {
    document.getElementById(`todo-${id}`).classList.add("fade-out");
    toast.success("Todo Deleted!");
    await mutate(
      async () => {
        const response = await fetcher(
          `https://note-app-ffeu.onrender.com/api/todos/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.filter((todo) => todo._id !== id);
      },
      {
        optimisticData: data.filter((todo) => todo._id !== id),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async function handleComplete(id, isCompleted) {
    await mutate(
      async () => {
        const response = await fetcher(
          `https://note-app-ffeu.onrender.com/api/todos/${id}`,
          {
            method: "PUT",
            body: { isCompleted: !isCompleted },
            credentials: "include",
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) => {
          if (todo._id === id) {
            return { ...todo, isCompleted: !isCompleted };
          }
          return todo;
        });
      },
      {
        optimisticData: data.filter((todo) => {
          if (todo._id === id) {
            return { ...todo, isCompleted: !isCompleted };
          }
          return todo;
        }),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  async function handleUpdate(formData) {
    const title = formData.get("title");
    const id = formData.get("id");

    await mutate(
      async () => {
        const response = await fetcher(
          `https://note-app-ffeu.onrender.com/api/todos/${id}`,
          {
            method: "PUT",
            body: { title },
            credentials: "include",
          }
        );
        if (response.error) {
          handleError(response.error);
        }
        return data.map((todo) =>
          todo._id === id ? { ...todo, title } : todo
        );
      },
      {
        optimisticData: data.map((todo) =>
          todo._id === id ? { ...todo, title } : todo
        ),
        rollbackOnError: true,
        revalidate: false,
      }
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#004643] to-[#0c7b6e] py-8 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg mx-auto bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-bold bg-gradient-to-r from-white to-[#f9bc60] bg-clip-text text-transparent"
              >
                MyNotes
              </motion.h1>
              <Profile />
            </div>

            {/* Add Todo Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onSubmit={handleAddTodo}
              className="flex gap-3 mb-8"
            >
              <input
                type="text"
                placeholder="Enter your note..."
                name="title"
                id="title"
                required
                className="flex-1 h-12 px-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-12 w-12 rounded-xl bg-[#f9bc60] text-[#001e1d] flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus size={20} />
              </motion.button>
            </motion.form>

            {/* Todos List */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-hidden scrollbar-thumb-white/20 scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {data?.length ? (
                  data.map((todo, index) => (
                    <motion.div
                      key={todo._id}
                      id={`todo-${todo._id}`}
                      layout
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -100, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`group flex items-center gap-3 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-200 ${
                        todo.isCompleted ? "opacity-75" : ""
                      }`}
                    >
                      {/* Check Button */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          handleComplete(todo._id, todo.isCompleted)
                        }
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                          todo.isCompleted
                            ? "bg-green-500 border-green-500"
                            : "border-white/40 hover:border-white"
                        }`}
                      >
                        {todo.isCompleted && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check size={16} className="text-white" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Todo Text */}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`font-medium text-white break-words line-clamp-1 ${
                            todo.isCompleted ? "line-through text-white/60" : ""
                          }`}
                        >
                          {todo.title}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {/* View Detail Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedTodo(todo)}
                          className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/30 transition-all duration-200"
                        >
                          <Eye size={16} className="text-blue-300" />
                        </motion.button>

                        <EditTodo
                          handleUpdate={handleUpdate}
                          id={todo._id}
                          title={todo.title}
                        />

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteTodo(todo._id)}
                          className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center hover:bg-red-500/30 transition-all duration-200"
                        >
                          <Delete size={16} className="text-red-300" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-white/50 text-lg mb-2">
                      No notes yet
                    </div>
                    <div className="text-white/30 text-sm">
                      Add your first note above!
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Todo Detail Modal */}
      <AnimatePresence>
        {selectedTodo && (
          <TodoDetail
            todo={selectedTodo}
            onClose={() => setSelectedTodo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Todos;
