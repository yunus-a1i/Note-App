import * as Dialog from "@radix-ui/react-dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";

const EditTodo = ({ title, id, handleUpdate }) => {
  const [updateTitle, setUpdateTitle] = useState(title);
  const [open, setOpen] = useState(false); // Control dialog state

  const handleEdit = async (formData) => {
    await handleUpdate(formData); // Call handleUpdate function
    setOpen(false); // Close the dialog after updating
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="iconHover">
          <Pencil className="text-[#fffffe] h-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg">
          <Dialog.Title className="text-lg font-semibold">Edit Todo</Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Make changes to your todo here. Click save when you're done.
          </Dialog.Description>
          <form
            action={(formData) => handleEdit(formData)}
          >
            <input type="hidden" value={id} name="id" />
            <label htmlFor="title" className="block text-sm font-medium">
              Edit Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
              className="w-full border rounded p-2 my-2"
            />
            <div className="flex justify-end gap-2 mt-3">
              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                Save Changes
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EditTodo;
