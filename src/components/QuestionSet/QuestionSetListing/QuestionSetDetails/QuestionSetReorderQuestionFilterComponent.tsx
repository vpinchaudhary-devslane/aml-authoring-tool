import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SkillType } from '@/models/enums/skillType.enum';
import FormikInfiniteSelect from '@/shared-resources/FormikSelect/FormikInfiniteSelect';
import { getListSkillAction } from '@/store/actions/skill.action';
import {
  isLoadingSkillsSelector,
  l2SkillSelector,
  l3SkillSelector,
} from '@/store/selectors/skill.selector';
import { Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';

type Props = {
  open: boolean;
  onClose: () => void;
  filterState: {
    l2_skill: string;
    l3_skill: string;
  };
  setFilterState: (state: { l2_skill: string; l3_skill: string }) => void;
};

const QuestionSetReorderQuestionFilterComponent = ({
  open,
  onClose,
  filterState,
  setFilterState,
}: Props) => {
  const { result: l2Skills, totalCount: l2SkillsCount } =
    useSelector(l2SkillSelector);
  const { result: l3Skills, totalCount: l3SkillsCount } =
    useSelector(l3SkillSelector);

  const isLoadingSkills = useSelector(isLoadingSkillsSelector);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-[30%] max-h-[95%] overflow-y-auto'>
        <Formik
          initialValues={filterState}
          onSubmit={(values) => {
            setFilterState(values);
            onClose();
          }}
        >
          {(formik) => (
            <form
              onSubmit={formik.handleSubmit}
              className='flex flex-col overflow-x-hidden px-1'
            >
              <h2 className='text-xl font-semibold mb-6'>
                Apply filters - Questions
              </h2>
              <FormikInfiniteSelect
                name='l2_skills'
                label='L2 Skill'
                placeholder='Select L2 skills'
                data={l2Skills}
                labelKey='name.en'
                valueKey='identifier'
                dispatchAction={(payload) =>
                  getListSkillAction({
                    filters: {
                      skill_type: SkillType.L2Skill,
                      search_query: payload.value,
                      page_no: payload.page_no,
                    },
                  })
                }
                isLoading={isLoadingSkills}
                totalCount={l2SkillsCount}
                multiple
              />
              <FormikInfiniteSelect
                name='l3_skills'
                label='L3 Skill'
                placeholder='Select L3 skills'
                data={l3Skills}
                labelKey='name.en'
                valueKey='identifier'
                dispatchAction={(payload) =>
                  getListSkillAction({
                    filters: {
                      skill_type: SkillType.L3Skill,
                      search_query: payload.value,
                      page_no: payload.page_no,
                    },
                  })
                }
                isLoading={isLoadingSkills}
                totalCount={l3SkillsCount}
                multiple
              />
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionSetReorderQuestionFilterComponent;
