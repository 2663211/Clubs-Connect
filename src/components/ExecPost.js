import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

export default function ExecPost() {
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async () => {
  if (!user) return alert("You must be logged in to post.");
  if (!file) return alert("Please select a file.");

  setLoading(true);

  try {
    // 1. Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("media").getPublicUrl(filePath);
    const mediaUrl = data.publicUrl;

    const mediaType = file.type.startsWith("image")
      ? "image"
      : file.type.startsWith("video")
      ? "video"
      : "audio";

    // 2. Insert post (no profile_id)
    const { error: insertError } = await supabase.from("posts").insert([
      {
        caption,
        media_url: mediaUrl,
        media_type: mediaType
      }
    ]);

    if (insertError) throw insertError;

    alert("Post created successfully!");
    setCaption("");
    setFile(null);

  } catch (err) {
    console.error(err);
    alert("Error creating post: " + err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ maxWidth: "600px", margin: "1rem auto", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Create Post</h2>

      <textarea
        placeholder="Write your caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />

      <input type="file" onChange={handleFileChange} style={{ marginBottom: "1rem" }} />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </div>
  );
}
