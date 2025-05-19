import React from "react";
import { CircleUserRound, Plus, Check, Delete } from "lucide-react";
import useSWR from "swr";
import toast from "react-hot-toast";
import EditTodo from "./ui/EditTodo";
import Profile from "./Profile";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url, options = {}) => {
  const token = localStorage.getItem("access_token"); // Get token from localStorage

  return fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Add Authorization header if token exists
    },
    credentials: "include", // Include cookies if any
    mode: "cors",
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());
};

const Todos = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "https://note-app-ffeu.onrender.com/api/todos",
    fetcher
  );

  if (error) {
    return <h1 className="text-2xl py-2 text-center">Something went wrong!</h1>;
  }
  if (isLoading) {
    return <h1 className="text-2xl py-2 text-center">Loading....</h1>;
  }

  function handleError(error) {
    toast.error(error);
    throw new Error(error);
  }

  async function handleAddTodo(e) {
    e.preventDefault();

    const formData = new FormData(e.target); // Declare formData here
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
      // Ensure data is iterable by defaulting to an empty array if data is undefined.
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
    <div className="sm:mx-auto mt-20 sm:max-w-lg sm:px-4 w-full sm:h-[800px] h-[700px] m-auto overflow-y-scroll scrollbar-hidden max-w-sm px-4 border-1 sm:p-4 border-t-0 rounded-md flex flex-col sm:gap-6 gap-2 bg-[#004643]">
      <div className="flex justify-end">
        <Profile />
      </div>
      <h1 className="bg-gradient-to-r font-bold text-4xl text-center mb-4 text-[#fffffe]">
        MyNotes
      </h1>
      <form onSubmit={handleAddTodo} className="flex gap-4 items-center ">
        <input
          type="text"
          placeholder="Enter your note..."
          name="title"
          id="title"
          required
          className="w-full h-9 p-4 rounded-md bg-[#e8e4e6] text-[#0f3433] outline-none"
        />
        <button className="cursor-pointer h-9 rounded-md px-4 text-base flex items-center bg-[#f9bc60] text-[#001e1d]">
          <Plus
            size={20}
            className="transition ease-linear group-hover:stroke-white"
          />
        </button>
      </form>
      {data?.length ? (
        <div className=" flex flex-col rounded gap-.5 justify-start items-start text-xl font-medium text-violet-700">
            {data.map((todo, index) => (
              <div
                key={todo._id}
                id={`todo-${todo._id}`}
                className={`flex w-full justify-start items-start py-2 ${
                  index === data.length - 1 ? "border-b-0" : "my-1"
                }`}
              >
                <span
                  className={`font-['Patrick Hand', sans] font-bold flex-1 px-3 py-1 text-sm sm:min-h-auto min-h-[90px] bg-[#abd1c6] text-[#0f3433] rounded-sm ${
                    todo.isCompleted ? "line-through text-[#63657b]" : ""
                  }`}
                >
                  {todo.title}
                </span>
                <div className="px-3 flex gap-2 ml-1 sm:flex-row flex-col">
                  <div
                    className="cursor-pointer "
                    onClick={() => handleComplete(todo._id, todo.isCompleted)}
                  >
                    <Check
                      className={`transition ease-in-out ${
                        todo.isCompleted ? "text-[#fffffe]" : "text-[#fffffe]"
                      }`}
                    />
                  </div>

                  {/* ✅ Delete Button with hover + click animation */}
                  <div
                    className="cursor-pointer "
                    onClick={() => deleteTodo(todo._id)}
                  >
                    <Delete className="text-[#fffffe]  transition ease-in-out" />
                  </div>

                  <EditTodo
                    handleUpdate={handleUpdate}
                    id={todo._id}
                    title={todo.title}
                  />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <span>"You don't have any todo"</span>
      )}
    </div>
  );
};

export default Todos;
