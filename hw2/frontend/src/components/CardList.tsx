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

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Checkbox from '@mui/material/Checkbox';
import "./table.css";
export type CardListProps = {
  id: string;
  name: string;
  description: string;
  photo: string;
  showDeleteIcon: boolean;
  // num_cards: number;
  cards: CardProps[];
};

export default function CardList({ id, name, description, photo, cards, showDeleteIcon }: CardListProps) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [openNewCardDialog, setOpenNewCardDialog] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(false);
  const [editingCards, setEditingCards] = useState(false);
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
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCards([]); // Clear the selected cards if "Select All" is unchecked
    } else {
      setSelectedCards(cards.map((card) => card.id)); // Select all cards when "Select All" is checked
    }
    setSelectAll(!selectAll); // Toggle the "Select All" state
  };

  const handleCardSelect = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
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
      <Paper className="w-180 p-6">
        <Button sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }} onClick={()=>setEditingCards(!editingCards)}> {editingCards ? "Done" : "Edit Playlist"} </Button>
            {showDeleteIcon && ( // Conditional rendering of the delete icon
              <IconButton color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            )}
        <Divider variant="middle" sx={{ mt: 1, mb: 2 }} />
        <div className="flex gap-4">
       {editingPhoto ? (
            <ClickAwayListener onClickAway={handleUpdatePhoto}>
              <Input
                autoFocus
                defaultValue={photo}
                className="grow"
                placeholder="Enter a new photo for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
              />
            </ClickAwayListener>
          ) : (
            <div>
              {editingCards? (<button
                onClick={() => setEditingPhoto(true)}
                className="w-full rounded-md p-2 hover:bg-white/10"
              >
                <img
                  src={photo}
                  alt="List Photo"
                  style={{ width: "100px", height: "100px" }} // Adjust width and height as needed
                />
              </button>):(<img
                  src={photo}
                  alt="List Photo"
                  style={{ width: "100px", height: "100px" }} // Adjust width and height as needed
                />)}
            </div>
          )}
        </div>
       <div className="flex gap-4">
          {editingName ? (
            <ClickAwayListener onClickAway={handleUpdateName}>
              <Input
                autoFocus
                defaultValue={name}
                className="grow"
                placeholder="Enter a new name for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRef}
              />
            </ClickAwayListener>
          ) : (
            <div>
              {editingCards?(<button
              onClick={() => setEditingName(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start" variant="h4">
                {name}
              </Typography>
            </button>):(<Typography className="text-start" variant="h4">
                {name}
              </Typography>)}
            
            </div>
          )}
        </div>
        <div className="flex gap-4">
          {editingDescription ? (
            <ClickAwayListener onClickAway={handleUpdateDescription}>
              <Input
                autoFocus
                defaultValue={description}
                className="grow"
                placeholder="Enter a new des for this list..."
                sx={{ fontSize: "2rem" }}
                inputRef={inputRefDes}
              />
            </ClickAwayListener>
          ) : (
            <div>
              {editingCards?(<button
              onClick={() => setEditingDescription(true)}
              className="w-full rounded-md p-2 hover:bg-white/10"
            >
              <Typography className="text-start" variant="h4">
                {description}
              </Typography>
            </button>):(<Typography className="text-start" variant="h4">
                {description}
              </Typography>)}
            
            </div>
          )}
        </div>
        <div>{cards.length} songs</div>
        {editingCards && ( <TableContainer className="responsive-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox checked={selectAll} onChange={handleSelectAll}/>
                </TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Singer</TableCell>
                <TableCell>Link</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCards.includes(card.id)}
                      onChange={() => handleCardSelect(card.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Card {...card} />
                  </TableCell>
                  <TableCell>{card.title}</TableCell>
                  <TableCell>{card.singer}</TableCell>
                  <TableCell>
                    <a href={card.lin} target="_blank">
                      {card.lin}
                    </a>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>)}
        {editingCards && (     
        <div className="flex flex-col gap-4">
          <Button
            variant="contained"
            onClick={() => setOpenNewCardDialog(true)}
          >
            <AddIcon className="mr-2" />
            Add a card
          </Button>
        </div>)}
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
