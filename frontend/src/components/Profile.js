import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  // Fetch username from localStorage directly
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTab, setEditingTab] = useState("profileEditing");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "/AnimeGirl.png");
  const [banner, setBanner] = useState(localStorage.getItem("banner") || "/AnimeBanner.jpg");
  const navigate = useNavigate(); // Added for navigation functionality if needed


  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername.trim() !== "") {
      setUsername(storedUsername);
    } else {
      navigate("/login"); // If username is not in localstorage or is an empty string, jsut redirect to Login Page
    }
  }, [navigate]);

  const [activeTab, setActiveTab] = useState("Overview");
  const [showDropdown, setShowDropdown] = useState(false); // Controls dropdown visibility
  const storeAvatars = [
    "/AnimeBird.jpg",
    "/AnimeDog.jpg",
    "/AnimeFox.jpg",
    "/OtakuBun.mp4",
    "/OtakuCat.mp4",
    "/OtakuFox.mp4",
    "/OtakuKoala.mp4",
    "/OtakuOsty.mp4",
    "/OtakuPeng.mp4",
    "/OtakuPig.mp4",
    "/OtakuPorky.mp4",
    "/OtakuRaff.mp4",
    "/OtakuSnail.mp4",
    "/OtakuSnake.mp4",
    "/OtakuTurt.mp4",
  ];

  const storeBanners = [
    "/BlueGirl.jpg",
    "/BoyCat.jpg",
    "/CoatGirl.jpg",
    "/CyberEyes.jpg",
    "/Cyberpunk.jpg",
    "/Dragon.jpg",
    "/GreenDragon.jpg",
    "/OtakuBeats.jpg",
    "/RainBoy.jpg",
    "/RainGirl.jpg",
    "/RedDragon.jpg",
    "/SakuraGirl.jpg",
    "/SkyGirl.jpg",
    "/Sunset.jpg"
];


  const handleAvatarChange = (event) => {
    const fileInput = event.target; // Store reference to the input element
    const file = fileInput.files[0];
    const maxSize = 2 * 1024 * 1024; // 2MB limit

    if (!file) {
      return; // If user cancels file selection, do nothing
    }

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      fileInput.value = ""; // Reset input
      return;
    }

    if (file.size > maxSize) {
      alert("File is too large. Please choose an image under 2MB.");
      fileInput.value = ""; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        setAvatar(reader.result);
        localStorage.setItem("avatar", reader.result);
      } catch (error) {
        if (error.name === "QuotaExceededError") {
          alert("Storage limit exceeded! Please clear some space.");
        } else {
          console.error("Error saving avatar:", error);
        }
      }
    };
    reader.readAsDataURL(file);

    fileInput.value = ""; // Reset input after processing
  };

  const handleBannerChange = (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    const maxSize = 3 * 1024 * 1024; // 3MB limit

    if (!file) return; // User canceled selection

    if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
        fileInput.value = ""; // Reset input
        return;
    }

    if (file.size > maxSize) {
        alert("File is too large. Please choose an image under 3MB.");
        fileInput.value = ""; // Reset input
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        try {
            if (banner !== reader.result) { // Prevent unnecessary re-renders
                setBanner(reader.result);
                localStorage.setItem("banner", reader.result);
            }
        } catch (error) {
            if (error.name === "QuotaExceededError") {
                alert("Storage limit exceeded! Please clear some space.");
            } else {
                console.error("Error saving banner:", error);
            }
        }
    };

    reader.readAsDataURL(file);
    fileInput.value = ""; // Reset input after processing
};


  const openEditingTab = (tab) => {
    setIsEditing(true);
    setEditingTab(tab);
  };

  const closeEditingTab = () => {
    setIsEditing(false);
    setEditingTab(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowDropdown(false); // Close dropdown on tab change
  };

  const handleRemoveAvatar = () => {
    setAvatar("/AnimeGirl.png");
    localStorage.removeItem("avatar");
  };

  const handleRemoveBanner = () => {
    setBanner("/AnimeBanner.jpg");
    localStorage.removeItem("banner");
  };

  const handleStoreAvatarSelect = (avatarOption) => {
    setAvatar(avatarOption);
    localStorage.setItem("avatar", avatarOption);
    setShowDropdown(false);
  };

  const handleStoreBannerSelect = (bannerOption) => {
    setBanner(bannerOption);
    localStorage.setItem("banner", bannerOption);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/'); // Redirect to the Get Started page
  };


  return (
    <div style={styles.profileContainer}>

      {/* Avatar & Banner Section */}
      <div style={styles.profileHeader}>
        {/* Banner with Background & Controls */}
        <div
          style={{
            ...styles.banner,
            backgroundImage: `url(${banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* LOGOUT Button */}
          <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
          </button>

        </div>

        {/* Avatar Container (positioned separately, typically overlapping the banner) */}
        <div style={styles.avatarContainer}>
          {avatar.endsWith(".mp4") ? (
            <video
              src={avatar}
              style={styles.avatar}
              width="153px"
              height="153px"
              autoPlay
              loop
              muted
            />
          ) : (
            <img src={avatar} alt="Avatar" style={styles.avatar} />
          )}

          {/* Hidden Upload Inputs */}
          <input
            type="file"
            style={{ display: "none" }}
            id="avatar-upload"
            accept="image/*"
            onClick={(e) => (e.target.value = null)}
            onChange={handleAvatarChange}
          />
          <input
            type="file"
            style={{ display: "none" }}
            id="banner-upload"
            accept="image/*"
            onChange={handleBannerChange}
          />
        </div>

        {/* Welcome, Profile Editing & Removal Buttons */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

          <div style={{ textAlign: "left", paddingLeft: "186px" }}>
            <h2 style={styles.username}>
              Welcome <span style={styles.usernameHighLight1}>{username}</span> !
            </h2>
          </div>

          {/* Banner Buttons Container */}
          <div style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "0px",
              alignItems: "start",
              marginTop: "-78px",
              marginRight: "186px",
              border: "1px solid rgba(20, 186, 219, 0.88)",
              borderRadius: "10px",
              padding: "4.5px 17.4px",
              zIndex: 1,
              boxShadow: "0 0 4.5px rgba(0, 191, 255, 0.68), 0 0 6.3px rgba(18, 176, 229, 0.87)",
              transition: "box-shadow 0.3s ease-in-out"
            }}>

            {/* Removal Buttons */}
            <div style={{ position: "relative",  display: "flex", alignItems: "flex-end", gap: "1.5px", marginTop: "-1.5px" }}>
            <img src="/RemvAvatar.png" alt="Remove Avatar" onClick={handleRemoveAvatar} style={{ width: "48px", height: "48px", cursor: "pointer", zIndex: 2 }} />
              <button onClick={handleRemoveAvatar} style={{
              fontSize: '1.09rem',
              fontWeight: 500,
              fontFamily: '"Kalam", cursive',
              color: '#fff',
              backgroundColor: "transparent",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "5px",
              WebkitTextStroke: '0.54px rgb(161, 47, 199)',
              letterSpacing: "0.90px"
            }}>Remove Avatar</button>
              </div>
              <div style={{ position: "relative",  display: "flex", alignItems: "flex-end", gap: "1.5px", marginTop: "-18px", marginLeft: "51px" }}>

                <button onClick={handleRemoveBanner} style={{
              fontSize: '1.09rem',
              fontWeight: 500,
              fontFamily: '"Kalam", cursive',
              color: '#fff',
              backgroundColor: "transparent",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              borderRadius: "5px",
              WebkitTextStroke: '0.54px rgb(205, 44, 178)',
              letterSpacing: "0.90px"
            }}>Remove Banner</button>
            <img src="/RemvBanner.png" alt="Remove Banner" onClick={handleRemoveAvatar} style={{ width: "48px", height: "48px", cursor: "pointer", zIndex: 2  }} />
              </div>

            {/* Profile Editing Section */}
            <div style={{ position: "relative",  display: "flex", alignItems: "flex-end", gap: "1.5px", marginTop: "-23.4px"}}>
              <img src="/ProfileEdit.png" alt="Edit Profile" style={{ width: "52px", height: "52px", cursor: "pointer", marginRight: "-4.5px", zIndex: 2  }} onClick={() => openEditingTab("profileEditing")} />
              <button onClick={() => openEditingTab("profileEditing")} style={{
                fontSize: '1.03rem',
                fontWeight: 500,
                fontFamily: '"Kalam", cursive',
                color: 'whitesmoke',
                backgroundColor: "transparent",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                WebkitTextStroke: '0.60px rgb(28, 180, 191)',
                letterSpacing: "0.90px"
              }}>Edit Profile</button>
            </div>

            </div>


          </div>


        {isEditing && (
          <div style={styles.editingOverlay}>
            <div style={{
                    ...(editingTab === "profileEditing" ? styles.editingTab:
                      styles.storesTab)
                }}>
              <button style={{
                          ...(editingTab === "profileEditing" ? styles.closeButtonProfileEdit:
                            styles.closeButtonStores)
                      }} onClick={closeEditingTab}>✖</button>

              {editingTab === "profileEditing" && (
                <div>
                  <h3 style={{
                      fontSize: '24px',
                      fontFamily: '"Kalam", cursive',
                      color: '#fff',
                      textAlign: 'center',
                      marginTop: '7.5px',
                      fontWeight: 500,
                      WebkitTextStroke: '0.48px #ff00ff',
                      textShadow: '0 0 8px #9a00cc, 0 0 12px #9a00cc'
                    }}>Profile Editing</h3>
                  <label htmlFor="avatar-upload" style={styles.upAvatarBtn}>Upload Avatar</label>
                  <label htmlFor="banner-upload" style={styles.upAvatarBtn}>Upload Banner</label>
                  <br></br> <br></br>
                  <button onClick={() => openEditingTab("storeAvatar")} style={styles.storeButtonAvt}>
                    Avatar Store
                  </button>
                  <button onClick={() => openEditingTab("storeBanner")} style={styles.storeButtonBnr}>
                    Banner Store
                  </button>
                </div>
              )}

              {editingTab === "storeAvatar" && (
                <div>
                  <h3 style={{
                      fontSize: '24px',
                      fontFamily: '"Kalam", cursive',
                      color: '#fff',
                      textAlign: 'center',
                      marginTop: '7.5px',
                      fontWeight: 500,
                      WebkitTextStroke: '0.42px #00f0ff', // blue stroke
                      textShadow: '0 0 8px #00a1d9, 0 0 12px #00a1d9' // blue glow effect
                    }}>Avatar Store</h3>
                  <button onClick={() => openEditingTab("profileEditing")} style={styles.backeditBtn}>
                    Back to Editing
                  </button>

                  {/* Scrollable store list */}
                  <div style={{ ...styles.storeGrid, overflowY: "auto", maxHeight: "300px" }}>
                    {storeAvatars.map((avatarOption, index) => (
                      <div
                        key={index}
                        onClick={() => handleStoreAvatarSelect(avatarOption)} // Updates avatar instantly
                        style={styles.dropdownItem}
                      >
                        {avatarOption.endsWith(".mp4") ? (
                          <video
                            width="80px"
                            height="80px"
                            autoPlay
                            loop
                            muted
                            src={avatarOption} // Preloaded for instant switching
                          />
                        ) : (
                          <img
                            src={avatarOption}
                            alt={avatarOption.split("/").pop()}
                            style={{ width: "80px", height: "80px", borderRadius: "3px" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {editingTab === "storeBanner" && (
                <div>
                  <h3 style={{
                      fontSize: '24px',
                      fontFamily: '"Kalam", cursive',
                      color: '#fff',
                      textAlign: 'center',
                      marginTop: '7.5px',
                      fontWeight: 500,
                      WebkitTextStroke: '0.42px #00f0ff', // blue stroke
                      textShadow: '0 0 8px #00a1d9, 0 0 12px #00a1d9' // blue glow effect
                    }}>Banner Store</h3>
                  <button onClick={() => openEditingTab("profileEditing")} style={styles.backeditBtn}>
                    Back to Editing
                  </button>

                  {/* Scrollable store list */}
                  <div style={{ ...styles.storeGridBanner, overflowY: "auto", maxHeight: "300px" }}>
                    {storeBanners.map((bannerOption, index) => (
                      <div
                        key={index}
                        onClick={() => handleStoreBannerSelect(bannerOption)} // Updates banner instantly
                        style={styles.dropdownItem}
                      >
                        <img
                          src={bannerOption}
                          alt={bannerOption.split("/").pop()}
                          style={{ width: "320px", height: "80.6px", borderRadius: "3px" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>

      <hr style= {styles.bar}></hr>

      {/* Profile Options Bar */}
      <div style={styles.profileNav}>
        {[
          "Overview",
          "Anime List",
          "Manga List",
          "Favourites",
          "Stats",
          "Social",
          "Reviews",
          "Submissions",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={
              activeTab === tab
                ? { ...styles.navButton, ...styles.activeTab }
                : styles.navButton
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Display */}
      <div style={styles.profileContent}>
        {activeTab === "Overview" && (
          <div style={styles.overview}>
            <div style={styles.animeColumn}>Anime interactions go here...</div>
            <div style={styles.actionsColumn}>Action log goes here...</div>
          </div>
        )}
      </div>
    </div>
  );

};

// Styles
const styles = {
  profileContainer: {
    backgroundColor: "#121212",
    color: "#fff",
    fontFamily: '"Quicksand", sans-serif',
    minHeight: "111vh",
    padding: "21px",
    maxHeight: "300vh",
    overflow: "visible"
  },
  profileHeader: {
    position: "relative",
    textAlign: "center",
    marginBottom: "15px"
  },
  banner: {
    position: "relative",
    backgroundColor: "#282828",
    height: "285px",
    width: "100%",
    borderRadius: "10px",
  },
  editingOverlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(216, 201, 231, 0.54)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: "10000",
  },
  editingTab: {
    backgroundColor: "#222",
    padding: "15px",
    borderRadius: "15px",
    width: "450px",
    textAlign: "center",
    color: "#fff",
    position: "relative",
    border: "1px solid #bf00ff",
    boxShadow: "0 0 4.5px #9a00cc, 0 0 6.3px #9a00cc"
  },
  storesTab: {
    backgroundColor: "#222",
    padding: "15px",
    borderRadius: "15px",
    width: "450px",
    textAlign: "center",
    color: "#fff",
    position: "relative",
    border: "1px solid #00f0ff",
    boxShadow: "0 0 4.5px rgba(0, 191, 255, 0.68), 0 0 6.3px rgba(18, 176, 229, 0.87)",
  },
  closeButtonProfileEdit: {
    background: "transparent",
    border: "none",
    color: "#ff00ff",
    fontSize: "24px",
    padding: "9px 9px",
    cursor: "pointer",
    position: "absolute",
    overflowY: "hidden",
    overflowX: "hidden",
    top: "5px",
    right: "12px"
  },
  closeButtonStores: {
    background: "transparent",
    border: "none",
    color: "#00f0ff",
    fontSize: "24px",
    padding: "9px 9px",
    cursor: "pointer",
    position: "absolute",
    overflowY: "hidden",
    overflowX: "hidden",
    top: "5px",
    right: "12px"
  },
  backeditBtn: {
    background: "rgb(134, 231, 255)",
    border: "none",
    color: "#222",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "9px 10.5px",
    fontSize: "15px",
    fontWeight: 500,
    boxShadow: '0 0 4px rgba(55, 185, 255, 0.9), 0 0 8px rgba(9, 169, 255, 0.84)',
    letterSpacing: '0.45px'
  },
  profileTabShadow: {
    border: "1px solid rgba(20, 186, 219, 0.88)",
    borderRadius: "1px",
    boxShadow: "0 0 4.5px rgba(0, 191, 255, 0.68), 0 0 6.3px rgba(18, 176, 229, 0.87)",
  },
  storeButtonAvt: {
    background: "#bf00ff",
    border: "none",
    color: "whitesmoke",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "9px 10.5px",
    fontSize: "15px",
    fontWeight: 500,
    boxShadow: '0 0 8px #9a00cc, 0 0 12px #9a00cc',
    letterSpacing: '0.45px',
    width: "130px"
  },
  storeButtonBnr: {
    background: "#bf00ff",
    border: "none",
    color: "whitesmoke",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "9px 10.5px",
    fontSize: "15px",
    fontWeight: 500,
    boxShadow: '0 0 8px #9a00cc, 0 0 12px #9a00cc',
    letterSpacing: '0.45px',
    width: "130px"
  },
  storeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
    marginTop: "21px",
  },
  storeGridBanner: {
    display: "grid",
    gridTemplateColumns: "repeat(1, 1fr)",
    marginTop: "21px",
  },
  avatarContainer: {
    position: "relative",
    textAlign: "center",
    marginTop: "-84px", // Adjusting to fit within the banner area properly
  },
  avatar: {
    width: "136px",
    height: "136px",
    borderRadius: "50%",
    border: "6.3px solid #ff00ff",
    boxShadow: "0 0 4px #9a00cc, 0 0 10px #9a00cc, 0 0 18px #9a00cc",
    objectFit: "cover",  // Ensures the whole circle is filled without stretching
    objectPosition: "center", // Centers the image
  },
  avatarUpload: {
    display: "block",
    marginTop: "8px",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  upAvatarBtn: {
    backgroundColor: "whitesmoke",
    color: "#222",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    margin: "9px 10.5px",
    fontSize: "15px",
    fontWeight: 600,
  },
  dropdownItem: {
    padding: "3px",
    cursor: "pointer",
  },
  username: {
    fontFamily: '"Kalam", cursive',
    fontSize: "37.2px",
    marginTop: "12px"
  },
  usernameHighLight1: {
    color: "#66ccff",
    WebkitTextStroke: '0.54px rgb(9, 134, 216)',
    fontWeight: 500,
    textShadow: "0 0 2px rgba(102, 204, 255, 0.66), 0 0 4px rgba(102, 204, 255, 0.6), 0 0 6px rgba(102, 204, 255, 0.54)"
  },
  bar: {
    border: "none",
    height: "1.5px",
    backgroundColor: "rgba(20, 186, 219, 0.88)",
    boxShadow: "0 0 4.5px rgba(0, 191, 255, 0.68), 0 0 6.3px rgba(18, 176, 229, 0.87)",
    position: "relative",
    marginTop: "-27px",
    marginBottom: "27px"
  },
  profileNav: {
    display: "flex",
    justifyContent: "center",
    gap: "16.5px",
    marginBottom: "27px",
    marginTop: "21px"
  },
  navButton: {
    backgroundColor: "#dcdcdc",
    color: "#121212",
    border: "none",
    padding: "8px 9.9px",
    borderRadius: "10.5px",
    cursor: "pointer",
    fontFamily: '"Quicksand", sans-serif',
    fontWeight: 600,
    transition: "0.3s",
    letterSpacing: '0.21px',
    WebkitTextStroke: '0.27px #121212',
  },
  activeTab: {
    backgroundColor: "#66ccff",
    color: "#121212",
    WebkitTextStroke: '0.27px #121212',
    boxShadow: '0 0 2px rgba(0, 163, 217, 0.9), 0 0 4px rgba(0, 163, 217, 0.84), 0 0 8px rgba(0, 163, 217, 0.72), 0 0 12px rgba(0, 163, 217, 0.69)'
  },
  profileContent: {
    padding: "20px",
    backgroundColor: "#1a1a1a",
    borderRadius: "10px",
    minHeight: "540px",
  },
  overview: {
    display: "flex",
    justifyContent: "space-between"
  },
  animeColumn: {
    width: "45%",
    backgroundColor: "#282828",
    padding: "10px",
    borderRadius: "10px",
  },
  actionsColumn: {
    width: "45%",
    backgroundColor: "#282828",
    padding: "10px",
    borderRadius: "10px",
  },
  logoutButton: {
    position: "absolute",
    top: '7.5px',
    right: '7.5px',
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Quicksand', sans-serif",
    color: "#ff00ff",
    backgroundColor: "#222",
    border: "1.8px solid #ff00ff",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "5px",
    letterSpacing: "0.90px",
    transition: "all 0.3s ease-in-out",
  },
};

export default Profile;
