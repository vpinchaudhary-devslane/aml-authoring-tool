import React from 'react';
import QuestionSetContentComponent from './QuestionSetContentComponent';

type QuestionSetDetailContentProps = {
  contentIds: string[];
};

const QuestionSetDetailContent = ({
  contentIds,
}: QuestionSetDetailContentProps) => (
  <div>
    {contentIds.length ? (
      contentIds.map((contentId) => (
        <QuestionSetContentComponent key={contentId} contentId={contentId} />
      ))
    ) : (
      <QuestionSetContentComponent />
    )}
  </div>
);

export default QuestionSetDetailContent;
