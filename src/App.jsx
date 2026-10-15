
import { useEffect, useState } from "react";
import "./App.css";

const initialEmployees = [
  { id: 1, name: "Rahul Sharma", email: "rahul@gmail.com", department: "IT", role: "Developer", status: "Active" },
  { id: 2, name: "Priya Patil", email: "priya@gmail.com", department: "HR", role: "HR Executive", status: "Active" },
  { id: 3, name: "Amit Joshi", email: "amit@gmail.com", department: "Finance", role: "Accountant", status: "On Leave" },
  { id: 4, name: "Sneha Kulkarni", email: "sneha@gmail.com", department: "IT", role: "Designer", status: "Active" },
  { id: 5, name: "Rohit More", email: "rohit@gmail.com", department: "Marketing", role: "Marketing Executive", status: "Inactive" },
];

function getSavedEmployees() {
  try {
    const savedEmployees = localStorage.getItem("employees");
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployees;
  } catch {
    return initialEmployees;
  }
}

function App() {
  const [employees, setEmployees] = useState(getSavedEmployees);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState("Dashboard");
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "IT",
    role: "",
    status: "Active",
  });

  useEffect(() => {
    document.title = "Employee Management Dashboard";
  }, []);

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const filteredEmployees = employees.filter((employee) => {
    const query = search.toLowerCase();

    const matchesSearch =
      employee.name.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query);

    return (
      matchesSearch &&
      (department === "All" || employee.department === department) &&
      (status === "All" || employee.status === status)
    );
  });

  function addEmployee(event) {
    event.preventDefault();

    const newEmployee = {
      ...form,
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
    };

    setEmployees((previous) => [newEmployee, ...previous]);

    setForm({
      name: "",
      email: "",
      department: "IT",
      role: "",
      status: "Active",
    });

    setShowForm(false);
    setPage("Employees");
    setSearch("");
    setDepartment("All");
    setStatus("All");
  }

  const activeCount = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">E</span>
          <span>
            Employ<span className="brand-light">Hub</span>
          </span>
        </div>

        <p className="menu-label">MAIN MENU</p>

        {["Dashboard", "Employees", "Tasks", "Settings"].map(
          (item, index) => (
            <button
              key={item}
              className={`nav-item ${page === item ? "selected" : ""}`}
              onClick={() => {
                setPage(item);
                setShowForm(false);
              }}
            >
              <span>{["▦", "♙", "✓", "⚙"][index]}</span>
              {item}
            </button>
          )
        )}

        <div className="sidebar-bottom">
          <div className="help-icon">?</div>
          <strong>Need help?</strong>
          <p>Contact your administrator for support.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Workspace / </span>
            <strong>{page}</strong>
          </div>

          <div className="profile">
            <div className="notification">♧</div>
            <div className="avatar">AK</div>
            <div className="profile-info">
              <strong>Admin User</strong>
              <small>Administrator</small>
            </div>
          </div>
        </header>

        <section className="content">
          <div className="welcome-row">
            <div>
              <p className="eyebrow">OVERVIEW</p>
              <h1>{page}</h1>
              <p className="subheading">
                Welcome back! Here's what's happening today.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setPage("Employees");
                setShowForm(true);
              }}
            >
              ＋ Add Employee
            </button>
          </div>

          {page === "Dashboard" && (
            <>
              <div className="summary-grid">
                <SummaryCard
                  title="Total Employees"
                  value={employees.length}
                  icon="♙"
                  tone="purple"
                  note="Registered employees"
                />
                <SummaryCard
                  title="Active Employees"
                  value={activeCount}
                  icon="✓"
                  tone="green"
                  note="Currently active"
                />
                <SummaryCard
                  title="Pending Tasks"
                  value={8}
                  icon="◷"
                  tone="orange"
                  note="Awaiting completion"
                />
                <SummaryCard
                  title="Completed Tasks"
                  value={24}
                  icon="☑"
                  tone="blue"
                  note="Tasks completed"
                />
              </div>

              <div className="dashboard-grid">
                <section className="panel">
                  <h2>Employee Overview</h2>
                  <p className="muted">Sample workforce distribution</p>

                  <div className="bar-chart">
                    {[
                      ["IT", 85],
                      ["HR", 48],
                      ["Finance", 62],
                      ["Marketing", 38],
                      ["Operations", 55],
                    ].map(([label, height]) => (
                      <div className="bar-column" key={label}>
                        <div className="bar-track">
                          <div
                            className="bar"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <small>{label}</small>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel">
                  <h2>Quick Summary</h2>

                  <div className="activity-item">
                    <span className="activity-dot purple-dot" />
                    <div>
                      <strong>Workforce</strong>
                      <p>{employees.length} employees registered</p>
                    </div>
                  </div>

                  <div className="activity-item">
                    <span className="activity-dot green-dot" />
                    <div>
                      <strong>Active team</strong>
                      <p>{activeCount} active employees</p>
                    </div>
                  </div>

                  <div className="activity-item">
                    <span className="activity-dot orange-dot" />
                    <div>
                      <strong>Tasks pending</strong>
                      <p>8 tasks to complete</p>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {page === "Tasks" && (
            <section className="panel">
              <h2>Task Overview</h2>
              <div className="task-row">
                <span>Pending tasks</span>
                <strong>8</strong>
              </div>
              <div className="task-row">
                <span>Completed tasks</span>
                <strong>24</strong>
              </div>
              <p className="muted">
                Sample task statistics for demonstration.
              </p>
            </section>
          )}

          {page === "Settings" && (
            <section className="panel">
              <h2>Settings</h2>
              <p className="muted">Application settings</p>
              <div className="settings-row">
                <strong>Account</strong>
                <span>Admin User</span>
              </div>
              <div className="settings-row">
                <strong>Application version</strong>
                <span>1.0</span>
              </div>
            </section>
          )}

          {page === "Employees" && (
            <>
              <div className="employee-stats">
                <span>
                  All Employees <strong>{employees.length}</strong>
                </span>
                <span>
                  Active <strong>{activeCount}</strong>
                </span>
              </div>

              {showForm && (
                <section className="panel form-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Add New Employee</h2>
                      <p className="muted">
                        Enter employee details below.
                      </p>
                    </div>
                    <button
                      className="close-btn"
                      onClick={() => setShowForm(false)}
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={addEmployee} className="employee-form">
                    <label>
                      Full Name
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Enter full name"
                      />
                    </label>

                    <label>
                      Email Address
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="name@company.com"
                      />
                    </label>

                    <label>
                      Department
                      <select
                        value={form.department}
                        onChange={(e) =>
                          setForm({ ...form, department: e.target.value })
                        }
                      >
                        <option>IT</option>
                        <option>HR</option>
                        <option>Finance</option>
                        <option>Marketing</option>
                        <option>Operations</option>
                      </select>
                    </label>

                    <label>
                      Job Role
                      <input
                        required
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        placeholder="Enter job role"
                      />
                    </label>

                    <label>
                      Status
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>On Leave</option>
                      </select>
                    </label>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>
                      <button className="primary-btn" type="submit">
                        Save Employee
                      </button>
                    </div>
                  </form>
                </section>
              )}

              <section className="panel table-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Employee Directory</h2>
                    <p className="muted">
                      Manage and view your team members
                    </p>
                  </div>
                  <span className="record-count">
                    {filteredEmployees.length} records
                  </span>
                </div>

                <div className="filters">
                  <input
                    className="search-input"
                    aria-label="Search employees"
                    placeholder="Search name, email or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <select
                    aria-label="Filter department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    <option>IT</option>
                    <option>HR</option>
                    <option>Finance</option>
                    <option>Marketing</option>
                    <option>Operations</option>
                  </select>

                  <select
                    aria-label="Filter status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>On Leave</option>
                  </select>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>EMPLOYEE</th>
                        <th>DEPARTMENT</th>
                        <th>JOB ROLE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id}>
                          <td>
                            <div className="employee-cell">
                              <div className="employee-avatar">
                                {employee.name
                                  .split(" ")
                                  .map((part) => part[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </div>
                              <div>
                                <strong>{employee.name}</strong>
                                <small>{employee.email}</small>
                              </div>
                            </div>
                          </td>
                          <td>{employee.department}</td>
                          <td>{employee.role}</td>
                          <td>
                            <span
                              className={`status ${
                                employee.status === "Active"
                                  ? "active"
                                  : employee.status === "Inactive"
                                  ? "inactive"
                                  : "leave"
                              }`}
                            >
                              <span className="status-dot" />
                              {employee.status}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {filteredEmployees.length === 0 && (
                        <tr>
                          <td colSpan="4" className="empty-state">
                            No employees found. Try another search or filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </section>

        <footer className="footer">
          © 2026 EmployHub <span>Employee Management System</span>
        </footer>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, icon, tone, note }) {
  return (
    <article className="summary-card">
      <div className={`summary-icon ${tone}`}>{icon}</div>
      <p>{title}</p>
      <div className="summary-value">{value}</div>
      <small>{note}</small>
    </article>
  );
}

export default App;
