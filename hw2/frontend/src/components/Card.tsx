import { useState } from "react";

import { Paper } from "@mui/material";

import CardDialog from "./CardDialog";

export type CardProps = {
  id: string;
  title: string;
  description: string;
  singer: string;
  lin: string;
  listId: string;
};

export default function Card({ id, title, description, singer, lin, listId }: CardProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <button onClick={handleClickOpen} className="text-start">
        <Paper className="flex w-full flex-col p-2" elevation={6}>
          {title}
        </Paper>
      </button>
      <CardDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        description={description}
        singer={singer}
        lin={lin}
        listId={listId}
        cardId={id}
      />
    </>
  );
}
