import { handleSemiDarkMode } from "@/store/layout";
import { useSelector, useDispatch } from "react-redux";
import type { LayoutState } from "@/types/index";

const useSemiDark = (): [boolean, (val: boolean) => void] => {
  const dispatch = useDispatch();
  const isSemiDark = useSelector(
    (state: { layout: LayoutState }) => state.layout.semiDarkMode
  );

  const setSemiDark = (val: boolean) => dispatch(handleSemiDarkMode(val));

  return [isSemiDark, setSemiDark];
};

export default useSemiDark;
