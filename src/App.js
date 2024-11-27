import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";

const CRUD_UI = () => {
  const [users, setUsers] = useState([]); // User data
  const [showModal, setShowModal] = useState(false); // Modal state
  const [editMode, setEditMode] = useState(false); // Track if editing
  const [currentUser, setCurrentUser] = useState(null); // Current user being edited
  const [newUser, setNewUser] = useState({
    first: "",
    last: "",
    username: "",
  }); // New or edited user

  // Fetch data from an API
  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const fetchedUsers = response.data.map((user) => ({
          id: user.id,
          avatar: `https://i.pravatar.cc/150?img=${user.id}`, // Random avatar
          first: user.name.split(" ")[0], // First name
          last: user.name.split(" ")[1] || "", // Last name
          username: user.email,
        }));
        setUsers(fetchedUsers);
      })
      .catch((error) => {
        alert("Error fetching user data.");
        console.error(error);
      });
  }, []);

  // Handle opening the modal
  const handleOpenModal = (user = null) => {
    setEditMode(!!user); // If user exists, edit mode
    setCurrentUser(user);
    setNewUser(user || { first: "", last: "", username: "" });
    setShowModal(true);
  };

  // Handle adding or saving user
  const handleSaveUser = () => {
    if (editMode) {
      // Update user
      setUsers(
        users.map((u) =>
          u.id === currentUser.id
            ? { ...currentUser, ...newUser }
            : u
        )
      );
    } else {
      // Add new user
      const newId = users.length ? users[users.length - 1].id + 1 : 1;
      setUsers([
        ...users,
        { id: newId, avatar: `https://i.pravatar.cc/150?img=${newId}`, ...newUser },
      ]);
    }
    setShowModal(false);
    setNewUser({ first: "", last: "", username: "" });
  };

  // Handle deleting user
  const handleDeleteUser = (id) => {
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">API - CRUD</span>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Create
          </Button>
        </div>
      </nav>

      {/* User Table */}
      <div className="container mt-4">
        <h2 className="mb-4">Users</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>First</th>
              <th>Last</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>
                  <img
                    src={user.avatar}
                    alt={`${user.first} ${user.last}`}
                    className="rounded-circle"
                    width="40"
                  />
                </td>
                <td>{user.first}</td>
                <td>{user.last}</td>
                <td>{user.username}</td>
                <td>
                  <Button
                    variant="info"
                    className="me-2"
                    onClick={() => handleOpenModal(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Del
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Add/Edit User */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.first}
                onChange={(e) =>
                  setNewUser({ ...newUser, first: e.target.value })
                }
                placeholder="Enter first name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.last}
                onChange={(e) =>
                  setNewUser({ ...newUser, last: e.target.value })
                }
                placeholder="Enter last name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="email"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                placeholder="Enter email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveUser}
            disabled={!newUser.first.trim() || !newUser.username.trim()}
          >
            {editMode ? "Save Changes" : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CRUD_UI;
