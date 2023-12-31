import { FaChevronLeft } from "react-icons/fa";
import { useLoaderData, useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import Suggestion from "../components/Suggestion";
import DetailedComments from "../components/DetailedComments";
import { INITIAL_CHARS } from "../data/types";
import { useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import { FeedbackContext } from "../context/FeedbackContext";
import LinkButton from "../components/LinkButtons";
import util from "../data/service";
import SuggestionTablet from "../components/SuggestionTablet";

const Comments = () => {
  const [comment, setComment] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [charactersLeft, setCharactersLeft] = useState(INITIAL_CHARS);
  const [suggestion, setSuggestion] = useState(useLoaderData());
  const { currentUserData, setSuggestions, setFetchData } =
    useContext(FeedbackContext);
  const navigate = useNavigate();
  const backClickHandler = () => {
    navigate(-1);
  };
  const postCommentHandler = (event) => {
    event.preventDefault();
    if (!/\S/.test(comment)) {
      setShowWarning(true);
      setTimeout(() => {
        setShowWarning(false);
      }, 1500);
      return;
    }
    const id = uuid();
    const commentObject = {
      id,
      content: comment,
      user: currentUserData,
      replies: [],
    };
    setComment("");
    setCharactersLeft(INITIAL_CHARS);
    util.addComment(suggestion.id, commentObject).then((response) => {
      setSuggestion(response);
      setSuggestions((prevState) => {
        const updatedSuggestions = prevState.map((state) => {
          if (state.id === response.id) {
            return response;
          }
          return state;
        });
        return updatedSuggestions;
      });
      setFetchData((prevState) => !prevState);
    });
  };
  const commentHandler = (event) => {
    const value = event.target.value;
    const charsLeft = INITIAL_CHARS - value.length;
    if (charactersLeft > 0) {
      setCharactersLeft(charsLeft);
      setComment(value);
    } else {
      setComment((prevValue) => {
        if (prevValue.length > value.length) {
          setCharactersLeft(charsLeft);
          return value;
        } else {
          return prevValue;
        }
      });
    }
  };
  return (
    <div className="max-w-md mx-auto tablet:max-w-xl tablet:mx-auto desktop:max-w-3xl desktop:mx-auto tablet:px-5 tablet:py-16 min-h-screen py-7 px-4 bg-grayTheme flex flex-col gap-10 select-none">
      <div className="flex justify-between">
        <div onClick={backClickHandler} className="flex gap-2 items-center desktop:text-xl ">
          <FaChevronLeft className="w-2 text-blueTheme" />
          <span className="hover:underline font-semibold text-darkGrayTheme">
            Go Back
          </span>
        </div>
        <LinkButton color={"#4661E6"} text={"Edit Feedback"} />
      </div>

      <div className="flex flex-col">
        <Suggestion suggestion={suggestion} isPresentational={true} />
        <SuggestionTablet suggestion={suggestion} isPresentational={true}/>
        <div className=" py-3 px-2 bg-white rounded-xl">
          <span className="px-4 text-2xl font-semibold text-lighterBlueBlackTheme">
            {suggestion.numOfComments}{" "}
            {suggestion.numOfComments === 1 ? "Comment" : "Comments"}
          </span>
          {suggestion.comments.length !== 0 &&
            suggestion.comments.map((message) => {
              return (
                <DetailedComments
                  key={message.id}
                  message={message}
                  suggestionId={suggestion.id}
                  setSuggestion={setSuggestion}
                />
              );
            })}
        </div>
      </div>
      <div className="mt-6 py-6 px-3 bg-white rounded-xl tablet:p-7">
        <form className="flex flex-col gap-4">
          <h2 className=" text-2xl font-semibold text-lighterBlueBlackTheme">
            Add Comment
          </h2>
          <textarea
            onChange={commentHandler}
            placeholder="Type your comment here"
            value={comment}
            rows={3}
            className={`rounded bg-grayTheme p-3 ${
              showWarning ? "outline-red-500" : "focus:outline-blueTheme"
            } outline-offset-0 outline-1 outline-none`}
          />
          {showWarning && (
            <span className="text-red-600">Can&apos;t be empty</span>
          )}
          <div className="flex items-center justify-between">
            <span className="text-darkGrayTheme">
              {charactersLeft}{" "}
              {charactersLeft === 1 ? "Character" : "Characters"} left
            </span>
            <CustomButton
              text={"Post Comment"}
              type="submit"
              color={"#AD1FEA"}
              onClick={postCommentHandler}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments;
