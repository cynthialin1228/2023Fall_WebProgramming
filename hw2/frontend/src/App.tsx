import { useEffect, useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import CardList from "@/components/CardList";
import HeaderBar from "@/components/HeaderBar";
import NewListDialog from "@/components/NewListDialog";
import useCards from "@/hooks/useCards";

function App() {
  const { lists, fetchLists, fetchCards } = useCards();
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  useEffect(() => {
    fetchLists();
    fetchCards();
  }, [fetchCards, fetchLists]);

  return (
    <>
      <HeaderBar />
      <div className="flex mr-4 justify-center">
          <span className="text-2xl mr-4">My Playlists</span>
          <div>
              <Button
                variant="contained"
                className="w-80 mr-4"
                onClick={() => setNewListDialogOpen(true)}
              >
                <AddIcon className="mr-2" />
                Add a playlist
              </Button>
          </div>
          <div>
              <Button
                variant="contained"
                className="w-80 mr-4"
                onClick={()=>{setShowDeleteIcon(!showDeleteIcon)}}
              >
                {showDeleteIcon ? "Done" : "Delete"}
              </Button>
          </div> 
          </div>

      <main className="grid max-h-full md:grid-cols-2 xl:grid-cols-3 gap-6 px-12 py-12">
        {lists.map((list) => (
          <CardList key={list.id} {...list} showDeleteIcon={showDeleteIcon} />
        ))}
        
        <NewListDialog
          open={newListDialogOpen}
          onClose={() => setNewListDialogOpen(false)}
        />
      </main>
    </>
  );
}

export default App;
