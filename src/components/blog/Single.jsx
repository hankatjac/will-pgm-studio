import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Like from "./Like";
import axios from "axios";
import moment from "moment";
import DOMPurify from "dompurify";
import Sider from "./Sider";
import { AppContext } from "../../contexts/appContext";
import { MdDelete } from "react-icons/md";
import { GrEdit } from "react-icons/gr";
import getCurrentUser from "../../utils/getCurrentUser";

const Single = () => {
  // const { id } = useParams();
  const [readMore, setReadMore] = useState(false);
  const navigate = useNavigate();
  // const location = useLocation();
  // const postId = location.pathname.split("/")[2];
  // console.log(location.pathname.split("/"))
  const { logout, deletePostImage } = useContext(AppContext);
  const currentUser = getCurrentUser();
  const post = useLocation().state;

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${post.id}`);
      navigate("/posts");
    } catch (err) {
      console.log(err);
      if (err.response.status === 401) {
        logout();
        navigate("/login");
      }
      return;
    }
    deletePostImage(post.imgId);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-9">
          <div className="user">
            <div className="info">
              <span className="text-capitalize">{post.username}</span>
              <p>Posted {moment(post.date).fromNow()}</p>
            </div>
            {currentUser?.username === post.username && (
              <div>
                <Link
                  className="me-3"
                  // to={`/posts/write?edit=${post.id}`}
                  to={`/posts/write/${post.id}`}
                  state={post}
                >
                  <GrEdit
                    style={{
                      color: "blue",
                      cursor: "pointer",
                      width: "30px",
                      height: "30px",
                    }}
                  />
                </Link>{" "}
                <MdDelete
                  style={{
                    color: "red",
                    cursor: "pointer",
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={handleDelete}
                />
              </div>
            )}
          </div>
          <h1>{post.title}</h1>
          <div>
            <img className="img-fluid" src={post?.imgUrl} alt="" />
          </div>

          {readMore ? (
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc),
              }}
            ></p>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc?.substring(0, 500)),
              }}
            ></p>
            // `${getText(post.desc).substring(0, 500)}...`
          )}
          <div>
            <button onClick={() => setReadMore(!readMore)}>
              {readMore ? "show less" : "  show more"}
            </button>
          </div>
        </div>

        <div className="col-md-3 ms-auto">
          <Sider />
          <Like cat={post.cat} id={post.id} />
          {/* <Menu cat={post.cat} /> */}
        </div>
      </div>
    </div>
  );
};

export default Single;
