import React from "react";
import SpinnerIcon from "./SpinnerIcon";

export const Loading = (props: any) => {

  return (
    <>
      {props.loading ? (
        <div className={props.isFromProtectedRoute ? "w-full h-full height-full-container elements-center" : "w-full h-full"}>
          {
            props.content && <span>{props.content}</span>
          }
          <SpinnerIcon />
        </div>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
};