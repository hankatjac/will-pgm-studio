import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Like = ({ cat, id }) => {
  const [filterPost, setFilterPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/?cat=${cat}`);
        let posts = res.data;
        setFilterPost(posts.filter((post) => post.id !== id));
      } catch (err) {
        console.log(err);
        alert(err.response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [cat, id]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="card-title">Similar Post</h4>
        {isLoading ? (
     <Spinner animation="border" variant="primary" />
        ) : (
          filterPost.map((post) => (
            <div className="post" key={post.id}>
              {post.img && (
                <img
                  className="img-fluid"
                  src={`${process.env.REACT_APP_API_URL}/pictures/${post?.img}`}
                  alt=""
                />
              )}
              <h6>{post.title}</h6>
              <Link
                className="btn btn-primary btn-sm mb-2"
                to={`/posts/${post.id}`}
                state={post}
              >
                Read More
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Like;
