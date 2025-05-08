import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Sider from "./Sider";
import Spinner from 'react-bootstrap/Spinner';
import DOMPurify from "dompurify";

const Search = () => {
  const location = useLocation();
  const from = location.state?.from;
  console.log(from);
  // console.log(typeof from);

  const [searchedPosts, setSearchedPost] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      let tempPosts = [];
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);

        // res.data.forEach((post) => {
        //   // console.log(typeof post.desc);
        //   if (post.title.toLowerCase().includes(from)) {
        //     tempPosts = [...tempPosts, post];
        //   }
        // });

        tempPosts = res.data.filter(
          (post) =>
            post.title.toLowerCase().includes(from) ||
            post.desc.toLowerCase().includes(from)
        );
        setSearchedPost(tempPosts);
      } catch (err) {
        console.log(err);
        alert(err.response.data);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [from]);

  console.log(searchedPosts);

  return (
    <section className="overflow-hidden pt-4">
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            {isLoading ? (
        <Spinner animation="border" variant="primary" />
            ) : (
              searchedPosts.map((post) => (
                <div key={post.id} className="card mb-4">
                  <Link
                    className="text-muted text-decoration-none"
                    to={`/posts/${post.id}`}
                    state={post}
                  >
                    <h1>{post.title}</h1>
                    {post.img && (
                      <img
                        className="img-fluid"
                        src={`${process.env.REACT_APP_API_URL}/pictures/${post.img}`}
                        alt=""
                      />
                    )}
                  </Link>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.desc?.substring(0, 200)),
                    }}
                  ></p>
                  {/* <p>{getText(post.desc).substring(0, 200)}</p> */}
                </div>
              ))
            )}
          </div>
          <div className="col-md-3 ms-auto">
            <Sider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;
