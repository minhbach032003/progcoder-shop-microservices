import { apiSlice } from "../apiSlice";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  extendedProps?: {
    description?: string;
    location?: string;
    calendar?: string;
  };
}

export interface CalendarCategory {
  id: string;
  name: string;
  color: string;
}

export const calendarApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CalendarCategory[], void>({
      query: () => "/categories",
    }),
    getCalendarEvents: builder.query<CalendarEvent[], void>({
      query: () => "/calendarEvents",
      providesTags: [{ type: "events" }],
    }),
    createCalendarEvent: builder.mutation<CalendarEvent, Partial<CalendarEvent>>({
      query: (event) => ({
        url: "/calendarEvents",
        method: "POST",
        body: event,
      }),
      invalidatesTags: [{ type: "events" }],
    }),
    editCalendarEvent: builder.mutation<CalendarEvent, { id: string; event: Partial<CalendarEvent> }>({
      query: ({ id, event }) => ({
        url: `/calendarEvents/${id}`,
        method: "PUT",
        body: { id, ...event },
      }),
      invalidatesTags: [{ type: "events" }],
    }),
    deleteCalendarEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/calendarEvents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "events" }],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCalendarEventsQuery,
  useCreateCalendarEventMutation,
  useEditCalendarEventMutation,
  useDeleteCalendarEventMutation,
} = calendarApi;
