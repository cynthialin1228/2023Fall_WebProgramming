import { useState } from "react";
import Button from "@mui/material/Button";
import CardDialog from "./CardDialog";

export type CardProps = {
  id: string;
  title: string;
  singer: string;
  lin: string;
  listId: string;
};

export default function Card({ id, title, singer, lin, listId }: CardProps) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClickOpen} className="text-start">
        Edit Card
      </Button>
      <CardDialog
        variant="edit"
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        singer={singer}
        lin={lin}
        listId={listId}
        cardId={id}
      />
    </>
  );
}
