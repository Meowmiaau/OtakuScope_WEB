import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import "../styles/Profile.css";
import Navbar from "../components/Navbar";

const Profile = () => {
  // Fetch username from localStorage directly
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingTab, setEditingTab] = useState("profileEditing");
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "/AnimeGirl.png");
  const [banner, setBanner] = useState(localStorage.getItem("banner") || "/AnimeBanner.jpg");
  const [activeTab, setActiveTab] = useState("Stats");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Added for navigation functionality if needed

    //activeTab as dependency

  useEffect(() => {
    // Retrieve username from localStorage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername.trim() !== "") {
      setUsername(storedUsername);
    } else {
      navigate("/login"); // If username is not in localstorage or is an empty string, jsut redirect to Login Page
    }
  }, [navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
          const token = localStorage.getItem('token');
          if (!token) {
              console.error("No authentication token found");
              return; // Exit if no token is available
          }
          
          console.log("Fetching stats with token:", token); // Add this to debug
          
          const response = await fetch('http://localhost:5000/api/profile/stats', {
              method: 'GET', // Explicitly set method
              headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });
          
          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to fetch stats: ${response.status} ${errorText}`);
          }
          
          const data = await response.json();
          console.log("Stats data fetched from API:", data); // Keep this log
          
          // Update state with the fetched data
          setStats({
              totalAnime: data.totalAnime || 0,
              watching: data.watching || 0,
              watched: data.watched || 0,
              favoritesCount: data.favoritesCount || 0,
              currentlyWatching: data.currentlyWatching || [],
              favoriteAnime: data.favoriteAnime || [],
              distribution: {
                  watching: parseFloat(data.distribution.watching) || 0,
                  watched: parseFloat(data.distribution.watched) || 0,
                  plan_to_watch: parseFloat(data.distribution.plan_to_watch) || 0
              }
          });
      } catch (error) {
          console.error("Fetch error:", error);
          // Consider adding user-facing error handling here
        } finally {
          setIsLoading(false);
          }
  };

    // Only fetch when Stats tab is active
    if (activeTab === 'Stats') {
        console.log("Initiating stats fetch for tab:", activeTab);
        fetchStats();
    }
  }, [activeTab]);

  
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

  const [stats, setStats] = useState({
    totalAnime: 0,
    watching: 0,
    watched: 0,
    favoritesCount: 0,
    currentlyWatching: [],
    favoriteAnime: [],
    distribution: {
      watching: 0,
      watched: 0,
      plan_to_watch: 0
    }
  });

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
    <div className="profileContainer">
      <Navbar /> 
      {/* Avatar & Banner Section */}
      <div className="profileHeader">
        {/* Banner with Background & Controls */}
        <div
           className="banner"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          

        </div>

        {/* Avatar Container (positioned separately, typically overlapping the banner) */}
        <div className="avatarContainer">
          {avatar.endsWith(".mp4") ? (
            <video
              src={avatar}
               className="avatarVideo"
              width="123px"
              height="123px"
              autoPlay
              loop
              muted
            />
          ) : (
            <img src={avatar} alt="Avatar"  className="avatar" />
          )}

          {/* Hidden Upload Inputs */}
          <input
            type="file"
             className="hiddenFileInput"
            id="avatar-upload"
            accept="image/*"
            onClick={(e) => (e.target.value = null)}
            onChange={handleAvatarChange}
          />
          <input
            type="file"
             className="hiddenFileInput"
            id="banner-upload"
            accept="image/*"
            onChange={handleBannerChange}
          />
        </div>

        {/* Welcome, Profile Editing & Removal Buttons */}
          <div  className="profileButtonsContainer">
          <div className="welcomeMessage">
            <h2 className="username">
              Welcome <span className="usernameHighLight1">{username}</span> 
            </h2>
          </div>

          {/* Banner Buttons Container */}
          <div className="profileTabShadow">

            {/* Removal Buttons */}
            <div className="removeButtonGroup">
            <img src="/RemvAvatar.png" alt="Remove Avatar" onClick={handleRemoveAvatar}  className="removeIcon1" />
              <button onClick={handleRemoveAvatar} className="upAvatarBtn">Remove Avatar</button>
              </div>
              <div  className="removeButtonGroup bannerGroup">

                <button onClick={handleRemoveBanner} className="upBannerBtn">Remove Banner</button>
            <img src="/RemvBanner.png" alt="Remove Banner" onClick={handleRemoveAvatar}  className="removeIcon2" />
              </div>

            {/* Profile Editing Section */}
            <div className="editProfileGroup">
              <img src="/ProfileEdit.png" alt="Edit Profile"  className="editProfileIcon"  onClick={() => openEditingTab("profileEditing")} />
              <button onClick={() => openEditingTab("profileEditing")} className="editProfile">Edit Profile</button>
            </div>

            </div>


          </div>


        {isEditing && (
          <div className="editingOverlay">
            <div className={editingTab === "profileEditing" ? "editingTab" : "storesTab"}>
              <button className={editingTab === "profileEditing" ? "closeButtonProfileEdit" : "closeButtonStores"} onClick={closeEditingTab}>✖</button>

              {editingTab === "profileEditing" && (
                <div>
                  <h3 className="ProfileEditing">Profile Editing</h3>
                  <label htmlFor="avatar-upload" className="upAvatarBtn">Upload Avatar</label>
                  <label htmlFor="banner-upload" className="upAvatarBtn">Upload Banner</label>
                  <br></br> <br></br>
                  <button onClick={() => openEditingTab("storeAvatar")} className="storeButtonAvt">
                   Avatar Store 
                  </button>
                  <button onClick={() => openEditingTab("storeBanner")} className="storeButtonBnr">
                   Banner Store
                  </button>
                </div>
              )}

              {editingTab === "storeAvatar" && (
                <div>
                  <h3 className="ProfileEditing">Avatar Store</h3>
                  <button onClick={() => openEditingTab("profileEditing")} className="backeditBtn">
                    Back to Editing
                  </button>

                  {/* Scrollable store list */}
                  <div className="storeGrid" style={{ overflowY: "auto", maxHeight: "300px" }}>
                    {storeAvatars.map((avatarOption, index) => (
                      <div
                        key={index}
                        onClick={() => handleStoreAvatarSelect(avatarOption)} // Updates avatar instantly
                        className="dropdownItem"
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
                  <h3 className="ProfileEditing">Banner Store</h3>
                  <button onClick={() => openEditingTab("profileEditing")} className="backeditBtn">
                    Back to Editing
                  </button>

                  {/* Scrollable store list */}
                  <div className="storeGridBanner" style={{ overflowY: "auto", maxHeight: "300px" }}>
                    {storeBanners.map((bannerOption, index) => (
                      <div
                        key={index}
                        onClick={() => handleStoreBannerSelect(bannerOption)} // Updates banner instantly
                        className="dropdownItem"
                      >
                        <img
                          src={bannerOption}
                          alt={bannerOption.split("/").pop()}
                          style={{ width: "390px", height: "90px", borderRadius: "1px" }}
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

      <hr className="bar"></hr>

      {/* Profile Options Bar */}

      {/*<div className="profileNav">
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
            className={activeTab === tab ? "navButton activeTab" : "navButton"}
          >
            {tab}
          </button>
        ))}
      </div> */}

      
      <div className="profileContent">
        {/* Content Display 
        {activeTab === "Overview" && (
          <div className="overview">
            <div className="animeColumn">Anime interactions go here...</div>
            <div className="actionsColumn">Action log goes here...</div>
          </div>
        )}*/}

      {activeTab === "Stats" && (
        <div className="statsContainer">
          <h2 className="statsHeader">{username}'s Statistics</h2>
    
          {isLoading ? (
            <div className="loadingStats">Loading statistics...</div>
          ) : (
            <>
              {/* Quick Stats Overview */}
              <div className="quickStats">
                <div className="statCard">
                  <div className="statNumber">{stats.totalAnime}</div>
                  <div className="statLabel">Total Anime</div>
                </div>
                <div className="statCard">
                  <div className="statNumber">{stats.watching}</div>
                  <div className="statLabel">Watching</div>
                </div>
                <div className="statCard">
                  <div className="statNumber">{stats.watched}</div>
                  <div className="statLabel">Completed</div>
                </div>
                <div className="statCard">
                  <div className="statNumber">{stats.favoritesCount}</div>
                  <div className="statLabel">Favorites</div>
                </div>
              </div>
        
              {/* Detailed Sections */}
              <div className="statsSections">
                {/* Currently Watching */}
                <div className="statsSection">
                  <h3>Currently Watching ({stats.watching})</h3>
                  {stats.currentlyWatching && stats.currentlyWatching.length > 0 ? (
                    <div className="animeGrid">
                      {stats.currentlyWatching.map(anime => (
                        <Link to={`/anime/${anime.id}`} key={anime.id}>
                          <div className="animeCard">
                            <img 
                              src={`https://img.anili.st/media/${anime.id}`} 
                              alt={anime.title} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-anime.jpg';
                              }}
                            />
                            <div className="animeTitle">{anime.title}</div>
                          </div>
                        </Link>
                     ))}
                    </div>
                  ) : (
                    <p className="noDataMessage">No currently watching anime</p>
                  )}
                </div>

                {/* Favorite Anime */}
                <div className="statsSection">
                  <h3>Favorite Anime ({stats.favoritesCount})</h3>
                 {stats.favoriteAnime && stats.favoriteAnime.length > 0 ? (
                    <div className="animeGrid">
                      {stats.favoriteAnime.map(anime => (
                        <Link to={`/anime/${anime.id}`} key={anime.id}>
                          <div className="animeCard favorite">
                            <img 
                              src={`https://img.anili.st/media/${anime.id}`} 
                              alt={anime.title} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-anime.jpg';
                              }}
                            />
                            <div className="animeTitle">{anime.title}</div>
                            <div className="score">★ {anime.score || 'N/A'}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="noDataMessage">No favorite anime yet</p>
                  )}
                </div>

                {/* Anime Distribution */}
                <div className="statsSection">
                  <h3>Anime Distribution</h3>
                  <div className="statusChart">
                    <div className="chartBar" style={{ width: `${stats.distribution.watching}%` }}>
                      <span>Watching ({stats.distribution.watching}%)</span>
                    </div>
                    <div className="chartBar" style={{ width: `${stats.distribution.watched}%` }}>
                      <span>Watched ({stats.distribution.watched}%)</span>
                    </div>
                    <div className="chartBar" style={{ width: `${stats.distribution.plan_to_watch}%` }}>
                      <span>Plan to Watch ({stats.distribution.plan_to_watch}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );

};



export default Profile;