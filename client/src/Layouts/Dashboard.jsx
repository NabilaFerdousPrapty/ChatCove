import React, { useState, useEffect } from "react";
import UseAxiosCommon from "../hooks/UseAxiosCommon/UseAxiosCommon";
import Swal from "sweetalert2"; // Import SweetAlert2
import { FaEdit, FaTrash, FaUserLock } from "react-icons/fa"; // Import icons
import UseAdmin from "../hooks/UseAdmin/UseAdmin";
import Navbar from "../Components/Navbar";

const Dashboard = () => {
  const axiosCommon = UseAxiosCommon();
  const [isAdmin,isAdminLoading]=UseAdmin();

  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "user", // Default role
    mobileNo: "",
    photo: "",
    status: "active", // Default status
  });

  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosCommon.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, []);

  const handleAddUser = async () => {
    try {
      const { data } = await axiosCommon.post("/addUsers", newUser);
      if (data.insertedId) {
        fetchUsers(); // Refresh the user list
        setNewUser({
          email: "",
          name: "",
          role: "user",
          mobileNo: "",
          photo: "",
          status: "active",
        }); // Reset the form
      } else {
        alert("User already exists");
      }
    } catch (error) {
      console.error("Error adding user", error);
    }
  };

  const handleDeleteUser = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axiosCommon.delete(`/users/delete/${email}`);
          fetchUsers(); // Refresh the user list
          Swal.fire("Deleted!", "User has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting user", error);
        }
      }
    });
  };

  const handleUpdateUser = (email) => {
    const userToUpdate = users.find((user) => user.email === email);
    setEditingUser(userToUpdate);
  };

  const handleSaveUpdate = async () => {
    try {
      const { data } = await axiosCommon.patch(
        `/users/update/${editingUser.email}`,
        editingUser
      );
      fetchUsers(); // Refresh the user list
      setEditingUser(null); // Close the modal
    } catch (error) {
      console.error("Error updating user", error);
    }
  };
  const exportToCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Mobile No",
      "Role",
      "Status",
      "Password",
      "Photo",
    ];
    const rows = users.map((user) => [
      user.name,
      user.email,
      user.mobileNo,
      user.role,
      user.status,
      user.password,
      user.photo,
    ]);

    // Creating a CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob and download it as CSV file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    link.click();
  };

  // Function to export users data as JSON
  const exportToJSON = () => {
    const blob = new Blob([JSON.stringify(users, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.json";
    link.click();
  };

  const handleRestrictUser = (email) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to change the user status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "No, cancel!",
    })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { data } = await axiosCommon.patch(
              `/users/toggleStatus/${email}`
            );
            fetchUsers(); // Refresh the user list
            Swal.fire("Success!", "User status has been updated.", "success");
          } catch (error) {
            if (error.response?.status === 403) {
              // Show alert if admin tries to restrict another admin
              Swal.fire({
                icon: "error",
                title: "Action Denied",
                text: "Admins cannot restrict other admins.",
              });
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response?.data?.message || "Something went wrong.",
              });
            }
          }
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error}`,
          showCancelButton: false,
          confirmButtonText: "Ok",
        });
      });
  };

if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Comment
            visible={true}
            height="80"
            width="80"
            ariaLabel="comment-loading"
            wrapperStyle={{}}
            wrapperClass="comment-wrapper"
            color="#fff"
            backgroundColor="#87CEEB"
        />

      </div>
    );
  }
    

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Navbar />
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Dashboard
      </h2>

      {/* Add User Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          Add New User
        </h3>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Mobile No"
            value={newUser.mobileNo}
            onChange={(e) =>
              setNewUser({ ...newUser, mobileNo: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Photo URL"
            value={newUser.photo}
            onChange={(e) => setNewUser({ ...newUser, photo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="button"
            onClick={handleAddUser}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Add User
          </button>
        </form>
        <div className="m-5 flex justify-center items-center gap-4">
          <button
            onClick={exportToCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Export as CSV
          </button>
          <button
            onClick={exportToJSON}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Export as JSON
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">User List</h3>
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Mobile No</th>
              <th className="px-6 py-3 text-left text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">PassWord</th>
              <th className="px-6 py-3 text-left text-gray-700">Photo</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.email} className="border-t">
                <td className="px-6 py-3">{user.name}</td>
                <td className="px-6 py-3">{user.email}</td>
                <td className="px-6 py-3">{user.mobileNo}</td>
                <td className="px-6 py-3">{user.role}</td>

                <td className="px-6 py-3">{user.status}</td>
                <td className="px-6 py-3">{user.password}</td>
                <td className="px-6 py-3">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-12 h-12 rounded-full"
                  />
                </td>
                <td className="px-6 py-3 space-x-2">
                  <button
                    onClick={() => handleUpdateUser(user.email)}
                    className="text-blue-500 hover:underline"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.email)}
                    className="text-red-500 hover:underline"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleRestrictUser(user.email)}
                    className="text-yellow-500 hover:underline"
                  >
                    <FaUserLock />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Edit User
            </h3>
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="email"
              value={editingUser.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              value={editingUser.mobileNo}
              onChange={(e) =>
                setEditingUser({ ...editingUser, mobileNo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <input
              type="text"
              value={editingUser.photo}
              onChange={(e) =>
                setEditingUser({ ...editingUser, photo: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <select
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleSaveUpdate}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
