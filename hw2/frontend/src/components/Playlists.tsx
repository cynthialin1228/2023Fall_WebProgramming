import { useRef, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { deleteList, updateList } from "@/utils/client";

import Card from "./Card";
import type { CardProps } from "./Card";
import CardDialog from "./CardDialog";

export type CardListProps = {
  id: string;
  name: string;
  description: string;
  photo: string;
  showDeleteIcon: boolean;
  // num_cards: number;
  cards: CardProps[];
};

export default function PlayLists({ id, name, description, photo, cards, showDeleteIcon }: CardListProps) {
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  // const [editingNumCards, setEditingNumCards] = useState(false);
  const { fetchLists } = useCards();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputRefDes = useRef<HTMLInputElement>(null);

  const handleUpdateName = async () => {
    if (!inputRef.current) return;

    const newName = inputRef.current.value;
    if (newName !== name) {
      try {
        await updateList(id, { name: newName });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list name");
      }
    }
    setEditingName(false);
  };
  
  const handleUpdateDescription = async () => {
    if (!inputRefDes.current) return;

    const newDescription = inputRefDes.current.value;
    if (newDescription !== description) {
      try {
        await updateList(id, { description: newDescription });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list description");
      }
    }
    setEditingDescription(false);
  }

  const handleUpdatePhoto = async () => {
    if (!inputRef.current) return;

    const newPhoto = inputRef.current.value;
    if (newPhoto !== photo) {
      try {
        await updateList(id, { photo: newPhoto });
        fetchLists();
      } catch (error) {
        alert("Error: Failed to update list photo");
      }
    }
    setEditingPhoto(false);
  }

  const handleDelete = async () => {
    try {
      await deleteList(id);
      fetchLists();
    } catch (error) {
      alert("Error: Failed to delete list");
    }
  };

  return (
    <>
      <Paper className="w-80 p-6">
       <div className="flex gap-4">
            <div>
              <button
                onClick={() => setEditingPhoto(true)}
                className="w-full rounded-md p-2 hover:bg-white/10"
              >
                <img
                  src={photo}
                  alt="List Photo"
                  style={{ width: "100px", height: "100px" }} // Adjust width and height as needed
                />
              </button>
            </div>
        </div>
       <div className="flex gap-4">
              <Typography className="text-start" variant="h4">
                {name}
              </Typography>
       <div className="grid place-items-center">
            {showDeleteIcon && ( // Conditional rendering of the delete icon
              <IconButton color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
        </div>
        <div>{cards.length} songs</div>
        {/* <div className="flex flex-col gap-4">
          {cards.map((card) => (
            <Card key={card.id} {...card} />
          ))}
          <Button
            variant="contained"
            onClick={() => setOpenNewCardDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a card
          </Button> */}
        {/* </div> */}
      </Paper>
      <CardDialog
        variant="new"
        open={openNewCardDialog}
        onClose={() => setOpenNewCardDialog(false)}
        listId={id}
      />
    </>
  );
}
