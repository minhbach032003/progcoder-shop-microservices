import { createAction } from "@reduxjs/toolkit";

export const updateSearchFilter = createAction<string>("cart/updateSearchFilter");
export const updateCategoryFilter = createAction<string>("cart/updateCategoryFilter");
