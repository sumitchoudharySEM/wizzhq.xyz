"use client";

import React, { useState, useEffect } from "react";
import {
  HandThumbUpIcon as HandThumbUpOutline,
  HandThumbDownIcon as HandThumbDownOutline,
  ChatBubbleLeftIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpSolid,
  HandThumbDownIcon as HandThumbDownSolid,
} from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

//auth modal for unauthenticated users
const AuthModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Authentication Required
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Oops! You need to be signed in to perform this action.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <Link
            href="/signin"
            className="px-4 py-2 bg-[#2fcc71] text-white rounded hover:bg-green-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

//main component for comments
const Page = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const { bountie_id } = useParams();
  const { data: session } = useSession();
  
  //check if user is authenticated
  const checkAuth = () => {
    if (!session) {
      setShowAuthModal(true);
      return false;
    }
    return true;
  };
  
  //fetch listing and comments
  const fetchListingAndComments = async () => {
    try {
      const listingResponse = await fetch(`/api/bounty?slug=${bountie_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const listingData = await listingResponse.json();
      setListing(listingData.listing);

      if (listingData.listing) {
        const commentsResponse = await fetch(
          `/api/bounty_comments/comments?listing_id=${listingData.listing.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const commentsData = await commentsResponse.json();
        setComments(commentsData.comments);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch comments and listing data");
    } finally {
      setLoading(false);
    }
  };
  
  //handle post reactions
  const handleReaction = async (targetId, targetType, reactionType) => {
    if (!checkAuth()) return;

    try {
      const response = await fetch("/api/bounty_comments/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          target_id: targetId,
          target_type: targetType,
          reaction_type: reactionType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit reaction");
      }

      fetchListingAndComments();
    } catch (error) {
      console.error("Error submitting reaction:", error);
    }
  };
  
  //handle comment posting
  const handleSubmitComment = async () => {
    if (!checkAuth()) return;
    if (!newComment.trim() || !listing) return;
    
    setIsPosting(true);
    try {
      const response = await fetch("/api/bounty_comments/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing_id: listing.id,
          comment_text: newComment,
        }),
      });

      if (response.ok) {
        fetchListingAndComments();
        setNewComment("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsPosting(false);
    }
  };
  
  //handle reply to a comment
  const handleSubmitReply = async (commentId, replyText) => {
    if (!checkAuth()) return;

    try {
      const response = await fetch("/api/bounty_comments/comment_replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment_id: commentId,
          reply_text: replyText,
        }),
      });

      if (response.ok) {
        fetchListingAndComments();
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      throw error;
    }
  };
  
  //call fetchListingAndComments on component mount
  useEffect(() => {
    fetchListingAndComments();
  }, [bountie_id]);

  if (loading)
    return (
      <div className="w-full min-h-[90vh] flex items-center justify-center z-50 bg-[#F8FAFC] backdrop-blur-md">
        <iframe
          src="https://lottie.host/embed/0e906fb1-4db8-4ee5-83a1-571bf2354be3/swOYAUc0eE.json"
          title="Loading Animation"
          className="w-24 h-24"
        ></iframe>
      </div>
    );
  if (error) return <div>{error}</div>;
  
  //comment component
  const Comment = ({ comment, onReact, onReplySubmit }) => {
    const [localLikes, setLocalLikes] = useState(comment.like_count);
    const [localDislikes, setLocalDislikes] = useState(comment.dislike_count);
    const [isLiked, setIsLiked] = useState(comment.userReaction === "like");
    const [isDisliked, setIsDisliked] = useState(
      comment.userReaction === "dislike"
    );
    const [showReply, setShowReply] = useState(false);
    const [newReply, setNewReply] = useState("");
    const [isReplyPosting, setIsReplyPosting] = useState(false);
    
    //function to like a comment
    const handleLike = () => {
      if (!checkAuth()) return;
      onReact(comment.comment_id, "comment", isLiked ? "unlike" : "like");

      if (!isLiked) {
        setLocalLikes((prev) => prev + 1);
        if (isDisliked) {
          setLocalDislikes((prev) => prev - 1);
          setIsDisliked(false);
        }
        setIsLiked(true);
      } else {
        setLocalLikes((prev) => prev - 1);
        setIsLiked(false);
      }
    };
    
    //function to dislike a comment
    const handleDislike = () => {
      if (!checkAuth()) return;
      onReact(
        comment.comment_id,
        "comment",
        isDisliked ? "undislike" : "dislike"
      );

      if (!isDisliked) {
        setLocalDislikes((prev) => prev + 1);
        if (isLiked) {
          setLocalLikes((prev) => prev - 1);
          setIsLiked(false);
        }
        setIsDisliked(true);
      } else {
        setLocalDislikes((prev) => prev - 1);
        setIsDisliked(false);
      }
    };
    
    //function to submit a reply to a comment
    const handleReplySubmit = async () => {
      if (!checkAuth()) return;
      if (!newReply.trim()) return;

      setIsReplyPosting(true);
      try {
        await onReplySubmit(comment.comment_id, newReply);
        setNewReply("");
        setShowReply(false);
      } catch (error) {
        console.error("Error submitting reply:", error);
      } finally {
        setIsReplyPosting(false);
      }
    };
    
    //reply component
    const Reply = ({ reply }) => {
      const [replyLikes, setReplyLikes] = useState(reply.like_count);
      const [replyDislikes, setReplyDislikes] = useState(reply.dislike_count);
      const [replyIsLiked, setReplyIsLiked] = useState(
        reply.userReaction === "like"
      );
      const [replyIsDisliked, setReplyIsDisliked] = useState(
        reply.userReaction === "dislike"
      );
      
      //function to like a reply to a comment
      const handleReplyLike = () => {
        if (!checkAuth()) return;
        onReact(reply.reply_id, "reply", replyIsLiked ? "unlike" : "like");

        if (!replyIsLiked) {
          setReplyLikes((prev) => prev + 1);
          if (replyIsDisliked) {
            setReplyDislikes((prev) => prev - 1);
            setReplyIsDisliked(false);
          }
          setReplyIsLiked(true);
        } else {
          setReplyLikes((prev) => prev - 1);
          setReplyIsLiked(false);
        }
      };
      
      //function to dislike a reply to a comment
      const handleReplyDislike = () => {
        if (!checkAuth()) return;
        onReact(
          reply.reply_id,
          "reply",
          replyIsDisliked ? "undislike" : "dislike"
        );

        if (!replyIsDisliked) {
          setReplyDislikes((prev) => prev + 1);
          if (replyIsLiked) {
            setReplyLikes((prev) => prev - 1);
            setReplyIsLiked(false);
          }
          setReplyIsDisliked(true);
        } else {
          setReplyDislikes((prev) => prev - 1);
          setReplyIsDisliked(false);
        }
      };
      
      //reply component
      return (
        <div className="flex items-start gap-2 mt-7 ml-5 md:ml-12 pl-4 border-l-2 border-gray-300 rounded-md">
          <img
            src={reply.user_image}
            alt={`${reply.user_name} profile`}
            className="w-[26px] h-[26px] object-cover rounded-full"
          />
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <h5 className="font-medium text-base text-gray-800">
                {reply.user_name}
              </h5>
              <span className="text-[13px] text-gray-500">
                {new Date(reply.created_at).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-700">{reply.reply_text}</p>
            
            {/* like and dislike buttons for reply */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={handleReplyLike}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
              >
                {replyIsLiked ? (
                  <HandThumbUpSolid className="w-4 h-4 text-blue-500" />
                ) : (
                  <HandThumbUpOutline className="w-4 h-4" />
                )}
                <span>{replyLikes}</span>
              </button>

              <button
                onClick={handleReplyDislike}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                {replyIsDisliked ? (
                  <HandThumbDownSolid className="w-4 h-4 text-red-500" />
                ) : (
                  <HandThumbDownOutline className="w-4 h-4" />
                )}
                <span>{replyDislikes}</span>
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    //main comment component
    return (
      <div className="flex items-start gap-3 my-5 border-b pb-5">
        <img
          src={comment.user.image}
          alt={`${comment.user.name} profile`}
          className="w-10 h-10 object-cover rounded-full"
        />

        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{comment.user.name}</h4>
            <span className="text-[13px] text-gray-500">
              {new Date(comment.comment_created_at).toLocaleString()}
            </span>
          </div>

          <p className="text-gray-700 mb-3">{comment.comment_text}</p>
          
          {/* like, dislike and reply buttons */}
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 transition-colors"
            >
              {isLiked ? (
                <HandThumbUpSolid className="w-4 h-4 text-blue-500" />
              ) : (
                <HandThumbUpOutline className="w-4 h-4" />
              )}
              <span>{localLikes}</span>
            </button>

            <button
              onClick={handleDislike}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              {isDisliked ? (
                <HandThumbDownSolid className="w-4 h-4 text-red-500" />
              ) : (
                <HandThumbDownOutline className="w-4 h-4" />
              )}
              <span>{localDislikes}</span>
            </button>

            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChatBubbleLeftIcon className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>

          {showReply && (
            <div className="mt-5 flex items-center gap-3">
              <input
                type="text"
                placeholder="Write a reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                className="w-full text-gray-800 bg-transparent border-b border-gray-300 p-2 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={handleReplySubmit}
                disabled={isReplyPosting}
                className={`text-green-500 hover:text-green-600 ${isReplyPosting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isReplyPosting ? 'Sending...' : 'Send'}
              </button>
            </div>
          )}
          
          {/* render replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6">
              {comment.replies.map((reply) => (
                <Reply key={reply.reply_id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-full mx-auto mt-6 px-2 md:px-4">
      {/* number of comments */}
      <div className="mb-4 flex gap-2 items-center">
        <ChatBubbleLeftRightIcon className="w-5 h-5 text-gray-800" />
        <h1 className="text-base font-semibold text-gray-800">
          {comments.length} Comments
        </h1>
      </div>
      
      {/* comment input */}
      {session?.user ? (
        <div className="flex items-center gap-3 mb-8">
          <img
            src={session.user.image || ""}
            alt="User profile"
            className="w-10 h-10 object-cover rounded-full"
          />

          <div className="flex-grow flex items-center gap-3">
            <input
              type="text"
              placeholder="Write a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border-b text-gray-800 border-gray-300 bg-transparent p-2 focus:outline-none focus:border-green-500"
            />
            <button
              onClick={handleSubmitComment}
              disabled={isPosting}
              className={`bg-[#2fcc71] text-white px-6 py-2 rounded hover:bg-green-500 transition-colors ${
                isPosting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 mb-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">Sign in to join the discussion</p>
          <Link
            href="/signin"
            className="px-4 py-2 bg-[#2fcc71] text-white rounded hover:bg-green-500 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
      
      {/* render comments */}
      {comments.map((comment) => (
        <Comment
          key={comment.comment_id}
          comment={comment}
          onReact={(targetId, targetType, reactionType) =>
            handleReaction(targetId, targetType, reactionType)
          }
          onReplySubmit={handleSubmitReply}
        />
      ))}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Page;