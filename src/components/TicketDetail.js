import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Typography, TextField, Container } from "@mui/material";
import {
  getTicketDetails,
  updateTicket,
  deleteTicket,
  getComments,
  createComment,
} from "../services/api";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Ticket state
  const [ticket, setTicket] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    category: "",
  });

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const { data: ticketData } = await getTicketDetails(id);
        const { data: commentsData } = await getComments(id);
        setTicket(ticketData);
        setComments(Array.isArray(commentsData) ? commentsData : []);
        const { title, description, priority, category } = ticketData;
        setFormData({
          title: title || "",
          description: description || "",
          priority: priority || "",
          category: category || "",
        });
      } catch (err) {
        console.error("Error fetching ticket details:", err);
      }
    };

    fetchTicketDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateTicket(id, formData);
      alert("Ticket updated successfully!");
      setEditMode(false);
      setTicket({ ...ticket, ...formData });
    } catch (err) {
      console.error("Error updating ticket:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTicket(id);
      alert("Ticket deleted successfully!");
      navigate("/");
    } catch (err) {
      console.error("Error deleting ticket:", err);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await createComment({ ticketId: id, comment: newComment });
      setNewComment("");
      const { data: updatedComments } = await getComments(id);
      setComments(updatedComments);
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  if (!ticket) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Box sx={{ mb: 4, mt: 4 }}>
        <Typography variant="h4">Ticket Details</Typography>
        {editMode ? (
          <>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              fullWidth
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
              >
                Save
              </Button>
              <Button sx={{ ml: 2 }} onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Box>
            <Typography variant="h6">Title: {ticket.title}</Typography>
            <Typography>Description: {ticket.description}</Typography>
            <Typography>Priority: {ticket.priority}</Typography>
            <Typography>Category: {ticket.category}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
              <Button
                sx={{ ml: 2 }}
                variant="contained"
                color="secondary"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Comments Section */}

      <Box>
        <Typography variant="h5">Comments</Typography>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Box key={comment._id} sx={{ mt: 2 }}>
              <Typography variant="body2">{comment.comment}</Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" sx={{ mt: 2 }}>
            No comments yet.
          </Typography>
        )}
        <TextField
          fullWidth
          label="Add a comment"
          variant="outlined"
          margin="normal"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleCommentSubmit}
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default TicketDetail;
