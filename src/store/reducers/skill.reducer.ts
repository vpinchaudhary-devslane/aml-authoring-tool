/* eslint-disable no-case-declarations */
import produce from 'immer';
import { CacheAPIResponse } from '@/lib/utils';
import { Skill } from '@/models/entities/Skill';
import { SkillActionType } from '../actions/actions.constants';
import { SkillActionPayloadType } from '../actions/skill.action';

export type SkillState = SkillActionPayloadType & {
  cachedData: CacheAPIResponse;
  entries: Record<string, Skill>;
  isLoading: boolean;
  latestCount: number;
  error?: string;
};

const initialState: SkillState = {
  isLoading: false,
  filters: {
    searchQuery: '',
    skill_type: '',
    page_no: 1,
  },
  latestCount: 0,
  cachedData: {},
  entries: {},
};

export const skillReducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
  state: SkillState = initialState,
  action: any
) =>
  produce(state, (draft: SkillState) => {
    switch (action.type) {
      case SkillActionType.GET_LIST:
        draft.isLoading = true;
        draft.filters = action.payload.filters;
        break;
      case SkillActionType.GET_LIST_COMPLETED:
        draft.isLoading = false;

        const filterKey = JSON.stringify(state.filters);
        const skillMap = action.payload.skills.reduce(
          (acc: any, skill: Skill) => ({
            ...acc,
            [skill.identifier]: skill,
          }),
          {} as Record<string, Skill>
        );

        draft.entries = { ...state.entries, ...skillMap };
        draft.cachedData[filterKey] = {
          result: action.payload.skills.map((skill: Skill) => skill.identifier),
          totalCount: action.payload.totalCount,
        };
        draft.latestCount = action.payload.totalCount;
        break;
      case SkillActionType.GET_LIST_ERROR:
        draft.isLoading = false;
        draft.error = action.payload;
        break;
      default:
        break;
    }
  });
