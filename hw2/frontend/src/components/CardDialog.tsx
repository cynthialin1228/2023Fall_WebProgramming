import { useState } from "react";

import { Delete as DeleteIcon } from "@mui/icons-material";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

import useCards from "@/hooks/useCards";
import { createCard, deleteCard, updateCard } from "@/utils/client";

// this pattern is called discriminated type unions
// you can read more about it here: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions
// or see it in action: https://www.typescriptlang.org/play#example/discriminate-types
type NewCardDialogProps = {
  variant: "new";
  open: boolean;
  onClose: () => void;
  listId: string;
};
type DuplicateCardDialogProps = {
  variant: "duplicate";
  open: boolean;
  onClose: () => void;
  title: string;
  singer: string;
  lin: string;
};

type EditCardDialogProps = {
  variant: "edit";
  open: boolean;
  onClose: () => void;
  listId: string;
  cardId: string;
  title: string;
  singer: string;
  lin: string;
};

type CardDialogProps = NewCardDialogProps | EditCardDialogProps | DuplicateCardDialogProps;

export default function CardDialog(props: CardDialogProps) {
  const { variant, open, onClose} = props;
  const title = variant === "new" ? "" : props.title;
  const singer = variant === "new" ? "" : props.singer;
  const lin = variant === "new" ? "" : props.lin;
  const listId = variant === "duplicate" ?  "": props.listId;
  const [editingTitle, setEditingTitle] = useState(variant === "new");
  const [editingSinger, setEditingSinger] = useState(variant === "new");
  const [editingLin, setEditingLin] = useState(variant === "new");

  // using a state variable to store the value of the input, and update it on change is another way to get the value of a input
  // however, this method is not recommended for large forms, as it will cause a re-render on every change
  // you can read more about it here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
  const [newTitle, setNewTitle] = useState(title);
  const [newSinger, setNewSinger] = useState(singer);
  const [newLin, setNewLin] = useState(lin);
  const [newListId, setNewListId] = useState(listId);

  const { lists, fetchCards } = useCards();

  const handleClose = () => {
    onClose();
    if(variant === "new") {
      setNewTitle("");
      setNewSinger("");
      setNewLin("");
    }else{
      setNewTitle(title);
      setNewSinger(singer);
      setNewLin(lin);
    }
    if (variant === "edit") {
      setNewListId(listId);
    }else{
      setNewListId("");
    }
  };

  const handleSave = async () => {
    try {
      if(newTitle === ""){
        alert("Error: Title cannot be empty");
        return;
      }
      if(newSinger === ""){
        alert("Error: Singer cannot be empty");
        return;
      }
      if(newLin === ""){
        alert("Error: Link cannot be empty");
        return;
      }
      if(newListId === ""){
        alert("Error: List cannot be empty");
        return;
      }
      if (variant === "new" || variant === "duplicate") {
        await createCard({
          title: newTitle,
          singer: newSinger,
          lin: newLin,
          list_id: newListId,
        });
      } else {
        if (
          newTitle === title &&
          newSinger === singer &&
          newLin === lin &&
          newListId === listId
        ) {
          return;
        }
        await updateCard(props.cardId, {
          title: newTitle,
          singer: newSinger,
          lin: newLin,
          list_id: newListId,
        });
      }
      fetchCards();
    } catch (error) {
      alert("Error: Failed to save card");
    } finally {
      handleClose();
    }
  };

  const handleDelete = async () => {
    if (variant !== "edit") {
      return;
    }
    try {
      await deleteCard(props.cardId);
      fetchCards();
    } catch (error) {
      alert("Error: Failed to delete card");
    } finally {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="flex gap-4">
        {editingTitle ? (
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingTitle(false);
              }
            }}
          >
            <Input
              autoFocus
              defaultValue={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="grow"
              placeholder="Enter a title for this card..."
            />
          </ClickAwayListener>
        ) : (
          <button
            onClick={() => setEditingTitle(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newTitle}</Typography>
          </button>
        )}
        <Select
          value={newListId}
          onChange={(e) => setNewListId(e.target.value)}
        >
          {lists.map((list) => (
            <MenuItem value={list.id} key={list.id}>
              {list.name}
            </MenuItem>
          ))}
        </Select>
        {variant === "edit" && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent className="w-[600px]">
        {editingSinger ? (
          <ClickAwayListener 
            onClickAway={() => {
              if (variant === "edit") {
                setEditingSinger(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={newSinger}
              placeholder="Add a more detailed singer..."
              onChange={(e) => setNewSinger(e.target.value)}
            />
          </ClickAwayListener>
        ):(
          <button
            onClick={() => setEditingSinger(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newSinger}</Typography>
          </button>
        )}
        <div>{editingLin ? ( 
          <ClickAwayListener
            onClickAway={() => {
              if (variant === "edit") {
                setEditingLin(false);
              }
            }}
          >
            <textarea
              className="bg-white/0 p-2"
              autoFocus
              defaultValue={newLin}
              placeholder="Add a more detailed link..."
              onChange={(e) => setNewLin(e.target.value)}
            />
          </ClickAwayListener>
        ):(
          <button
            onClick={() => setEditingLin(true)}
            className="w-full rounded-md p-2 hover:bg-white/10"
          >
            <Typography className="text-start">{newLin}</Typography>
          </button>
        )}
        </div>

        <DialogActions>
          <Button onClick={handleSave}>save</Button>
          <Button onClick={handleClose}>close</Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
