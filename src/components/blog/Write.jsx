import React, { useState, useRef, useContext, useEffect } from "react";
import { API_URL } from "../../apiPath";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import Form from "react-bootstrap/Form";
import { AppContext } from "../../contexts/appContext";
import { ColorRing } from "react-loader-spinner";
import { uploadToCloudinary } from "../../utils/upload";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const Write = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  // const [uploading, setUploading] = useState(false);

  const inputRef = useRef(null);
  const blog = useLocation().state;

  const [value, setValue] = useState(blog?.desc || "");
  const [title, setTitle] = useState(blog?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(blog?.cat || "");

  // const [err, setError] = useState(null);

  const [messageQuill, setMessageQuill] = useState(false);
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();
  const { logout, deletePostImage } = useContext(AppContext);

  const handleFileAndFileName = () => {
    if (inputRef.current.files[0].size > 3 * 1024 * 1024)
      alert("File size cannot exceed more than 3MB");
    if (inputRef.current.files.length !== 1) {
      alert("please upload only one file");
      return;
    }
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validImageTypes.includes(inputRef.current.files[0].type)) {
      alert("uploaded files must be valid image types (JPEG, PNG, GIF)");
      return;
    } else {
      setFile(inputRef.current.files[0]);
      setUploadedFileName(inputRef.current.files[0].name);
    }
  };

  const handleUploadImg = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleUpload = async () => {
    if (file) {
      try {
        // Upload blog image
        const blogImage = await uploadToCloudinary(file);
        if (!blogImage) {
          throw new Error("Unexpected API response: image upload failed.");
        }
        return { url: blogImage?.url, public_id: blogImage?.public_id };

      } catch (err) {
        console.error(err);
        alert(`An error occurred while uploading images: ${err.message}`);
      }

      if (blog) {
        try {
          // Delete the image from Cloudinary
          await axios.post(`${API_URL}/img/cloudinary/delete`, {
            public_ids: [blog.imgId], // Pass an array of public IDs for the images
          });
        } catch (err) {
          console.error(err);
          alert("An error occurred while deleting images from Cloudinary");
        }
      } else {
        if (!file) {
          alert("Please upload an image");
          return;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputRef.current.files.length == 0 && !!blog == false) {
      setMessage(true);
      return;
    }

    if (value.replace(/<(.|\n)*?>/g, "").trim().length === 0) {
      setMessageQuill(true);
      return;
    }

    const { url, public_id } = await handleUpload();

    try {
      if (blog) {
        setIsLoading(true);
        await axios.put(`${API_URL}/posts/${blog.id}`, {
          title,
          desc: value,
          cat,
          imgUrl: file ? url : blog.imgUrl,
          imgId: file ? public_id : blog.public_id,
        });
        file && deletePostImage(blog.public_id);
      } else {
        setIsLoading(true);
        await axios.post(`${API_URL}/posts/`, {
          title,
          desc: value,
          cat,
          imgUrl: url,
          imgId: public_id,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        });
      }
      setMessage(false);
      setMessageQuill(false);
      navigate("/posts");
    } catch (err) {
      // setError(err.response.data);
      alert(err.response.data);
      if (err.response.status === 401) {
        logout();
        navigate("/login");
      }
      console.log(err);
    }
    setIsLoading(false);
  };

  return (
    <section>
      <div className="container">
        <h1 className="text-center">wirte a blog</h1>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-9 mb-5">
              <input
                className="mb-4 w-100"
                type="text"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required
              />

              <ReactQuill
                style={{ height: "300px" }}
                // theme="snow"
                value={value}
                onChange={setValue}
              />

              {messageQuill && (
                <div className="bg-danger text-center m-auto w-25">
                  Please write some texts
                </div>
              )}
            </div>

            <div className="col-md-3">
              <div>
                <label className="mx-3">Choose file: </label>
                <input
                  ref={inputRef}
                  onChange={handleFileAndFileName}
                  className="d-none"
                  type="file"
                  accept="image/*"
                />

                <button
                  onClick={handleUploadImg}
                  className={`btn btn-outline-${
                    uploadedFileName ? "success" : "primary"
                  }`}
                >
                  {uploadedFileName ? uploadedFileName : "Upload"}
                </button>
                {message && (
                  <div className="bg-danger">Please upload a picture</div>
                )}

                {/* <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name=""
                onChange={(e) => setFile(e.target.files[0])}
              />
              <label className="file" htmlFor="file">
                Upload Image
              </label> */}
              </div>

              <div>
                <label className="mx-3">Choose a category: </label>
                {/* <h1> choose a category</h1> */}

                <Form.Check
                  type="radio"
                  label="business"
                  checked={cat === "business"}
                  name="cat"
                  value="business"
                  id="business"
                  required
                  onChange={(e) => setCat(e.target.value)}
                />

                <Form.Check
                  type="radio"
                  label="culture"
                  checked={cat === "culture"}
                  name="cat"
                  value="culture"
                  id="culture"
                  onChange={(e) => setCat(e.target.value)}
                />

                <Form.Check
                  type="radio"
                  label="technology"
                  checked={cat === "technology"}
                  name="cat"
                  value="technology"
                  id="technology"
                  onChange={(e) => setCat(e.target.value)}
                />

                <Form.Check
                  type="radio"
                  label="quotidian"
                  checked={cat === "quotidian"}
                  name="cat"
                  value="quotidian"
                  id="quotidian"
                  onChange={(e) => setCat(e.target.value)}
                />
              </div>

              {/* <button>Save as a draft</button> */}
              <button type="submit" className="btn btn-primary d-block mx-auto">
                {isLoading ? (
                  <ColorRing
                    visible={true}
                    height="40"
                    width="40"
                    ariaLabel="blocks-loading"
                    wrapperStyle={{}}
                    wrapperClass="blocks-wrapper"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                ) : (
                  "Publish"
                )}
              </button>
              {/* {err && <div className="bg-danger text-center">{err}</div>} */}
            </div>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default Write;
