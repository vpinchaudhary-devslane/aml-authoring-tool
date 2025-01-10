/* eslint-disable no-case-declarations */
import { CacheAPIResponse } from '@/lib/utils';
import produce from 'immer';
import { Content } from '@/models/entities/Content';
import { ContentActionPayloadType } from '../actions/content.actions';
import { ContentActionType } from '../actions/actions.constants';

export type ContentState = ContentActionPayloadType & {
  cachedData: CacheAPIResponse;
  entities: Record<string, Content>;
  isLoading: boolean;
  actionInProgress: boolean;
  latestCount: number;
  error?: string;
};

const initialState: ContentState = {
  isLoading: false,
  filters: {
    search_query: '',
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entities: {},
  actionInProgress: false,
};

export const contentReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: ContentState = initialState,
  action: any
) =>
  produce(state, (draft: ContentState) => {
    switch (action.type) {
      case ContentActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case ContentActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const contentMap = action.payload.contents.reduce(
          (acc: any, content: Content) => ({
            ...acc,
            [content.identifier]: content,
          }),
          {} as Record<string, Content>
        );

        draft.entities = { ...state.entities, ...contentMap };
        draft.cachedData[filterKey] = {
          result: action.payload.contents.map(
            (content: Content) => content.identifier
          ),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case ContentActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;

      case ContentActionType.GET_BY_ID:
        draft.isLoading = true;
        break;
      case ContentActionType.GET_BY_ID_COMPLETED:
        draft.isLoading = false;
        draft.entities = {
          ...state.entities,
          [action.payload.result.content.identifier]:
            action.payload.result.content,
        };
        break;
      case ContentActionType.GET_BY_ID_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;

      case ContentActionType.CREATE:
      case ContentActionType.CREATE_COMPLETED:
        draft.actionInProgress = true;
        break;
      default:
        break;
    }
  });
