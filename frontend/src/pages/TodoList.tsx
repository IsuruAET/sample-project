import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} from "../store/api/todoApi";
import type { Todo } from "../store/api/todoApi";

export default function TodoList() {
  const { data: todos, isLoading, error } = useGetTodosQuery();
  const [createTodo] = useCreateTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const [open, setOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleOpen = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
      setFormData({ title: todo.title, description: todo.description });
    } else {
      setEditingTodo(null);
      setFormData({ title: "", description: "" });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTodo(null);
    setFormData({ title: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTodo) {
      await updateTodo({
        id: editingTodo._id,
        todo: { ...formData, completed: editingTodo.completed },
      });
    } else {
      await createTodo({ ...formData, completed: false });
    }
    handleClose();
  };

  const handleToggleComplete = async (todo: Todo) => {
    await updateTodo({
      id: todo._id,
      todo: { ...todo, completed: !todo.completed },
    });
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error loading todos</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4">Todo List</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Todo
        </Button>
      </Box>

      {todos?.map((todo) => (
        <Card key={todo._id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo)}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.title}
              </Typography>
              <Typography color="text.secondary">{todo.description}</Typography>
            </Box>
            <IconButton onClick={() => handleOpen(todo)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => deleteTodo(todo._id)}>
              <DeleteIcon />
            </IconButton>
          </CardContent>
        </Card>
      ))}

      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingTodo ? "Edit Todo" : "Add New Todo"}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingTodo ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}
