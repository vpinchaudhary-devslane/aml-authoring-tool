import { ContentActionType } from './actions.constants';

export type ContentActionPayloadType = {
  filters: Partial<{
    search_query: string;
    page_no: number;
  }>;
};

export const getListContentAction = (payload: ContentActionPayloadType) => ({
  type: ContentActionType.GET_LIST,
  payload,
});

export const getListContentCompletedAction = (payload: any) => ({
  type: ContentActionType.GET_LIST_COMPLETED,
  payload,
});

export const getListContentErrorAction = (message: string) => ({
  type: ContentActionType.GET_LIST_ERROR,
  payload: message,
});

export const getContentByIdAction = (id: string) => ({
  type: ContentActionType.GET_BY_ID,
  payload: { id },
});

export const getContentByIdCompletedAction = (payload: any) => ({
  type: ContentActionType.GET_BY_ID_COMPLETED,
  payload,
});

export const getContentByIdErrorAction = (message: string) => ({
  type: ContentActionType.GET_BY_ID_ERROR,
  payload: message,
});

export const createContentAction = (payload: any) => ({
  type: ContentActionType.CREATE,
  payload,
});

export const createContentCompletedAction = (payload: any) => ({
  type: ContentActionType.CREATE_COMPLETED,
  payload,
});
