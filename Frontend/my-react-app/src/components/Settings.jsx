import "../styles/Settings.css";

function Settings({ logout }) {
  return (
    <div className="settings-page">

      <h1>Admin Settings</h1>

      <div className="settings-card">

        <div className="profile-image">
          👤
        </div>

        <h2>Admin</h2>
        <p>admin@gmail.com</p>

        <hr />

        <label>Change Password</label>

        <input
          type="password"
          placeholder="Enter New Password"
        />

        <input
          type="password"
          placeholder="Confirm Password"
        />

        <button className="save-btn">
          Save Changes
        </button>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Settings;