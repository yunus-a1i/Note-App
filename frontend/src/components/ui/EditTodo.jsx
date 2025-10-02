import * as Dialog from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const EditTodo = ({ title, id, handleUpdate }) => {
  const [updateTitle, setUpdateTitle] = useState(title);
  const [open, setOpen] = useState(false);

  const handleEdit = async (formData) => {
    await handleUpdate(formData);
    setOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", updateTitle);
    handleEdit(formData);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center hover:bg-blue-500/30 transition-all duration-200"
        >
          <Pencil size={16} className="text-blue-300" />
        </motion.button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#004643] p-6 rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Dialog.Title className="text-xl font-bold text-white mb-2">
              Edit Note
            </Dialog.Title>
            <Dialog.Description className="text-sm text-white/60 mb-6">
              Make changes to your note here. Click save when you're done.
            </Dialog.Description>
            <form onSubmit={handleSubmit}>
              <input type="hidden" value={id} name="id" />
              <label
                htmlFor="title"
                className="block text-sm font-medium text-white mb-2"
              >
                Edit Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={updateTitle}
                onChange={(e) => setUpdateTitle(e.target.value)}
                className="w-full border border-white/30 bg-white/10 text-white rounded-xl p-3 mb-6 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f9bc60] focus:border-transparent transition-all duration-200"
                placeholder="Enter your note..."
              />
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="px-4 py-2 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                </Dialog.Close>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#f9bc60] text-[#001e1d] font-medium hover:bg-[#e8ab4f] transition-all duration-200"
                >
                  Save Changes
                </motion.button>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditTodo;
