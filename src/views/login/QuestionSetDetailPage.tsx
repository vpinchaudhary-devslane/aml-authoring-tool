import QuestionSetQuestionReorderComponent from '@/components/QuestionSet/QuestionSetListing/QuestionSetDetails/QuestionSetQuestionReorderComponent';
import { navigateTo } from '@/store/actions/navigation.action';
import { getQuestionSetAction } from '@/store/actions/questionSet.actions';
import {
  allQuestionSetsSelector,
  isLoadingQuestionSetsSelector,
} from '@/store/selectors/questionSet.selector';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const QuestionSetDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const allQuestionSets = useSelector(allQuestionSetsSelector);
  const isLoadingQuestionSet = useSelector(isLoadingQuestionSetsSelector);
  const questionSet = allQuestionSets?.[id!] ?? {};

  React.useEffect(() => {
    if (!id) {
      dispatch(navigateTo(`/`));
    } else {
      dispatch(
        getQuestionSetAction({
          id,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const questions = questionSet?.questions;

  const dataObject = [
    {
      label: 'Title',
      value: questionSet?.title?.en,
      hasValue: Boolean(questionSet?.title?.en),
    },
    {
      label: 'Repository',
      value: questionSet?.repository?.name?.en,
      hasValue: Boolean(questionSet?.repository?.name?.en),
    },
    {
      label: 'Board',
      value: questionSet?.taxonomy?.board?.name?.en,
      hasValue: Boolean(questionSet?.taxonomy?.board?.name?.en),
    },
    {
      label: 'Class',
      value: questionSet?.taxonomy?.class?.name?.en,
      hasValue: Boolean(questionSet?.taxonomy?.class?.name?.en),
    },
    {
      label: 'L1 Skill',
      value: questionSet?.taxonomy?.l1_skill?.name?.en,
      hasValue: Boolean(questionSet?.taxonomy?.l1_skill?.name?.en),
    },
    {
      label: 'L2 Skills',
      value: questionSet?.taxonomy?.l2_skill?.length
        ? questionSet.taxonomy.l2_skill?.map((l2) => l2.name.en).join(', ')
        : '--',
      hasValue: Boolean(questionSet?.taxonomy?.l2_skill?.length),
    },
    {
      label: 'L3 Skills',
      value: questionSet?.taxonomy?.l3_skill?.length
        ? questionSet.taxonomy.l3_skill.map((l3) => l3.name.en).join(', ')
        : '--',
      hasValue: Boolean(questionSet?.taxonomy?.l3_skill?.length),
    },
    {
      label: 'Purpose',
      value: questionSet?.purpose,
      hasValue: Boolean(questionSet?.purpose),
    },
  ];

  if (isLoadingQuestionSet) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-4 h-full gap-3 flex max-h-[calc(100vh_-_48px)] bg-white shadow rounded-md overflow-hidden'>
      <div className='flex-1'>
        <h1 className='text-2xl font-bold mb-6'>Question Set -Details</h1>
        <div className='grid grid-cols-2 md:grid-cols-2 gap-6'>
          {dataObject.map((item) => (
            <div key={item.label}>
              <h2 className='text-sm font-bold uppercase'>{item.label}</h2>
              <p className='text-lg text-gray-700'>
                {item.hasValue ? item.value : '--'}
              </p>
            </div>
          ))}
        </div>
        <div className='h-0.5 my-5 bg-slate-400 w-full' />
        <div>
          <h1 className='text-2xl font-bold mb-5'>Question Set - Content</h1>
          {JSON.stringify(questionSet?.contents)}
        </div>
      </div>
      <div className='w-0.5 bg-slate-400 h-full' />
      <div className='flex-1 flex flex-col'>
        <h1 className='text-2xl font-bold my-5'>Questions</h1>
        <QuestionSetQuestionReorderComponent
          questions={questions}
          questionSet={questionSet}
        />
      </div>
    </div>
  );
};
export default QuestionSetDetailPage;
