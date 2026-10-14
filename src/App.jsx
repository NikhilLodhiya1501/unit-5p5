import React, { useState, useEffect } from "react";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const initialEmployees = [
  {
    id: 1,
    name: "Aarav Patel",
    email: "aarav@gmail.com",
    department: "IT",
    salary: 45000,
  },
  {
    id: 2,
    name: "Diya Shah",
    email: "diya@gmail.com",
    department: "HR",
    salary: 35000,
  },
  {
    id: 3,
    name: "Rohan Mehta",
    email: "rohan@gmail.com",
    department: "Finance",
    salary: 40000,
  },
];

function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <tr>
      <td>
        <div className="employee-info">
          <div className="avatar">
            {employee.name
              .split(" ")
              .map((word) => word[0])
              .join("")}
          </div>
          <div>
            <strong>{employee.name}</strong>
            <small>{employee.email}</small>
          </div>
        </div>
      </td>

      <td>EMP-{String(employee.id).padStart(3, "0")}</td>

      <td>
        <span className="department-badge">
          {employee.department}
        </span>
      </td>

      <td>₹{Number(employee.salary).toLocaleString("en-IN")}</td>

      <td>
        <div className="action-buttons">
          <button
            type="button"
            className="edit-button"
            onClick={() => onEdit(employee)}
          >
            Edit
          </button>

          <button
            type="button"
            className="delete-button"
            onClick={() => onDelete(employee.id)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function App() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "IT",
    salary: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState("Demo Data");

  useEffect(() => {
    let active = true;

    async function fetchEmployees() {
      setLoading(true);

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Unable to load API data");
        }

        const data = await response.json();

        if (!active) return;

        const apiEmployees = data.slice(0, 5).map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          department: "IT",
          salary: 30000 + user.id * 2500,
        }));

        setEmployees(apiEmployees);
        setApiStatus("API Connected");
      } catch (error) {
        if (active) {
          setApiStatus("Demo Data");
          setMessage("API unavailable. Showing sample employee records.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchEmployees();

    return () => {
      active = false;
    };
  }, []);

  const showMessage = (text) => {
    setMessage(text);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department: "IT",
      salary: "",
    });

    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.salary ||
      Number(form.salary) <= 0
    ) {
      showMessage("Please enter valid employee details.");
      return;
    }

    if (editingId !== null) {
      setEmployees((previous) =>
        previous.map((employee) =>
          employee.id === editingId
            ? {
                ...employee,
                ...form,
                name: form.name.trim(),
                email: form.email.trim(),
                salary: Number(form.salary),
              }
            : employee
        )
      );

      showMessage("Employee updated successfully!");
    } else {
      const newEmployee = {
        ...form,
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        salary: Number(form.salary),
      };

      setEmployees((previous) => [newEmployee, ...previous]);

      showMessage("Employee added successfully!");
    }

    resetForm();
  };

  const handleEdit = (employee) => {
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: String(employee.salary),
    });

    setEditingId(employee.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = (id) => {
    const employee = employees.find((item) => item.id === id);

    if (!employee) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setEmployees((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      resetForm();
    }

    showMessage("Employee deleted successfully!");
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query)
    );
  });

  const totalSalary = employees.reduce(
    (total, employee) => total + Number(employee.salary),
    0
  );

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">
          <div className="logo-icon">E</div>

          <div>
            <h1>
              Employ<span>Hub</span>
            </h1>
            <p>Employee Management System</p>
          </div>
        </div>

        <div className="api-indicator">
          <span className="status-dot"></span>
          {apiStatus}
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <span className="eyebrow">WORKSPACE / EMPLOYEES</span>

          <h2>
            Employee <span>Dashboard</span>
          </h2>

          <p>
            Manage your team, update employee details, and organize
            your workforce from one place.
          </p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div>
              <p>Total Employees</p>
              <h3>{employees.length}</h3>
              <small>Current employee records</small>
            </div>
            <div className="stat-icon blue">👥</div>
          </div>

          <div className="stat-card">
            <div>
              <p>Departments</p>
              <h3>
                {new Set(employees.map((e) => e.department)).size}
              </h3>
              <small>Active departments</small>
            </div>
            <div className="stat-icon purple">🏢</div>
          </div>

          <div className="stat-card">
            <div>
              <p>Total Salary</p>
              <h3>₹{totalSalary.toLocaleString("en-IN")}</h3>
              <small>Combined monthly salary</small>
            </div>
            <div className="stat-icon green">💰</div>
          </div>
        </section>

        {message && (
          <div className="message" role="status">
            <span>✓</span>
            {message}

            <button
              type="button"
              onClick={() => setMessage("")}
              aria-label="Close message"
            >
              ×
            </button>
          </div>
        )}

        <section className="form-card">
          <div className="section-heading">
            <div>
              <h3>
                {editingId !== null
                  ? "✏️ Update Employee"
                  : "➕ Add New Employee"}
              </h3>

              <p>
                {editingId !== null
                  ? "Edit the employee information below."
                  : "Enter the details to register a new employee."}
              </p>
            </div>

            {editingId !== null && (
              <span className="editing-badge">EDITING MODE</span>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter employee name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="employee@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>

                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="IT">Information Technology</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="salary">Monthly Salary (₹)</label>

                <input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="Enter salary"
                  min="1"
                  value={form.salary}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-button">
                {editingId !== null
                  ? "Save Changes"
                  : "Add Employee"}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                {editingId !== null ? "Cancel Edit" : "Clear Form"}
              </button>
            </div>
          </form>
        </section>

        <section className="employee-section">
          <div className="employee-heading">
            <div>
              <h3>Employee Directory</h3>
              <p>View, search, edit, or delete employee records.</p>
            </div>

            <span className="count-badge">
              {filteredEmployees.length} Employees
            </span>
          </div>

          <div className="search-box">
            <span>🔎</span>

            <input
              type="search"
              placeholder="Search by name, email, or department..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search employees"
            />
          </div>

          {loading && (
            <p className="loading">Loading employee data from API...</p>
          )}

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Monthly Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}

                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      <div className="empty-state">
                        <div>📂</div>
                        <h3>No Employees Found</h3>
                        <p>
                          Try another search or add a new employee.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <span>
              Showing {filteredEmployees.length} of {employees.length} employees
            </span>
            <span>EmployHub © 2026</span>
          </div>
        </section>

        <footer className="footer">
          Built with <strong>React JS</strong> and <strong>CSS</strong>
          <p>Employee Management System · CRUD Practical</p>
        </footer>
      </main>
    </div>
  );
}

export default App;