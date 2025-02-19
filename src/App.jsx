import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase-Client erstellen
const supabase = createClient(
  "https://zyhlrhhgkqzrbbsxsmwl.supabase.co", // Deine Supabase-URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5aGxyaGhna3F6cmJic3hzbXdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTQyNzAsImV4cCI6MjA1NTQ3MDI3MH0.-Do9hUyrzgKChxrl-eQq6BVzON_9l6lqoD1sLZC0Ai4" // Dein API-Schlüssel
);

function App() {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    name: "",
    description: "",
    maps_link: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  // 📌 Orte aus Supabase abrufen
  useEffect(() => {
    async function fetchPlaces() {
      const { data, error } = await supabase.from("places").select("*");

      if (error) {
        setError("Fehler beim Abrufen der Orte: " + error.message);
      } else {
        setPlaces(data);
        fetchComments(data); // Kommentare für diese Orte abrufen
      }
      setLoading(false);
    }
    fetchPlaces();
  }, []);

  // 📌 Kommentare für die Orte abrufen
  async function fetchComments(places) {
    const commentsObj = {};
    for (const place of places) {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("place_id", place.id);

      if (error) {
        console.error("Fehler beim Abrufen der Kommentare:", error.message);
      } else {
        commentsObj[place.id] = data;
      }
    }

    setComments(commentsObj); // Setze die Kommentare im State
  }

  // 📌 Datei-Upload-Funktion für Bilder und Videos
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, file);

    if (error) {
      console.error("Fehler beim Hochladen:", error.message);
      alert("Fehler beim Hochladen: " + error.message);
      return;
    }

    // ✅ Signierte URL generieren
    const { data: signedUrlData, error: signedUrlError } =
      await supabase.storage.from("uploads").createSignedUrl(fileName, 86400);

    if (signedUrlError) {
      console.error("Fehler beim Erstellen der URL:", signedUrlError.message);
      alert("Fehler beim Erstellen der URL.");
      return;
    }

    setNewPlace((prevState) => ({
      ...prevState,
      image: signedUrlData.signedUrl, // Speichern der URL
    }));
  }

  // 📌 Ort mit Bild/Videolink speichern
  async function addPlace() {
    const { name, description, maps_link, image } = newPlace;
    if (!name || !description || !maps_link || !image) {
      alert("Bitte alle Felder ausfüllen!");
      return;
    }

    const { error } = await supabase
      .from("places")
      .insert([{ name, description, maps_link, image_url: image }]);

    if (error) {
      console.error("Fehler beim Hinzufügen des Ortes:", error.message);
      alert("Fehler beim Hinzufügen des Ortes: " + error.message);
    } else {
      alert("Ort erfolgreich hinzugefügt!");
      setNewPlace({ name: "", description: "", maps_link: "", image: null });
      window.location.reload();
    }
  }

  // Kommentar hinzufügen
  async function addComment(placeId) {
    const commentText = newComment[placeId];
    if (!commentText) {
      alert("Bitte einen Kommentar eingeben.");
      return;
    }

    const { error } = await supabase
      .from("comments")
      .insert([{ place_id: placeId, comment: commentText }]);

    if (error) {
      console.error("Fehler beim Hinzufügen des Kommentars:", error.message);
      alert("Fehler beim Hinzufügen des Kommentars: " + error.message);
    } else {
      alert("Kommentar erfolgreich hinzugefügt!");
      setNewComment((prevState) => ({ ...prevState, [placeId]: "" })); // Eingabefeld für diesen Ort leeren
      fetchComments(places); // Kommentare neu laden
    }
  }

  return (
    <div>
      <h1>Hidden gems in Paris</h1>

      {/* 📌 Eingabeformular für neue Orte */}
      <div>
        <h2>Share a new gem</h2>
        <input
          type="text"
          placeholder="name of the place"
          value={newPlace.name}
          onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
        />
        <textarea
          placeholder="description"
          value={newPlace.description}
          onChange={(e) =>
            setNewPlace({ ...newPlace, description: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Google Maps link"
          value={newPlace.maps_link}
          onChange={(e) =>
            setNewPlace({ ...newPlace, maps_link: e.target.value })
          }
        />
        <input type="file" onChange={handleUpload} />
        <button onClick={addPlace}>Save</button>
      </div>

      {/* 📌 Orte anzeigen */}
      <div>
        <h2>Saved gems</h2>
        {loading && <p>load places...</p>}
        {error && <p style={{ color: "red" }}>Fehler: {error}</p>}

        {places.length > 0 ? (
          places.map((place, index) => (
            <div key={index}>
              <h3>{place.name}</h3>
              <p>{place.description}</p>
              <a
                href={place.maps_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps Link
              </a>

              {/* 📌 Bild oder Video anzeigen */}
              {place.image_url && (
                <>
                  {place.image_url.match(/\.(mp4|webm|ogg)$/) ? (
                    <video controls style={{ width: "300px" }}>
                      <source src={place.image_url} type="video/mp4" />
                      Dein Browser unterstützt dieses Videoformat nicht.
                    </video>
                  ) : (
                    <img
                      src={place.image_url}
                      alt={place.name}
                      style={{ width: "300px", height: "auto" }}
                    />
                  )}
                </>
              )}

              {/* 📌 Kommentare für diesen Ort */}
              <div>
                <h4>Review:</h4>
                {comments[place.id] && comments[place.id].length > 0 ? (
                  comments[place.id].map((comment, index) => (
                    <p key={index}>{comment.comment}</p>
                  ))
                ) : (
                  <p>share your comment</p>
                )}

                {/* Kommentar Eingabefeld für den jeweiligen Ort */}
                <input
                  type="text"
                  placeholder="share comment"
                  value={newComment[place.id] || ""}
                  onChange={(e) =>
                    setNewComment((prevState) => ({
                      ...prevState,
                      [place.id]: e.target.value,
                    }))
                  }
                />
                <button onClick={() => addComment(place.id)}>add</button>
              </div>
            </div>
          ))
        ) : (
          <p>No gems found</p>
        )}
      </div>
    </div>
  );
}

export default App;
