import {useEffect} from "react";

export const useTitle = (title: string) => {
  useEffect(() => {
    window.scroll({ top: 0 });
    document.title = title;
  }, [title]);
};