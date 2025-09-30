import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";
import "../styles/Note.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`/api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) toast.success("Note Deleted successfully");
        else toast.error("Note Deletion failed");
        getNotes();
      })
      .catch((error) => alert(error));
  };

  const createNote = (e) => {
    e.preventDefault();
    api
      .post("/api/notes/", { content, title })
      .then((res) => {
        if (res.status === 201) {
          toast.success("Note Created successfully");
          setTitle('')
          setContent('')
        } else toast.error("Note Creation Failed..");
        getNotes();
      })
      .catch((error) => alert(error));
  };
  const handleLogout = () => {
    navigate("/logout");
  };
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        theme="dark"
      />
      <div>
        <div className="logout-container">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h2 className="note-title">Notes</h2>
        {/* // <Note note={note} onDelete={deleteNote} key={note.id} /> */}
        <div className="note-container">
          {notes.length > 0 &&
              <table className="note-table">
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                   {notes.map((note, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{note.title}</td>
                    <td>{note.content}</td>
                    <td>
                      {new Date(note.created_at).toLocaleDateString("en-US")}
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteNote(note.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
              ))}
                </tbody>
              </table>
          }
        </div>
      </div>
      <h2 className="note-title">Create a Note</h2>
      <form onSubmit={createNote}>
        <label htmlFor="title">Title:</label>
        <br />
        <input
          type="text"
          id="title"
          name="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <br />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}
export default Home;
