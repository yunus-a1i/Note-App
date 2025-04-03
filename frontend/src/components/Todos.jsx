import React from "react";
import { CircleUserRound, Plus, Check, Delete } from "lucide-react";
import useSWR from "swr";
import toast from "react-hot-toast";
import EditTodo from "./ui/EditTodo";
import Profile from "./Profile";
import { motion, AnimatePresence } from "framer-motion";


const fetcher = (url, options = {}) => {
  // Return the fetch promise so that we can work with its resolved value.
  return fetch(url, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/JSON" },
    credentials: "include",
    mode: "cors",
    body: options.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());
};

const Todos = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "https://note-app-wd85.onrender.com/api/todos",
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
      const response = await fetcher("https://note-app-wd85.onrender.com/api/todos", {
        method: "POST",
        body: { title },
        credentials: "include",
      });
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
          `https://note-app-wd85.onrender.com/api/todos/${id}`,
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
          `https://note-app-wd85.onrender.com/api/todos/${id}`,
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
          `https://note-app-wd85.onrender.com/api/todos/${id}`,
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
    <div className="animation mx-auto mt-20 max-w-lg px-4 w-full min-h-[800px] p-4 rounded-md flex flex-col gap-6 bg-gray-100">
      <div className='flex justify-end'>
        <Profile />
      </div>
      <h1 className="heading bg-gradient-to-r font-bold text-4xl text-center mb-4 ">
        MyNotes
      </h1>
      <form onSubmit={handleAddTodo} className="flex gap-4 items-center ">
        <input
          type="text"
          placeholder="Enter your note..."
          name="title"
          id="title"
          required
          className="w-full h-9 p-4 rounded-md outline-1 outline-gray-200"
        />
        <button className="cursor-pointer h-9 rounded-md border bg-transparent px-4 text-base flex items-center hover:bg-violet-500 transition ease-linear group border-violet-200">
          <Plus
            size={20}
            className="transition ease-linear group-hover:stroke-white"
          />
        </button>
      </form>
      {data?.length ? (
        <div className=" border-1 border-gray-200 flex flex-col rounded text-violet-700" >
          <AnimatePresence>
  {data.map((todo, index) => (
    <motion.div
      key={todo._id}
      id={`todo-${todo._id}`}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`flex h-10 items-center w-full ${
        index === data.length - 1 ? "border-b-0" : "border-b-1 border-gray-100 mt-1"
      }`}
    >
      <span
        className={`flex-1 px-3 ${
          todo.isCompleted ? "line-through text-[#63657b]" : ""
        }`}
      >
        {todo.title}
      </span>
      <div className="px-3 flex gap-2">
        {/* ✅ Check Button with hover + click animation */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
          onClick={() => handleComplete(todo._id, todo.isCompleted)}
        >
          <Check
            className={`transition ease-in-out ${
              todo.isCompleted ? "text-violet-500" : "text-blue-500"
            }`}
          />
        </motion.div>

        {/* ✅ Delete Button with hover + click animation */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.9 }}
          className="cursor-pointer"
          onClick={() => deleteTodo(todo._id)}
        >
          <Delete className="text-red-500 transition ease-in-out" />
        </motion.div>

        <EditTodo handleUpdate={handleUpdate} id={todo._id} title={todo.title} />
      </div>
    </motion.div>
  ))}
</AnimatePresence>



        </div>
      ) : (
        <span>"You don't have any todo"</span>
      )}
    </div>
  );
};

export default Todos;
